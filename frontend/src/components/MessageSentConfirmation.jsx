import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function MessageSentConfirmation({ matchProfile, myProfile, onComplete }) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#005ab7', '#abc7ff', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#005ab7', '#abc7ff', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-6 mb-8 relative">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden z-10">
            <img src={myProfile?.photos?.[0]?.url} alt="You" className="w-full h-full object-cover" />
          </div>
          <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-outline-variant/30 z-20">
            <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden z-10">
            <img src={matchProfile?.photos?.[0]?.url} alt={matchProfile?.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-3xl font-display-lg font-bold text-on-surface mb-2">Spark Sent!</h2>
        <p className="text-sm text-on-surface-variant font-medium">
          Your first message to {matchProfile?.name} is on its way.
        </p>
      </motion.div>
    </motion.div>
  );
}
