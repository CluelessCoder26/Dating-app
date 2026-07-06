/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { api } from '../api';
import confetti from 'canvas-confetti';
import MatchSuccess from './MatchSuccess';

/* ─── DreamyBackground ──────────────────────────────────────────────── */
const DreamyBackground = () => {
  const [particles] = useState(() => Array.from({length: 15}).map(() => ({
    x: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10
  })));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none gpu-accelerated bg-[#EAF4FF]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAF4FF] via-[#DCEEFF] to-[#EAF4FF] opacity-90" />
    <motion.div 
      animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0], opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#B5D8FF] blur-[100px] mix-blend-multiply"
    />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-[#92C4FF] blur-[120px] mix-blend-multiply opacity-50"
    />
    <motion.div 
      animate={{ scale: [1, 1.05, 1], y: [0, -30, 0], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#6FAEFF] blur-[150px] opacity-30"
    />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white blur-[1px]"
          initial={{ y: "110vh", x: `${p.x}vw`, opacity: 0, scale: p.scale }}
          animate={{ y: "-10vh", opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
        />
      ))}
    </div>
  );
};

/* ─── DiscoveryHeader ────────────────────────────────────────────────── */
const DiscoveryHeader = ({ onSkip, onOpenFilter, onUndo, canUndo }) => (
  <header className="w-full flex justify-between items-center mb-8 max-w-2xl mx-auto px-4 md:px-0">
    <div className="flex items-center gap-2">
      <button onClick={onOpenFilter} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 border border-white/60 hover:bg-white/70 transition-colors">
        <span className="material-symbols-outlined text-[#4a5f73]">tune</span>
      </button>
      {canUndo && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={onUndo}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 border border-white/60 hover:bg-white/70 transition-colors"
          title="Undo last action"
        >
          <span className="material-symbols-outlined text-[#4a5f73]">undo</span>
        </motion.button>
      )}
    </div>
    <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#6FAEFF]">Curated Introduction</span>
    <button onClick={onSkip} className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4a5f73] hover:text-[#1a2b3c] transition-colors duration-300">
      Skip
    </button>
  </header>
);

/* ─── DiscoveryActions ───────────────────────────────────────────────── */
const DiscoveryActions = ({ onAction }) => (
  <section className="w-full flex flex-col items-center gap-6 py-12 border-t border-white/40 mt-12 mb-8">
    <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-2">Discovery Actions</h3>
    <div className="flex items-center gap-4 w-full max-w-sm justify-center">
      <button onClick={() => onAction('pass')} className="w-16 h-16 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/70 border border-white/60 text-[#4a5f73] transition-all duration-500 shadow-sm active:scale-90">
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>
      <button onClick={() => onAction('superlike')} className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#92C4FF] to-[#DCEEFF] border border-white hover:scale-105 text-[#1a2b3c] transition-all duration-500 shadow-md active:scale-90">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      </button>
      <button onClick={() => onAction('interested')} className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[#92C4FF] to-[#6FAEFF] text-white shadow-[0_10px_30px_rgba(79,151,255,0.4)] hover:shadow-[0_15px_40px_rgba(79,151,255,0.5)] hover:scale-105 transition-all duration-500 active:scale-90">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
      </button>
    </div>
  </section>
);

/* ─── SuggestedProfiles ──────────────────────────────────────────────── */
const SuggestedProfiles = memo(({ candidates, currentIndex }) => {
  const upcoming = candidates.slice(currentIndex + 1, currentIndex + 4);
  if (upcoming.length === 0) return null;

  return (
    <section className="w-full max-w-2xl mx-auto py-12">
      <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-8 text-center">Next in queue</h3>
      <div className="flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar px-4 md:px-0">
        {upcoming.map((c, idx) => {
          const photo = c.photos?.[0]?.url;
          if (!photo) return null;
          return (
            <div key={c.userId || idx} className="shrink-0 w-32 md:w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg snap-center opacity-60 blur-[2px]">
              <img src={photo} className="w-full h-full object-cover" alt="" loading="lazy" />
            </div>
          );
        })}
      </div>
    </section>
  );
});

/* ─── PhotoCarousel ──────────────────────────────────────────────────── */
const PhotoCarousel = ({ photos, imageFilter, imageScale }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const validPhotos = useMemo(() => (photos || []).filter(p => p?.url), [photos]);

  if (validPhotos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#DCEEFF] to-[#B5D8FF]">
        <span className="material-symbols-outlined text-6xl text-white/60">person</span>
      </div>
    );
  }

  const handleTap = (e) => {
    if (validPhotos.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX > rect.width / 2) {
      setActiveIdx(prev => Math.min(prev + 1, validPhotos.length - 1));
    } else {
      setActiveIdx(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="relative w-full h-full" onClick={handleTap}>
      <AnimatePresence mode="wait">
        <motion.img
          key={validPhotos[activeIdx]?.id || activeIdx}
          src={validPhotos[activeIdx]?.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover transition-all duration-1000 ease-out"
          style={{ filter: imageFilter, transform: `scale(${imageScale})` }}
          alt=""
          loading="lazy"
        />
      </AnimatePresence>
      {/* Dots indicator */}
      {validPhotos.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {validPhotos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Badges ─────────────────────────────────────────────────────────── */
const ProfileBadges = ({ profile }) => {
  const isVerified = profile.user?.emailVerified === true;
  const isOnline = useMemo(() => {
    if (!profile.user?.lastLoginAt) return false;
    const last = new Date(profile.user.lastLoginAt).getTime();
    return (Date.now() - last) < 15 * 60 * 1000;
  }, [profile.user?.lastLoginAt]);

  if (!isVerified && !isOnline) return null;

  return (
    <div className="flex items-center gap-2">
      {isVerified && (
        <div className="flex items-center gap-1 px-2.5 py-1 bg-[#005ab7]/10 rounded-full" title="Verified">
          <span className="material-symbols-outlined text-[14px] text-[#005ab7]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="text-[10px] font-semibold text-[#005ab7] uppercase tracking-wider">Verified</span>
        </div>
      )}
      {isOnline && (
        <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500/10 rounded-full" title="Online now">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">Online</span>
        </div>
      )}
    </div>
  );
};

/* ─── Swipe Overlay ──────────────────────────────────────────────────── */
const SwipeOverlay = ({ direction }) => {
  if (!direction) return null;
  const config = {
    like: { icon: 'favorite', color: 'text-green-500', bg: 'bg-green-500/20', label: 'LIKE' },
    pass: { icon: 'close', color: 'text-red-400', bg: 'bg-red-400/20', label: 'NOPE' },
    superlike: { icon: 'star', color: 'text-[#005ab7]', bg: 'bg-[#005ab7]/20', label: 'SUPER' },
  };
  const c = config[direction];
  if (!c) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[32px] ${c.bg} backdrop-blur-sm pointer-events-none`}
    >
      <span className={`material-symbols-outlined text-7xl ${c.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
      <span className={`text-2xl font-bold tracking-widest mt-2 ${c.color}`}>{c.label}</span>
    </motion.div>
  );
};

/* ─── EditorialProfile (main card) ───────────────────────────────────── */
const EditorialProfile = memo(({ profile, revealStage, onReveal, onAction, candidates, currentIndex, exitDirection }) => {
  const isStage1 = revealStage === 1;
  const isStage2 = revealStage >= 2;
  const isStage3 = revealStage === 3;
  
  const imageBlur = isStage1 ? 'blur(15px) grayscale(30%)' : isStage2 && !isStage3 ? 'blur(5px) grayscale(10%)' : 'blur(0px)';
  const imageScale = isStage1 ? 1.05 : isStage2 && !isStage3 ? 1.02 : 1;

  // Use real interests from profile
  const interests = profile.interests || [];

  // Build bio sections from profile.bio — no mock prompts
  const bioSections = useMemo(() => {
    if (!profile.bio) return [];
    return profile.bio.split('\n\n').filter(s => s.trim().length > 0);
  }, [profile.bio]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  const [overlayDir, setOverlayDir] = useState(null);

  // Show overlay based on drag
  const xVal = useRef(0);
  const yVal = useRef(0);
  useEffect(() => {
    const unsubX = x.on('change', v => {
      xVal.current = v;
      if (v > 60) setOverlayDir('like');
      else if (v < -60) setOverlayDir('pass');
      else if (yVal.current < -60) setOverlayDir('superlike');
      else setOverlayDir(null);
    });
    const unsubY = y.on('change', v => {
      yVal.current = v;
      if (v < -60 && Math.abs(xVal.current) < 60) setOverlayDir('superlike');
    });
    return () => { unsubX(); unsubY(); };
  }, [x, y]);

  const handleDragEnd = (event, info) => {
    setOverlayDir(null);
    const swipeThreshold = 100;
    const superLikeThreshold = -100;
    if (info.offset.x > swipeThreshold) {
      onAction('interested');
    } else if (info.offset.x < -swipeThreshold) {
      onAction('pass');
    } else if (info.offset.y < superLikeThreshold) {
      onAction('superlike');
    }
  };

  // Gallery photos (skip the first/hero — only extra photos)
  const galleryPhotos = useMemo(() => (profile.photos || []).filter(p => p?.url).slice(1), [profile.photos]);

  // Exit animation variants
  const exitVariants = {
    like: { x: 500, rotate: 15, opacity: 0, transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } },
    pass: { x: -500, rotate: -15, opacity: 0, transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } },
    superlike: { y: -600, scale: 0.8, opacity: 0, transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] } },
    default: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const exitAnim = exitVariants[exitDirection] || exitVariants.default;

  return (
    <motion.div 
      style={{ x, y, rotate }}
      drag={isStage1 ? true : "x"}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={exitAnim}
      className="relative w-full max-w-2xl mx-auto flex flex-col z-10 pt-4 pb-20 px-4 md:px-0 cursor-grab active:cursor-grabbing"
    >
      
      {/* Hero Section with Photo Carousel */}
      <motion.div 
        layout
        className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(79,151,255,0.15)] bg-white gpu-accelerated mb-12"
      >
        <PhotoCarousel photos={profile.photos} imageFilter={imageBlur} imageScale={imageScale} />
        
        {/* Swipe overlay */}
        <SwipeOverlay direction={overlayDir} />

        <div className="absolute inset-0 bg-gradient-to-t from-[#EAF4FF] via-transparent to-transparent opacity-90 pointer-events-none" />

        <div className="absolute bottom-0 w-full p-8 md:p-12 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-2">
            <motion.h1 layout className="text-5xl md:text-6xl font-light text-[#1a2b3c] tracking-tight font-serif drop-shadow-sm">
              {profile.name}
            </motion.h1>
            <ProfileBadges profile={profile} />
          </div>
          <motion.p layout className="text-[13px] text-[#4F97FF] font-semibold tracking-widest uppercase mb-4">
            {profile.age} <span className="opacity-40 mx-3">|</span> {profile.distanceMiles ? `${profile.distanceMiles.toFixed(0)} miles` : 'Nearby'}
            {profile.occupation && (<><span className="opacity-40 mx-3">|</span> {profile.occupation}</>)}
          </motion.p>
          
          <AnimatePresence mode="wait">
            {isStage1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-start gap-5 mt-4">
                {interests.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-[#1a2b3c] text-[12px] font-medium tracking-wide">
                    <span className="material-symbols-outlined text-[16px]">interests</span>
                    <span>{interests[0]}</span>
                  </div>
                )}
                {bioSections.length > 0 && (
                  <p className="text-lg text-[#2b4257] font-serif italic max-w-sm">
                    "{bioSections[0].length > 80 ? bioSections[0].substring(0, 80) + '...' : bioSections[0]}"
                  </p>
                )}
                <div className="flex gap-3 w-full">
                  <button onClick={() => onReveal(2)} className="flex-1 py-4 bg-gradient-to-r from-[#B5D8FF] to-[#92C4FF] text-white rounded-full text-[13px] font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(79,151,255,0.3)] hover:scale-105 transition-transform duration-500 ease-out">
                    Reveal More
                  </button>
                  <button onClick={() => onReveal(3)} className="w-14 h-14 flex items-center justify-center bg-white/40 border border-white text-[#4F97FF] rounded-full hover:bg-white/70 transition-colors shadow-sm">
                    <span className="material-symbols-outlined">expand_circle_up</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progressive Details */}
      <AnimatePresence>
        {isStage2 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-16 w-full"
          >
            {/* About Section */}
            {bioSections.length > 0 && (
              <section className="text-center w-full max-w-xl mx-auto px-4 md:px-0">
                 <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-6">About</h3>
                 <p className="text-2xl md:text-3xl text-[#1a2b3c] font-serif font-light leading-relaxed italic">
                   "{bioSections[0]}"
                 </p>
              </section>
            )}

            {/* Interests Section */}
            {interests.length > 0 && (
              <section className="w-full max-w-2xl mx-auto">
                 <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-6 text-center">Interests</h3>
                 <div className="flex flex-wrap justify-center gap-3">
                   {interests.map((interest, idx) => (
                     <motion.div 
                       key={idx}
                       initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
                       className="px-5 py-3 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-[#2b4257] text-[13px] font-medium tracking-wide"
                     >
                       {interest}
                     </motion.div>
                   ))}
                 </div>
              </section>
            )}

            {/* Stage 2 to 3 Transition Button */}
            {!isStage3 && (
               <motion.div className="flex justify-center mt-4 mb-20">
                 <button onClick={() => onReveal(3)} className="px-8 py-4 bg-white/80 backdrop-blur-xl border border-white text-[#4F97FF] rounded-full text-[13px] font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(79,151,255,0.15)] hover:scale-105 transition-transform duration-500 ease-out">
                   Unlock Full Profile
                 </button>
               </motion.div>
            )}

            {/* Stage 3 (Bio excerpts, Gallery, Actions) */}
            {isStage3 && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-16 w-full"
              >
                {/* Additional bio sections (if multiple paragraphs) */}
                {bioSections.length > 1 && (
                  <section className="w-full max-w-xl mx-auto flex flex-col gap-6">
                    {bioSections.slice(1).map((section, i) => (
                      <div key={i} className="bg-white/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/60 shadow-[0_10px_40px_rgba(79,151,255,0.1)] text-center">
                        <p className="text-xl text-[#1a2b3c] font-serif leading-relaxed">
                          "{section}"
                        </p>
                      </div>
                    ))}
                  </section>
                )}

                {/* Gallery Section — only real photos */}
                {galleryPhotos.length > 0 && (
                  <section className="w-full max-w-2xl mx-auto">
                    <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-6 text-center">Gallery</h3>
                    <div className={`grid gap-4 ${galleryPhotos.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-2'}`}>
                      {galleryPhotos.map((photo, idx) => (
                        <div key={photo.id || idx} className="aspect-square rounded-[24px] overflow-hidden shadow-md bg-white/20">
                          <img src={photo.url} className="w-full h-full object-cover" alt="" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <DiscoveryActions onAction={onAction} />
                <SuggestedProfiles candidates={candidates} currentIndex={currentIndex} />
                
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

/* ─── FilterSheet (wired to API) ─────────────────────────────────────── */
const FilterSheet = ({ onClose, onApply }) => {
  const [distance, setDistance] = useState(25);
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(35);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.getDiscoveryPreferences().then(prefs => {
      if (cancelled) return;
      if (prefs.maxDistance != null) setDistance(prefs.maxDistance);
      if (prefs.ageMin != null) setAgeMin(prefs.ageMin);
      if (prefs.ageMax != null) setAgeMax(prefs.ageMax);
    }).catch(err => {
      console.warn('Failed to load discovery preferences:', err.message);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleApply = async () => {
    setSaving(true);
    try {
      await api.updateDiscoveryPreferences({ maxDistance: distance, ageMin, ageMax });
      onApply(distance);
    } catch (err) {
      console.error('Failed to save discovery preferences:', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-x-0 bottom-0 z-[200] bg-white/90 backdrop-blur-3xl rounded-t-[32px] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-white/60 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-[#1a2b3c] font-serif">Discovery Settings</h3>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="w-3 h-3 rounded-full bg-[#6FAEFF]" />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-[#4a5f73] tracking-wider mb-3">
              Distance — {distance} miles
            </label>
            <input
              type="range"
              className="w-full accent-[#005ab7]"
              min="1"
              max="100"
              value={distance}
              onChange={e => setDistance(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#4a5f73] tracking-wider mb-3">Age Range</label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min"
                className="w-full bg-white/50 border border-[#c1c6d7]/30 rounded-xl p-3 text-sm focus:border-[#005ab7] outline-none"
                value={ageMin}
                onChange={e => setAgeMin(Number(e.target.value))}
                min={18}
                max={100}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full bg-white/50 border border-[#c1c6d7]/30 rounded-xl p-3 text-sm focus:border-[#005ab7] outline-none"
                value={ageMax}
                onChange={e => setAgeMax(Number(e.target.value))}
                min={18}
                max={100}
              />
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleApply}
        disabled={saving || loading}
        className="w-full py-4 mt-8 bg-[#005ab7] text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform text-[13px] uppercase tracking-widest disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Apply Settings'}
      </button>
    </motion.div>
  );
};

/* ─── EmptyState ─────────────────────────────────────────────────────── */
const EmptyState = ({ onRefresh }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
    className="w-full flex flex-col items-center justify-center text-center px-8 z-20 pt-32"
  >
    <h2 className="text-3xl md:text-4xl font-light text-[#1a2b3c] mb-6 font-serif tracking-wide">
      The room is quiet.
    </h2>
    <p className="text-[#4a5f73] max-w-sm mx-auto leading-relaxed font-light text-[17px] mb-8">
      We are gently searching the atmosphere for someone who matches your energy. Check back soon.
    </p>
    <button
      onClick={onRefresh}
      className="px-8 py-4 bg-gradient-to-r from-[#B5D8FF] to-[#92C4FF] text-white rounded-full text-[13px] font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(79,151,255,0.3)] hover:scale-105 transition-transform duration-500 ease-out"
    >
      Refresh
    </button>
  </motion.div>
);

/* ─── Main DiscoveryCanvas ───────────────────────────────────────────── */
const PREFETCH_THRESHOLD = 3;

export default function DiscoveryCanvas({ myProfile, onOpenChat, onOpenProfile }) {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [maxDistance, setMaxDistance] = useState(25);
  
  // Pagination
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const fetchingMore = useRef(false);
  
  // Dedup
  const seenIds = useRef(new Set());
  
  // Undo
  const [lastAction, setLastAction] = useState(null); // { profile, action }
  
  // Exit animation direction
  const [exitDirection, setExitDirection] = useState(null);
  
  // Progression: 1 (Blurred Intro) -> 2 (About + Interests) -> 3 (Prompts + Gallery + Actions)
  const [revealStage, setRevealStage] = useState(1);

  const dedup = useCallback((profiles) => {
    const fresh = [];
    for (const p of profiles) {
      if (!seenIds.current.has(p.userId)) {
        fresh.push(p);
      }
    }
    return fresh;
  }, []);

  const markSeen = useCallback((profiles) => {
    for (const p of profiles) {
      seenIds.current.add(p.userId);
    }
  }, []);

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDiscover(maxDistance);
      const profiles = dedup(data?.profiles || []);
      markSeen(profiles);
      setCandidates(profiles);
      setCurrentIndex(0);
      setRevealStage(1);
      setNextCursor(data?.pagination?.nextCursor || null);
      setHasMore(data?.pagination?.hasMore || false);
      setLastAction(null);
      setExitDirection(null);
    } catch (err) {
      console.warn('Failed to load discovery candidates:', err.message);
    } finally {
      setLoading(false);
    }
  }, [maxDistance, dedup, markSeen]);

  const loadMore = useCallback(async () => {
    if (fetchingMore.current || !hasMore || !nextCursor) return;
    fetchingMore.current = true;
    try {
      const data = await api.getDiscoverNext(nextCursor, maxDistance);
      const profiles = dedup(data?.profiles || []);
      markSeen(profiles);
      if (profiles.length > 0) {
        setCandidates(prev => [...prev, ...profiles]);
      }
      setNextCursor(data?.pagination?.nextCursor || null);
      setHasMore(data?.pagination?.hasMore || false);
    } catch (err) {
      console.warn('Failed to load more candidates:', err.message);
    } finally {
      fetchingMore.current = false;
    }
  }, [hasMore, nextCursor, maxDistance, dedup, markSeen]);

  // Initial load
  useEffect(() => {
    loadCandidates();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Prefetch when approaching end
  useEffect(() => {
    const remaining = candidates.length - currentIndex;
    if (remaining <= PREFETCH_THRESHOLD && hasMore) {
      loadMore();
    }
  }, [currentIndex, candidates.length, hasMore, loadMore]);

  // Socket: match_created
  useEffect(() => {
    const socket = api.getSocket();
    if (socket) {
      socket.on('match_created', (data) => {
        const otherUserId = data.user1Id === myProfile.userId ? data.user2Id : data.user1Id;
        const matchedCand = candidates.find(c => c.userId === otherUserId);
        
        if (matchedCand) {
          setMatchData({ matchId: data.matchId, otherProfile: matchedCand });
        } else {
          api.getProfile(otherUserId).then(p => {
            setMatchData({ matchId: data.matchId, otherProfile: p });
          });
        }
      });
      return () => socket.off('match_created');
    }
  }, [candidates, myProfile]);

  const handleAction = async (action) => {
    if (currentIndex >= candidates.length) return;
    const currentCandidate = candidates[currentIndex];
    
    // Map UI action names to API action strings
    const actionMap = {
      interested: 'LIKE',
      pass: 'PASS',
      superlike: 'SUPER_LIKE',
    };

    // Set exit direction for animation
    const dirMap = { interested: 'like', pass: 'pass', superlike: 'superlike' };
    setExitDirection(dirMap[action] || null);

    const apiAction = actionMap[action];
    
    try {
      if (apiAction) {
        const res = await api.swipe(currentCandidate.userId, apiAction);
        if (res.isMatch) {
          setMatchData({ matchId: res.match.id, otherProfile: currentCandidate });
        }
        // Store for undo (only for swipe actions)
        setLastAction({ profile: currentCandidate, action: apiAction, index: currentIndex });
      }
    } catch (err) {
      console.error('Failed to register interaction:', err.message);
    }

    // Small delay to let exit animation play
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setRevealStage(1);
      setExitDirection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    try {
      await api.undoSwipe(lastAction.profile.userId);
      // Restore: go back to the previous card
      setCurrentIndex(lastAction.index);
      setRevealStage(1);
      setExitDirection(null);
      setLastAction(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to undo swipe:', err.message);
    }
  };

  const handleFilterApply = (newDistance) => {
    setMaxDistance(newDistance);
    setShowFilter(false);
    // Reset seen IDs so fresh results come back
    seenIds.current = new Set();
    // Reload candidates with new prefs
    setLoading(true);
    api.getDiscover(newDistance).then(data => {
      const profiles = dedup(data?.profiles || []);
      markSeen(profiles);
      setCandidates(profiles);
      setCurrentIndex(0);
      setRevealStage(1);
      setNextCursor(data?.pagination?.nextCursor || null);
      setHasMore(data?.pagination?.hasMore || false);
      setLastAction(null);
      setExitDirection(null);
    }).catch(err => {
      console.warn('Failed to reload after filter:', err.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  const activeCandidate = candidates[currentIndex];

  return (
    <div className="relative w-full min-h-screen bg-[#EAF4FF] font-sans text-[#1a2b3c] overflow-x-hidden selection:bg-[#B5D8FF]">
      <style>{`
        html, body {
          scroll-behavior: smooth;
          background-color: #EAF4FF;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        .gpu-accelerated {
          will-change: transform;
          transform: translateZ(0);
        }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(111,174,255,0.3); border-radius: 4px; }
      `}</style>
      
      <DreamyBackground />
      
      {/* We do NOT restrict height or lock viewport. This allows the body to naturally scroll the entire document. */}
      <div className="relative z-10 flex flex-col items-center w-full min-h-screen pt-20">
        
        {activeCandidate && !loading && (
           <DiscoveryHeader
             onSkip={() => handleAction('pass')}
             onOpenFilter={() => setShowFilter(true)}
             onUndo={handleUndo}
             canUndo={!!lastAction}
           />
        )}

        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          {loading ? (
            <div className="w-full pt-32 flex justify-center">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-3 h-3 rounded-full bg-[#6FAEFF]" />
            </div>
          ) : activeCandidate ? (
            <AnimatePresence mode="wait">
              <EditorialProfile 
                key={activeCandidate.userId} 
                profile={activeCandidate} 
                revealStage={revealStage} 
                onReveal={setRevealStage} 
                onAction={handleAction} 
                candidates={candidates}
                currentIndex={currentIndex}
                exitDirection={exitDirection}
              />
            </AnimatePresence>
          ) : (
            <EmptyState onRefresh={() => {
              seenIds.current = new Set();
              loadCandidates();
            }} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {matchData && (
          <MatchSuccess 
            matchData={matchData} 
            myProfile={myProfile} 
            onOpenChat={onOpenChat}
            onClose={() => setMatchData(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]"
              onClick={() => setShowFilter(false)}
            />
            <FilterSheet onClose={() => setShowFilter(false)} onApply={handleFilterApply} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
