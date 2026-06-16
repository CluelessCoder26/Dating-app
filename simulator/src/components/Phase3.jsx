import React, { useState } from 'react';
import { Heart, X, ShieldAlert, CheckCircle2, Share2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

// Import images from assets
import sophiaImg from '../assets/sophia.png';
import liamImg from '../assets/liam.png';
import emmaImg from '../assets/emma.png';

export default function Phase3() {
  const [cards, setCards] = useState([
    { id: 'sophia', name: 'Sophia', age: 24, bio: 'Coffee lover & urban explorer. Let\'s find the best match latte in SF!', image: sophiaImg, likesMe: true },
    { id: 'liam', name: 'Liam', age: 27, bio: 'Weekend climber and dog dad. Looking for someone to join the crag.', image: liamImg, likesMe: false },
    { id: 'emma', name: 'Emma', age: 25, bio: 'Indie filmmaker. Tell me your favorite movie and why it\'s a masterpiece.', image: emmaImg, likesMe: true }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dbLogs, setDbLogs] = useState([]);
  const [redisPubSub, setRedisPubSub] = useState([]);
  
  // Rate limiter stats
  const [swipeTimestamps, setSwipeTimestamps] = useState([]);
  const [rateLimitError, setRateLimitError] = useState(false);

  const checkRateLimit = () => {
    const now = Date.now();
    const windowStart = now - 10000; // 10 seconds window
    const activeSwipes = swipeTimestamps.filter(t => t > windowStart);
    
    if (activeSwipes.length >= 6) {
      setRateLimitError(true);
      setTimeout(() => setRateLimitError(false), 3000);
      return false;
    }

    setSwipeTimestamps([...activeSwipes, now]);
    return true;
  };

  const handleSwipe = (direction) => {
    if (currentIndex >= cards.length) return;
    if (!checkRateLimit()) {
      const log = `[Rate Limiter] BLOCKED: User 101 exceeded 6 swipes per 10s sliding window limit.`;
      setDbLogs(prev => [log, ...prev].slice(0, 10));
      return;
    }

    const currentCard = cards[currentIndex];
    const isLike = direction === 'right';
    const now = new Date().toISOString();

    let logs = [];
    logs.push(`[API] POST /swipe { targetUserId: "${currentCard.id}", type: "${direction.toUpperCase()}" }`);
    logs.push(`[PostgreSQL] INSERT INTO swipes (swiper_id, target_id, rating, swiped_at) VALUES (101, "${currentCard.id}", "${isLike ? 'like' : 'nope'}", NOW())`);

    if (isLike) {
      logs.push(`[Redis] SADD swipes:user_101:likes "${currentCard.id}"`);
      logs.push(`[Redis] SISMEMBER swipes:${currentCard.id}:likes "user_101"`);

      if (currentCard.likesMe) {
        logs.push(`[Redis] MATCH FOUND! Clearing cached stacked swipes in redis...`);
        logs.push(`[PostgreSQL] INSERT INTO matches (user_1_id, user_2_id, matched_at) VALUES (101, "${currentCard.id}", NOW())`);
        
        const pubSubMsg = `{"eventId": "match_${Date.now()}", "users": ["101", "${currentCard.id}"], "timestamp": "${now}"}`;
        setRedisPubSub(prev => [`[Redis Pub/Sub] PUBLISH match_events: ${pubSubMsg}`, ...prev].slice(0, 5));
        
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }

    setDbLogs(prev => [...logs.reverse(), ...prev].slice(0, 12));
    setCurrentIndex(prev => prev + 1);
  };

  const resetSwiper = () => {
    setCurrentIndex(0);
    setDbLogs([]);
    setRedisPubSub([]);
    setSwipeTimestamps([]);
    setRateLimitError(false);
  };

  const getTransactionCode = () => {
    return `// backend/services/swipe.js
import { prisma } from '../db';
import { redis } from '../cache';

export async function processSwipe(swiperId, targetId, direction) {
  // 1. Sliding window rate limit check
  const now = Date.now();
  const limitKey = \`ratelimit:\${swiperId}\`;
  await redis.zremrangebyscore(limitKey, 0, now - 10000);
  const count = await redis.zcard(limitKey);
  
  if (count >= 60) {
    throw new Error('Rate limit exceeded: max 60 swipes/min');
  }
  await redis.zadd(limitKey, now, now);

  // 2. Write swipe to Postgres for persistence
  const swipe = await prisma.swipe.create({
    data: { swiperId, targetId, direction }
  });

  if (direction === 'nope') return { match: false };

  // 3. Add to User's Likes Redis Set
  await redis.sadd(\`likes:\${swiperId}\`, targetId);

  // 4. Check for mutual like
  const isMutual = await redis.sismember(\`likes:\${targetId}\`, swiperId);
  
  if (isMutual) {
    // 5. Atomic Match Creation
    const match = await prisma.match.create({
      data: { user1Id: swiperId, user2Id: targetId }
    });

    // 6. Broadcast match event via Redis Pub/Sub to WebSockets
    await redis.publish('match_events', JSON.stringify({
      matchId: match.id,
      users: [swiperId, targetId]
    }));

    return { match: true, matchId: match.id };
  }

  return { match: false };
}`;
  };

  return (
    <div className="split-grid animate-fade-in">
      
      {/* Swipe Interface Simulator */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div>
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-pink)', background: 'rgba(255, 45, 122, 0.15)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '16px' }}>
            Phase 3 Simulator
          </span>
          <h2 className="text-2xl font-bold" style={{ margin: '0 0 8px 0' }}>Swipe Actions & Match Engine</h2>
          <p className="text-xs text-muted" style={{ margin: '0 0 24px 0' }}>
            Swipe right for like, left for nope. A mutual match triggers atomic database writes, clears caches, and publishes to Redis.
          </p>

          <div className="swipe-card-deck" style={{ marginBottom: '24px' }}>
            {currentIndex < cards.length ? (
              cards.map((c, index) => {
                if (index < currentIndex) return null;
                const isActive = index === currentIndex;
                
                return (
                  <div
                    key={c.id}
                    className={`glass-panel`}
                    style={{
                      position: 'absolute',
                      width: '220px',
                      height: '310px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      zIndex: isActive ? 20 : 10,
                      transform: isActive ? 'scale(1) rotate(0deg)' : 'scale(0.95) translateY(10px)',
                      opacity: isActive ? 1 : 0.4,
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    <img src={c.image} alt={c.name} style={{ width: '100%', height: '65%', objectFit: 'cover' }} />
                    <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.7)', height: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 className="font-bold text-sm text-white" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {c.name}, <span className="text-muted">{c.age}</span>
                          {c.likesMe && <span style={{ fontSize: '9px', background: 'rgba(255, 45, 122, 0.2)', color: 'var(--color-pink)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Likes You</span>}
                        </h3>
                        <p className="text-[10px] text-muted" style={{ margin: '4px 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>{c.bio}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(255, 45, 122, 0.15)', border: '1px solid var(--color-pink)', color: 'var(--color-pink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                  <Heart size={28} />
                </div>
                <h3 className="text-lg font-bold text-gradient-pink" style={{ margin: 0 }}>No More Profiles Stacked!</h3>
                <p className="text-xs text-muted" style={{ margin: 0 }}>You have cleared your Redis active stack query stack.</p>
                <button onClick={resetSwiper} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '11px', alignSelf: 'center' }}>
                  Reload Profile Stack
                </button>
              </div>
            )}

            {rateLimitError && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(4px)', zIndex: 30, display: 'flex', flexDirection: 'column', itemsCenter: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', borderRadius: '16px', alignItems: 'center' }} className="animate-shake">
                <ShieldAlert size={40} style={{ color: 'var(--color-rose)', marginBottom: '12px' }} />
                <h4 className="text-base font-bold text-white" style={{ margin: 0, color: 'var(--color-rose)' }}>Rate Limit Exceeded</h4>
                <p className="text-xs text-muted" style={{ margin: '8px 0 0 0', maxWidth: '200px' }}>
                  Redis sliding window blocked your request. You swiped too fast! (Limit: 6 swipes/10s).
                </p>
              </div>
            )}
          </div>

          {currentIndex < cards.length && (
            <div className="swipe-card-buttons">
              <button 
                onClick={() => handleSwipe('left')}
                className="pulse-glow-pink"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#0a0810',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-rose)',
                  transition: 'all 0.2s'
                }}
              >
                <X size={24} />
              </button>
              <button 
                onClick={() => handleSwipe('right')}
                className="pulse-glow-pink"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#0a0810',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-pink)',
                  transition: 'all 0.2s'
                }}
              >
                <Heart size={24} fill="currentColor" />
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span className="text-muted">Redis Sliding Window:</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span 
                key={i} 
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: i < swipeTimestamps.length ? 'var(--color-pink)' : 'rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s'
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Under-the-Hood Transactions Side */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 className="font-bold text-sm text-gradient-pink" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> API & Transaction Flow Logs
            </h3>
            <div className="log-box-stream" style={{ height: '200px' }}>
              {dbLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: '80px' }}>Swipe right or left on a card above to inspect the database pipeline.</div>
              ) : (
                dbLogs.map((log, idx) => {
                  let color = 'var(--color-purple)';
                  if (log.startsWith('[PostgreSQL]')) color = 'var(--color-emerald)';
                  if (log.startsWith('[Redis]')) color = 'var(--color-blue)';
                  if (log.includes('BLOCKED')) color = 'var(--color-rose)';
                  if (log.includes('MATCH FOUND')) color = 'var(--color-pink)';
                  return (
                    <div key={idx} style={{ color, paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {log.includes('MATCH FOUND') && <CheckCircle2 size={10} style={{ color: 'var(--color-pink)' }} />}
                      <span>{log}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gradient-blue" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Share2 size={14} /> Redis Pub/Sub Broadcast Log (To Socket.io)
            </h3>
            <div className="log-box-stream" style={{ height: '100px', color: 'var(--color-blue)' }}>
              {redisPubSub.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: '32px' }}>No matching events published. Swipe right on Sophia or Emma to trigger a match.</div>
              ) : (
                redisPubSub.map((pub, idx) => (
                  <div key={idx} style={{ paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '4px' }}>{pub}</div>
                ))
              )}
            </div>
          </div>

          <div>
            <span className="text-dim" style={{ fontSize: '10px', display: 'block', marginBottom: '4px' }}>Transaction implementation file:</span>
            <div className="code-container" style={{ maxHeight: '140px', overflowY: 'auto' }}>
              <pre style={{ margin: 0, fontSize: '9px', lineHeight: '1.3', color: '#a78bfa' }}>
                {getTransactionCode()}
              </pre>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
