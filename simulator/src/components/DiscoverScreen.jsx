import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Heart, X, MapPin, RefreshCw, Sliders, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DiscoverScreen({ userProfile, onOpenChat }) {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [loading, setLoading] = useState(false);
  const [swipeResult, setSwipeResult] = useState(null); // for match overlay
  const [showFilters, setShowFilters] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await api.getDiscover(maxDistance);
      setCandidates(data);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchCandidates();
    }
  }, [maxDistance]);

  const handleSwipe = async (rating) => {
    if (currentIndex >= candidates.length) return;
    const currentCandidate = candidates[currentIndex];
    
    // Slide transition animation helper (handled via index increase)
    setCurrentIndex(prev => prev + 1);

    try {
      const res = await api.swipe(currentCandidate.userId, rating);
      if (res.isMatch) {
        // Trigger confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setSwipeResult({
          match: res.match,
          profile: currentCandidate
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlock = async (candidateUserId) => {
    if (confirm('Are you sure you want to block this user? They will not appear in discovery again.')) {
      try {
        await api.blockUser(candidateUserId);
        setCurrentIndex(prev => prev + 1);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const currentProfile = candidates[currentIndex];

  return (
    <div className="discover-screen flex flex-col items-center py-6 w-full max-w-lg mx-auto">
      {/* Top Controls */}
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
          <span>Discover Match</span>
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary text-xs flex items-center gap-1.5 ${showFilters ? 'border-color-pink text-color-pink' : ''}`}
        >
          <Sliders size={13} /> Filters
        </button>
      </div>

      {/* Discovery distance filter */}
      {showFilters && (
        <div className="glass-panel w-full p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Maximum Distance</span>
            <span className="text-color-pink font-bold">{maxDistance} miles</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      )}

      {/* Swipe Cards Deck */}
      <div className="w-full aspect-[3/4] relative mb-6">
        {loading ? (
          <div className="absolute inset-0 glass-panel flex flex-col items-center justify-center">
            <Loader />
            <p className="text-xs text-muted mt-2">Looking for matches near you...</p>
          </div>
        ) : currentIndex >= candidates.length ? (
          <div className="absolute inset-0 glass-panel flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <MapPin size={24} className="text-muted" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">No One New Around You</h3>
            <p className="text-xs text-dim mb-4">Try increasing your maximum distance range or check back later.</p>
            <button onClick={fetchCandidates} className="btn-primary flex items-center gap-1.5 text-xs">
              <RefreshCw size={13} /> Refresh Feed
            </button>
          </div>
        ) : (
          <div className="card-container absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-end">
            <img
              src={currentProfile.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
              alt={currentProfile.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

            {/* Profile info overlay */}
            <div className="relative p-6 space-y-2 text-white">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{currentProfile.name}</span>
                <span className="text-xl font-medium text-white/90">{currentProfile.age}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-white/80">
                <MapPin size={11} className="text-color-pink" />
                <span>{currentProfile.distanceMiles} miles away</span>
                <span className="mx-1.5">•</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full border border-white/5 font-mono text-[9px]">
                  ELO: {currentProfile.elo}
                </span>
              </div>
              {currentProfile.bio && (
                <p className="text-xs text-white/90 line-clamp-3 leading-relaxed pt-2">
                  {currentProfile.bio}
                </p>
              )}
            </div>

            {/* Quick action block button */}
            <button
              onClick={() => handleBlock(currentProfile.userId)}
              className="absolute top-4 right-4 bg-black/40 hover:bg-rose-600/80 text-white p-2 rounded-xl transition-all"
              title="Block User"
            >
              <ShieldAlert size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Swipe Buttons */}
      {currentIndex < candidates.length && !loading && (
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleSwipe('nope')}
            className="w-14 h-14 rounded-full bg-white/5 hover:bg-rose-500/10 border border-white/15 hover:border-rose-500/40 text-rose-500 flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-color-pink to-color-purple text-white flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 animate-pulse"
          >
            <Heart size={28} className="fill-current" />
          </button>
        </div>
      )}

      {/* Match Overlay Modal */}
      {swipeResult && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-color-pink/15 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-color-pink to-color-purple bg-clip-text text-transparent uppercase tracking-wider mb-2 animate-bounce">
            It's a Match!
          </h1>
          <p className="text-xs text-muted mb-8 text-center">
            You and {swipeResult.profile.name} have liked each other.
          </p>

          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl rotate-[-6deg]">
              <img
                src={userProfile?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500'}
                alt="Me"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl rotate-[6deg]">
              <img
                src={swipeResult.profile.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
                alt={swipeResult.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-3 w-full max-w-xs">
            <button
              onClick={() => {
                const matchId = swipeResult.match.id;
                setSwipeResult(null);
                onOpenChat(matchId, swipeResult.profile);
              }}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Send Message
            </button>
            <button
              onClick={() => setSwipeResult(null)}
              className="w-full btn-secondary py-3 rounded-xl font-bold text-xs uppercase tracking-wider border-white/10 hover:bg-white/5"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex space-x-1 justify-center items-center">
      <div className="h-2 w-2 bg-color-pink rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-color-pink rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-color-pink rounded-full animate-bounce"></div>
    </div>
  );
}
