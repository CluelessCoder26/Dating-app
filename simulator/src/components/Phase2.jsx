import React, { useState, useEffect } from 'react';
import { Compass, Database, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function Phase2() {
  const [userLat, setUserLat] = useState(37.7749); // SF Coordinates default
  const [userLng, setUserLng] = useState(-122.4194);
  const [maxDistance, setMaxDistance] = useState(10); // miles

  // Mock candidates
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Sophia', lat: 37.7858, lng: -122.4008, baseElo: 1200, currentElo: 1200, age: 24 },
    { id: 2, name: 'Liam', lat: 37.7599, lng: -122.4368, baseElo: 1100, currentElo: 1100, age: 27 },
    { id: 3, name: 'Emma', lat: 37.8012, lng: -122.4124, baseElo: 1250, currentElo: 1250, age: 25 },
    { id: 4, name: 'Ava', lat: 37.7214, lng: -122.4794, baseElo: 1050, currentElo: 1050, age: 23 },
    { id: 5, name: 'Noah', lat: 38.0010, lng: -122.1245, baseElo: 1180, currentElo: 1180, age: 28 } // Further away
  ]);

  const [redisSortedSet, setRedisSortedSet] = useState([]);
  const [eloLog, setEloLog] = useState([]);

  // Calculate distance between user and candidates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const rebuildRedisStack = () => {
    const updated = candidates.map(c => {
      const distance = calculateDistance(userLat, userLng, c.lat, c.lng);
      const distanceFactor = distance <= 0.1 ? 500 : Math.min(500, (1 / distance) * 150);
      const score = Math.round(c.currentElo * 0.4 + distanceFactor);
      const inRange = distance <= maxDistance;
      return { ...c, distance: distance.toFixed(2), score, inRange };
    });

    const redisStack = updated
      .filter(c => c.inRange)
      .sort((a, b) => b.score - a.score);

    setRedisSortedSet(redisStack);
  };

  useEffect(() => {
    rebuildRedisStack();
  }, [userLat, userLng, maxDistance, candidates]);

  const handleEloSwipe = (candidateId, swipedLike) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        const adjustment = swipedLike ? 32 : -16;
        const newElo = Math.max(800, c.currentElo + adjustment);
        const logMsg = `[BullMQ ELO Worker] Job elo_${Date.now()}: Recalculating ${c.name}'s ELO. Swipe: ${swipedLike ? 'LIKE' : 'NOPE'}. ELO updated ${c.currentElo} -> ${newElo}`;
        setEloLog(logs => [logMsg, ...logs].slice(0, 8));
        return { ...c, currentElo: newElo };
      }
      return c;
    }));
  };

  const getPostGisQuery = () => {
    return `-- db/queries/discovery.sql
-- Find profiles within ${maxDistance} miles of current user coordinates
-- 1609.34 meters = 1 mile
SELECT 
  p.user_id, 
  p.name, 
  ST_Distance(p.geom, ST_SetSRID(ST_Point(${userLng.toFixed(5)}, ${userLat.toFixed(5)}), 4326)::geography) / 1609.34 AS distance_miles
FROM profiles p
WHERE ST_DWithin(
  p.geom, 
  ST_SetSRID(ST_Point(${userLng.toFixed(5)}, ${userLat.toFixed(5)}), 4326)::geography, 
  ${maxDistance} * 1609.34
)
ORDER BY distance_miles ASC
LIMIT 50;`;
  };

  const getRedisCommands = () => {
    return `# Caching Candidate Stack (Redis Sorted Sets)
# Key: candidates:user_current
# ZADD key score member

${redisSortedSet.map(c => `ZADD discovery:user_101 ${c.score} "user_${c.id}"  # ${c.name} (Dist: ${c.distance} mi, ELO: ${c.currentElo})`).join('\n')}

# Fetch top 10 closest & highly scored candidates
ZREVRANGEBYSCORE discovery:user_101 +inf -inf LIMIT 0 10`;
  };

  return (
    <div className="split-grid animate-fade-in">
      
      {/* Geolocation Map & Coordinates Slider */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-blue)', background: 'rgba(0, 188, 255, 0.15)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '16px' }}>
            Phase 2 Simulator
          </span>
          <h2 className="text-2xl font-bold" style={{ margin: '0 0 8px 0' }}>Discovery & Matching Engine</h2>
          <p className="text-xs text-muted" style={{ margin: '0 0 24px 0' }}>
            Drag the sliders to simulate GPS movement. The system recalculates distance using **PostGIS** and updates the **Redis Sorted Set** ranking cache.
          </p>

          <div className="location-slider-container">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Latitude (Y coordinate)</span>
                <span style={{ color: 'var(--color-blue)' }}>{userLat.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="37.7000"
                max="37.8500"
                step="0.001"
                value={userLat}
                onChange={(e) => setUserLat(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-blue)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Longitude (X coordinate)</span>
                <span style={{ color: 'var(--color-blue)' }}>{userLng.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="-122.5000"
                max="-122.3800"
                step="0.001"
                value={userLng}
                onChange={(e) => setUserLng(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-blue)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Maximum Match Radius</span>
                <span style={{ color: 'var(--color-blue)' }}>{maxDistance} Miles</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-blue)' }}
              />
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '16px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <h3 className="text-xs font-bold uppercase text-muted" style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={13} className="text-color-blue" />
              Interactive Location Map Grid (San Francisco)
            </h3>
            
            <div className="relative" style={{ width: '100%', height: '180px', backgroundColor: '#020105', border: '1px solid var(--border-glass)', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Map grid lines */}
              <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', opacity: 0.05, pointerEvents: 'none' }}>
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} style={{ border: '1px solid white' }}></div>
                ))}
              </div>

              {/* Current User Marker */}
              <div 
                className="absolute pulse-glow-pink"
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'rgba(0, 188, 255, 0.2)',
                  border: '2px solid var(--color-blue)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: `${((37.85 - userLat) / 0.15) * 100}%`,
                  left: `${((userLng + 122.5) / 0.12) * 100}%`,
                  transition: 'all 0.1s ease',
                  zIndex: 10
                }}
              >
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-blue)', borderRadius: '50%' }}></div>
                <span className="absolute text-[9px] bg-black/80 text-color-blue font-bold" style={{ top: '-20px', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>You</span>
              </div>

              {/* Candidates markers */}
              {candidates.map(c => {
                const distance = calculateDistance(userLat, userLng, c.lat, c.lng);
                const inRange = distance <= maxDistance;
                return (
                  <div
                    key={c.id}
                    className="absolute"
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: inRange ? 'rgba(255, 45, 122, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1.5px solid ${inRange ? 'var(--color-pink)' : 'rgba(255,255,255,0.2)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: `${((37.85 - c.lat) / 0.15) * 100}%`,
                      left: `${((c.lng + 122.5) / 0.12) * 100}%`,
                      opacity: inRange ? 1 : 0.3,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="absolute text-[8px] bg-black/70 text-white font-medium" style={{ bottom: '-16px', padding: '1px 4px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                      {c.name} ({distance.toFixed(1)}m)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => handleEloSwipe(1, true)}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '11px', padding: '8px', justifyContent: 'center' }}
          >
            Swipe Right Sophia (+32 ELO)
          </button>
          <button 
            onClick={() => handleEloSwipe(1, false)}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '11px', padding: '8px', justifyContent: 'center' }}
          >
            Swipe Left Sophia (-16 ELO)
          </button>
        </div>
      </div>

      {/* Database Query & Caching Engine Side */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 className="font-bold text-sm text-gradient-pink" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={14} /> PostGIS Spatial SQL Execution
            </h3>
            <div className="code-container" style={{ height: '140px' }}>
              <pre style={{ margin: 0, fontSize: '9px', lineHeight: '1.3', color: '#34d399' }}>
                {getPostGisQuery()}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gradient-blue" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} /> Redis Sorted Sets Cache State
            </h3>
            <div className="code-container" style={{ height: '140px' }}>
              <pre style={{ margin: 0, fontSize: '9px', lineHeight: '1.3', color: '#22d3ee' }}>
                {getRedisCommands()}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted" style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={12} /> Asynchronous ELO Scoring Logs (BullMQ Background Worker)
            </h3>
            <div className="log-box-stream" style={{ height: '100px' }}>
              {eloLog.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: '24px' }}>No background ELO jobs processed yet. Click a swipe simulation button on the left.</div>
              ) : (
                eloLog.map((log, idx) => (
                  <div key={idx} style={{ paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '4px', color: 'var(--color-amber)' }}>{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
