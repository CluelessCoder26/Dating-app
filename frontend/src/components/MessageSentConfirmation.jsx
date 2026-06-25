import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MessageSentConfirmation({ matchProfile, myProfile, onComplete, onViewAllMatches, onBackToDiscovery }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const moveX = (e.clientX - window.innerWidth / 2) / 50;
      const moveY = (e.clientY - window.innerHeight / 2) / 50;
      const blobs = containerRef.current.querySelectorAll('.bg-blob');
      if (blobs[0]) blobs[0].style.transform = `translate(${moveX}px, ${moveY}px)`;
      if (blobs[1]) blobs[1].style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-on-background px-4 py-12"
      ref={containerRef}
    >
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(192, 192, 192, 0.2);
        }
        .sparkle-line {
          background: linear-gradient(90deg, transparent, #0072e5, transparent);
          height: 2px;
          width: 120px;
          position: relative;
          overflow: hidden;
        }
        .sparkle-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          animation: sweep 2.5s infinite linear;
        }
        @keyframes sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .floating-icon {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .glow-pulse {
          box-shadow: 0 0 30px 5px rgba(0, 114, 229, 0.15);
          animation: pulse-glow 3s infinite alternate;
        }
        @keyframes pulse-glow {
          from { box-shadow: 0 0 20px 2px rgba(0, 114, 229, 0.1); }
          to { box-shadow: 0 0 40px 10px rgba(0, 114, 229, 0.25); }
        }
      `}</style>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-blob absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] transition-transform duration-75"></div>
        <div className="bg-blob absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-tertiary-container/5 rounded-full blur-[100px] transition-transform duration-75"></div>
      </div>

      {/* Content Canvas */}
      <div className="relative z-10 w-full max-w-lg text-center space-y-8">
        
        {/* Success Icon & Luminous Effect */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary-container to-primary rounded-full flex items-center justify-center text-white shadow-xl glow-pulse floating-icon relative">
              <span className="material-symbols-outlined text-[48px] md:text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </div>
          </div>
        </div>

        {/* Headlines */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="space-y-2"
        >
          <h1 className="font-display-lg text-3xl md:text-5xl tracking-tight text-primary font-bold">Spark Sent!</h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant px-4">
            Your first spark with {matchProfile?.name || 'someone'} is on its way. Let the magic happen.
          </p>
        </motion.div>

        {/* Avatar Connection Visual */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="py-8 flex items-center justify-center space-x-6"
        >
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-lg overflow-hidden glass-panel">
              <img 
                alt="User profile avatar" 
                className="w-full h-full object-cover" 
                src={myProfile?.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="sparkle-line rounded-full"></div>
            <span className="font-label-sm text-[12px] font-medium text-primary uppercase tracking-widest mt-2 opacity-60">Connected</span>
          </div>

          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-lg overflow-hidden glass-panel">
              <img 
                alt="Match profile avatar" 
                className="w-full h-full object-cover" 
                src={matchProfile?.photos?.[0]?.url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"}
              />
            </div>
            <div className="absolute -bottom-1 -left-1 bg-tertiary text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col space-y-4 pt-8 max-w-xs mx-auto"
        >
          <button 
            onClick={onBackToDiscovery || onComplete}
            className="w-full h-14 md:h-16 bg-gradient-to-r from-primary-container to-primary text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Back to Discovery</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          
          <button 
            onClick={onViewAllMatches || onComplete}
            className="w-full h-14 md:h-16 bg-transparent border border-outline-variant/30 text-primary font-medium text-lg rounded-xl hover:bg-surface-container-low active:bg-surface-container-high transition-colors"
          >
            View All Matches
          </button>
        </motion.div>
        
      </div>
    </motion.div>
  );
}
