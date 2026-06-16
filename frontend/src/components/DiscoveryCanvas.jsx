import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import confetti from 'canvas-confetti';

export default function DiscoveryCanvas({ myProfile, onOpenChat, onOpenProfile }) {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(25);
  const [matchData, setMatchData] = useState(null); // { matchId, otherProfile }

  // Drag Gesture States
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const data = await api.getDiscover(distance);
      setCandidates(data || []);
      setCurrentIndex(0);
    } catch (err) {
      console.warn('Failed to load discovery candidates:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [distance]);

  // Handle socket match notification
  useEffect(() => {
    const socket = api.getSocket();
    if (socket) {
      socket.on('match_created', (data) => {
        // Find if this other user profile is in our candidates
        const otherUserId = data.user1Id === myProfile.userId ? data.user2Id : data.user1Id;
        const matchedCand = candidates.find(c => c.userId === otherUserId);
        
        triggerConfetti();
        if (matchedCand) {
          setMatchData({
            matchId: data.matchId,
            otherProfile: matchedCand
          });
        } else {
          // Fetch their profile
          api.getProfile(otherUserId).then(p => {
            setMatchData({
              matchId: data.matchId,
              otherProfile: p
            });
          });
        }
      });

      return () => {
        socket.off('match_created');
      };
    }
  }, [candidates, myProfile]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= candidates.length) return;
    const currentCandidate = candidates[currentIndex];
    
    // Swipe animation exit
    const rating = direction === 'right' ? 'like' : 'nope';
    
    try {
      const res = await api.swipe(currentCandidate.userId, rating);
      if (res.isMatch) {
        triggerConfetti();
        setMatchData({
          matchId: res.match.id,
          otherProfile: currentCandidate
        });
      }
    } catch (err) {
      console.error('Failed to register swipe:', err.message);
    }

    // Move to next card
    setCurrentIndex(prev => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  // Drag Gesture Listeners
  const handleDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const diffX = clientX - dragStart.x;
    const diffY = clientY - dragStart.y;
    setDragOffset({ x: diffX, y: diffY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Threshold for swipe
    if (dragOffset.x > 120) {
      handleSwipe('right');
    } else if (dragOffset.x < -120) {
      handleSwipe('left');
    } else {
      // Return to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Inline styling for the swiped card
  const rotation = dragOffset.x / 15;
  const cardStyle = isDragging
    ? {
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        transition: 'none',
        cursor: 'grabbing'
      }
    : {
        transform: 'translateX(0) translateY(0) rotate(0)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'grab'
      };

  const activeCandidate = candidates[currentIndex];

  return (
    <div className="relative flex-grow flex flex-col justify-center items-center pt-16 pb-24 w-full h-full select-none overflow-hidden bg-background">
      
      {/* Top Filter Bar */}
      <div className="absolute top-4 w-full flex justify-between items-center px-6 z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-secondary">Distance Limit:</span>
          <select 
            value={distance} 
            onChange={(e) => setDistance(parseInt(e.target.value))}
            className="text-xs bg-white/50 border border-outline-variant/30 rounded-full py-1 px-3 outline-none font-bold text-primary"
          >
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
            <option value={100}>100 miles</option>
          </select>
        </div>
        
        <button onClick={() => loadCandidates()} className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center text-primary bg-white/40 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-sm font-semibold text-secondary">Searching for sparks near you...</p>
        </div>
      ) : activeCandidate ? (
        <div className="w-full flex-grow flex flex-col items-center justify-center relative">
          
          {/* Card Container */}
          <div 
            ref={cardRef}
            style={cardStyle}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            className="relative w-[92%] h-[70vh] max-w-[400px] rounded-[32px] overflow-hidden premium-shadow group bg-surface shadow-xl border border-outline-variant/10"
          >
            {/* Portrait Image */}
            <img 
              alt={activeCandidate.name} 
              src={activeCandidate.photos?.find(p => p.isPrimary)?.url || activeCandidate.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
              className="w-full h-full object-cover pointer-events-none" 
            />

            {/* Spark Indicator Overlay (pulsing violet dot) */}
            <div className="absolute top-6 right-6">
              <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center spark-pulse shadow-lg">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
            </div>

            {/* Glass Info Panel Overlay */}
            <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-[24px] p-6 flex flex-col gap-2 pointer-events-none">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface">{activeCandidate.name}, {activeCandidate.age}</h2>
                  <div className="flex items-center gap-1 text-on-surface-variant mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                    <span className="text-xs font-semibold">{activeCandidate.distanceMiles ? `${activeCandidate.distanceMiles.toFixed(1)} miles away` : 'Nearby'}</span>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Premium Match</span>
                </div>
              </div>

              {/* Bio summary */}
              {activeCandidate.bio && (
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mt-2">
                  {activeCandidate.bio.split('\n\n')[0]}
                </p>
              )}

              {/* Bio interests chips extraction */}
              {activeCandidate.bio && activeCandidate.bio.includes('Interests: ') && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeCandidate.bio.split('Interests: ')[1].split(', ').slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-white/60 border border-silver/20 rounded-full text-[10px] font-semibold text-tertiary capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Swipe Helpers Visual Indicators */}
            {dragOffset.x > 30 && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-primary text-primary font-bold text-2xl px-6 py-2 rounded-xl rotate-[-12deg] tracking-widest uppercase">
                  LIKE
                </div>
              </div>
            )}
            {dragOffset.x < -30 && (
              <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-red-500 text-red-500 font-bold text-2xl px-6 py-2 rounded-xl rotate-[12deg] tracking-widest uppercase">
                  NOPE
                </div>
              </div>
            )}
          </div>

          {/* Swipe Buttons Bar */}
          <div className="flex items-center justify-center gap-8 mt-6 z-10 w-full">
            {/* Dislike button */}
            <button 
              onClick={() => handleSwipe('left')}
              className="w-14 h-14 rounded-full flex items-center justify-center glass-panel border border-outline-variant/40 hover:bg-red-50 hover:text-red-500 text-secondary active:scale-90 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
            {/* Superlike / Spark button */}
            <button 
              onClick={() => handleSwipe('right')}
              className="w-11 h-11 rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/10 text-primary bg-white/60 active:scale-90 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">star</span>
            </button>
            {/* Like button */}
            <button 
              onClick={() => handleSwipe('right')}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white active:scale-90 transition-all shadow-lg hover:shadow-primary/30"
            >
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </button>
          </div>
          
        </div>
      ) : (
        /* Empty Stack State */
        <div className="flex flex-col items-center justify-center text-center px-8 flex-grow">
          <div className="relative w-36 h-36 mb-6">
            <div className="absolute inset-0 bg-primary/5 rounded-full border border-primary/20 animate-ping opacity-75"></div>
            <div className="absolute inset-3 bg-primary/10 rounded-full border border-primary/30 animate-pulse"></div>
            <div className="absolute inset-8 bg-white glass-panel rounded-full flex items-center justify-center shadow-lg border border-primary/20">
              <span className="material-symbols-outlined text-primary text-4xl animate-bounce">location_on</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">No profiles nearby</h3>
          <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
            Try expanding your distance search parameters above or check back in a little bit!
          </p>
        </div>
      )}

      {/* MATCH CELEBRATION OVERLAY */}
      {matchData && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center text-center animate-in fade-in duration-500 overflow-hidden h-screen w-screen">
          {/* Animated Background Gradients & Glints */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#e3f2fd] via-white to-[#f9f9ff] z-0 opacity-90"></div>
          
          <main className="relative z-10 flex flex-col items-center w-full max-w-lg px-6">
            <div className="mb-8">
              <h1 className="font-premium-serif text-5xl font-bold text-primary mb-3 text-glow leading-tight animate-bounce">It's a Spark!</h1>
              <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
                You and {matchData.otherProfile.name} have found a meaningful connection.
              </p>
            </div>

            {/* Avatars Section */}
            <div className="relative flex items-center justify-center gap-12 my-8 w-full">
              {/* User Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden animate-float">
                <img 
                  alt="Your Profile" 
                  src={myProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {/* Elena/Other Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden animate-float" style={{ animationDelay: '0.4s' }}>
                <img 
                  alt={matchData.otherProfile.name} 
                  src={matchData.otherProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {/* Core Overlay Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-4 h-4 rounded-full bg-tertiary-fixed-dim blur-md scale-[15] opacity-25"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
              <button 
                onClick={() => {
                  const mId = matchData.matchId;
                  const profile = matchData.otherProfile;
                  setMatchData(null);
                  onOpenChat(mId, profile);
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-lg hover:opacity-95 active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                Send a Message
              </button>
              <button 
                onClick={() => {
                  setMatchData(null);
                }}
                className="w-full py-4 bg-white/60 text-primary font-bold rounded-full border border-outline-variant hover:bg-surface-container-low active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                Keep Discovering
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
