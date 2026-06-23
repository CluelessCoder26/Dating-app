/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { api } from '../api';
import confetti from 'canvas-confetti';

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

const DiscoveryHeader = ({ onSkip, onOpenFilter }) => (
  <header className="w-full flex justify-between items-center mb-8 max-w-2xl mx-auto px-4 md:px-0">
    <button onClick={onOpenFilter} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 border border-white/60 hover:bg-white/70 transition-colors">
      <span className="material-symbols-outlined text-[#4a5f73]">tune</span>
    </button>
    <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#6FAEFF]">Curated Introduction</span>
    <button onClick={onSkip} className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4a5f73] hover:text-[#1a2b3c] transition-colors duration-300">
      Skip
    </button>
  </header>
);

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
    <button onClick={() => onAction('save')} className="text-[11px] text-[#6FAEFF] font-semibold uppercase tracking-[0.2em] hover:text-[#4F97FF] transition-colors">
      Save for later
    </button>
  </section>
);

const SuggestedProfiles = ({ candidates, currentIndex }) => {
  const upcoming = candidates.slice(currentIndex + 1, currentIndex + 4);
  if (upcoming.length === 0) return null;

  return (
    <section className="w-full max-w-2xl mx-auto py-12">
      <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-8 text-center">Next in queue</h3>
      <div className="flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar px-4 md:px-0">
        {upcoming.map((c, idx) => (
          <div key={idx} className="shrink-0 w-32 md:w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg snap-center opacity-60 blur-[2px]">
            <img src={c.photos?.[0]?.url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=500&sig=${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
};

const EditorialProfile = ({ profile, revealStage, onReveal, onAction, candidates, currentIndex }) => {
  const isStage1 = revealStage === 1;
  const isStage2 = revealStage >= 2;
  const isStage3 = revealStage === 3;
  
  const imageBlur = isStage1 ? 'blur(15px) grayscale(30%)' : isStage2 && !isStage3 ? 'blur(5px) grayscale(10%)' : 'blur(0px)';
  const imageScale = isStage1 ? 1.05 : isStage2 && !isStage3 ? 1.02 : 1;

  const mockPrompts = [
    { label: "A hill I'll die on", answer: "Physical books will always be superior to e-readers." },
    { label: "We'll get along if", answer: "You enjoy silence just as much as deep conversation." }
  ];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  const handleDragEnd = (event, info) => {
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

  return (
    <motion.div 
      style={{ x, y, rotate }}
      drag={isStage1 ? true : "x"} // restrict to x dragging if unlocked or free drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="relative w-full max-w-2xl mx-auto flex flex-col z-10 pt-4 pb-20 px-4 md:px-0 cursor-grab active:cursor-grabbing"
    >
      
      {/* Hero Section */}
      <motion.div 
        layout
        className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(79,151,255,0.15)] bg-white gpu-accelerated mb-12"
      >
        <motion.img 
          src={profile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} 
          className="w-full h-full object-cover transition-all duration-1000 ease-out"
          style={{ filter: imageBlur, transform: `scale(${imageScale})` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#EAF4FF] via-transparent to-transparent opacity-90 pointer-events-none" />

        <div className="absolute bottom-0 w-full p-8 md:p-12 flex flex-col justify-end">
          <motion.h1 layout className="text-5xl md:text-6xl font-light text-[#1a2b3c] tracking-tight mb-2 font-serif drop-shadow-sm">
            {profile.name}
          </motion.h1>
          <motion.p layout className="text-[13px] text-[#4F97FF] font-semibold tracking-widest uppercase mb-4">
            {profile.age} <span className="opacity-40 mx-3">|</span> {profile.distanceMiles ? `${profile.distanceMiles.toFixed(0)} miles` : 'Nearby'}
          </motion.p>
          
          <AnimatePresence mode="wait">
            {isStage1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-start gap-5 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-[#1a2b3c] text-[12px] font-medium tracking-wide">
                  <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                  <span>Loves Weekend Getaways</span>
                </div>
                <p className="text-lg text-[#2b4257] font-serif italic max-w-sm">
                  "{profile.bio ? profile.bio.split('\n\n')[0].substring(0, 50) + '...' : 'Seeking someone to explore quiet coffee shops...'}"
                </p>
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
            <section className="text-center w-full max-w-xl mx-auto px-4 md:px-0">
               <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-6">About</h3>
               <p className="text-2xl md:text-3xl text-[#1a2b3c] font-serif font-light leading-relaxed italic">
                 "{profile.bio ? profile.bio.split('\n\n')[0] : 'Looking for meaningful connections in a noisy world.'}"
               </p>
            </section>

            {/* Interests Section */}
            <section className="w-full max-w-2xl mx-auto">
               <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-6 text-center">Interests</h3>
               <div className="flex flex-wrap justify-center gap-3">
                 {['Art Galleries', 'Late Night Drives', 'Matcha', 'Architecture', 'Vintage Jazz'].map((interest, idx) => (
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

            {/* Stage 2 to 3 Transition Button */}
            {!isStage3 && (
               <motion.div className="flex justify-center mt-4 mb-20">
                 <button onClick={() => onReveal(3)} className="px-8 py-4 bg-white/80 backdrop-blur-xl border border-white text-[#4F97FF] rounded-full text-[13px] font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(79,151,255,0.15)] hover:scale-105 transition-transform duration-500 ease-out">
                   Unlock Full Profile
                 </button>
               </motion.div>
            )}

            {/* Stage 3 (Prompts, Gallery, Actions) */}
            {isStage3 && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-16 w-full"
              >
                {/* Prompts Section */}
                <section className="w-full max-w-xl mx-auto flex flex-col gap-6">
                  {mockPrompts.map((p, i) => (
                    <div key={i} className="bg-white/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/60 shadow-[0_10px_40px_rgba(79,151,255,0.1)] text-center">
                      <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-3">{p.label}</h3>
                      <p className="text-xl text-[#1a2b3c] font-serif leading-relaxed">
                        "{p.answer}"
                      </p>
                    </div>
                  ))}
                </section>

                {/* Gallery Section */}
                <section className="w-full max-w-2xl mx-auto">
                  <h3 className="text-[11px] text-[#6FAEFF] uppercase tracking-[0.3em] font-semibold mb-6 text-center">Gallery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item, idx) => (
                      <div key={idx} className="aspect-square rounded-[24px] overflow-hidden shadow-md bg-white/20">
                         {profile.photos?.[idx] ? (
                           <img src={profile.photos[idx].url} className="w-full h-full object-cover" />
                         ) : (
                           <img src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400&sig=${idx}`} className="w-full h-full object-cover opacity-80" />
                         )}
                      </div>
                    ))}
                  </div>
                </section>

                <DiscoveryActions onAction={onAction} />
                <SuggestedProfiles candidates={candidates} currentIndex={currentIndex} />
                
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FilterSheet = ({ onClose }) => (
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
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase text-[#4a5f73] tracking-wider mb-3">Distance</label>
        <input type="range" className="w-full accent-[#005ab7]" min="1" max="100" defaultValue="25" />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase text-[#4a5f73] tracking-wider mb-3">Age Range</label>
        <div className="flex gap-4">
          <input type="number" placeholder="Min" className="w-full bg-white/50 border border-[#c1c6d7]/30 rounded-xl p-3 text-sm focus:border-[#005ab7] outline-none" defaultValue="18" />
          <input type="number" placeholder="Max" className="w-full bg-white/50 border border-[#c1c6d7]/30 rounded-xl p-3 text-sm focus:border-[#005ab7] outline-none" defaultValue="35" />
        </div>
      </div>
    </div>
    <button onClick={onClose} className="w-full py-4 mt-8 bg-[#005ab7] text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform text-[13px] uppercase tracking-widest">
      Apply Settings
    </button>
  </motion.div>
);

const MatchBloom = ({ matchData, myProfile, onOpenChat, onClose }) => {
  useEffect(() => {
    const end = Date.now() + 3000;
    const colors = ['#ffffff', '#DCEEFF', '#B5D8FF', '#92C4FF'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#EAF4FF] gpu-accelerated"
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 2, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#DCEEFF_50%,_transparent_100%)] mix-blend-overlay"
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.6 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute w-[150vw] h-[150vw] rounded-full bg-[#B5D8FF] blur-[100px] pointer-events-none"
      />

      {/* Floating particles */}
      {Array.from({length: 20}).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-white blur-[2px]"
          initial={{ y: "50vh", x: "50vw", opacity: 0 }}
          animate={{ 
            y: `${Math.random() * 100}vh`, 
            x: `${Math.random() * 100}vw`, 
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{ duration: Math.random() * 10 + 5, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center h-full px-6">
        <motion.h1 
          initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-light text-[#1a2b3c] tracking-wide mb-24 font-serif text-center"
        >
          A connection has bloomed.
        </motion.h1>

        {/* Cinematic Avatars */}
        <div className="relative w-full h-40 flex items-center justify-center mb-24">
          <motion.div 
            initial={{ x: -100, opacity: 0, filter: "blur(20px)" }}
            animate={{ x: -10, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-white overflow-hidden absolute z-20 shadow-[0_20px_50px_rgba(124,183,255,0.4)]"
          >
            <img src={myProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ x: 100, opacity: 0, filter: "blur(20px)" }}
            animate={{ x: 10, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-white overflow-hidden absolute z-10 shadow-[0_20px_50px_rgba(124,183,255,0.4)]"
          >
            <img src={matchData.otherProfile.photos?.[0]?.url} className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
            className="absolute z-0 w-64 h-64 bg-white rounded-full blur-[60px]"
          />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 w-full max-w-xs"
        >
          <button 
            onClick={() => onOpenChat(matchData.matchId, matchData.otherProfile)} 
            className="w-full py-4 bg-gradient-to-r from-[#B5D8FF] to-[#92C4FF] text-[#1a2b3c] font-bold tracking-widest uppercase text-[13px] rounded-full shadow-[0_10px_30px_rgba(79,151,255,0.4)] hover:scale-105 transition-transform duration-700 ease-out"
          >
            Say Hello
          </button>
          <button 
            onClick={onClose} 
            className="w-full py-4 text-[#6FAEFF] font-semibold tracking-widest uppercase text-[13px] rounded-full hover:bg-white/50 transition-colors duration-500 ease-out"
          >
            Return to Discovery
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
    className="w-full flex flex-col items-center justify-center text-center px-8 z-20 pt-32"
  >
    <h2 className="text-3xl md:text-4xl font-light text-[#1a2b3c] mb-6 font-serif tracking-wide">
      The room is quiet.
    </h2>
    <p className="text-[#4a5f73] max-w-sm mx-auto leading-relaxed font-light text-[17px]">
      We are gently searching the atmosphere for someone who matches your energy. Check back soon.
    </p>
  </motion.div>
);

export default function DiscoveryCanvas({ myProfile, onOpenChat, onOpenProfile }) {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // Progression: 1 (Blurred Intro) -> 2 (About + Interests) -> 3 (Prompts + Gallery + Actions)
  const [revealStage, setRevealStage] = useState(1);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const data = await api.getDiscover(25);
      setCandidates(data || []);
      setCurrentIndex(0);
      setRevealStage(1);
    } catch (err) {
      console.warn('Failed to load discovery candidates:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

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
    
    const rating = action === 'interested' ? 'like' : 'nope';
    
    try {
      if (action !== 'save') {
         const res = await api.swipe(currentCandidate.userId, rating);
         if (res.isMatch) {
           setMatchData({ matchId: res.match.id, otherProfile: currentCandidate });
         }
      }
    } catch (err) {
      console.error('Failed to register interaction:', err.message);
    }

    setCurrentIndex(prev => prev + 1);
    setRevealStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
           <DiscoveryHeader onSkip={() => handleAction('pass')} onOpenFilter={() => setShowFilter(true)} />
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
              />
            </AnimatePresence>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <AnimatePresence>
        {matchData && (
          <MatchBloom 
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
            <FilterSheet onClose={() => setShowFilter(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
