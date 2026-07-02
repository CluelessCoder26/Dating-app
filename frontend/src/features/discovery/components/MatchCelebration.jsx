import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle, X } from 'lucide-react';

const MatchCelebration = ({ isOpen, match, onClose, onMessage }) => {
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!match) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div 
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />

            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mb-8 italic"
            >
              It's a Match!
            </motion.h2>

            <div className="flex justify-center items-center gap-4 mb-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="w-24 h-24 rounded-full border-4 border-indigo-500/50 overflow-hidden shadow-lg shadow-indigo-500/20"
              >
                <img src={match.currentUserAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=You"} alt="You" className="w-full h-full object-cover" />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.8, bounce: 0.5 }}
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center z-10 shadow-lg shadow-pink-500/20"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.6 }}
                className="w-24 h-24 rounded-full border-4 border-pink-500/50 overflow-hidden shadow-lg shadow-pink-500/20"
              >
                <img src={match.matchedUserAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Them"} alt="Match" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-full mb-8 border border-white/5"
            >
              <h3 className="text-white font-semibold mb-2">AI Match Summary</h3>
              <p className="text-sm text-gray-300">
                {match.aiSummary || "You both share a strong interest in technology, outdoors, and music. The AIOS compatibility score is extremely high!"}
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={onMessage}
              className="w-full py-4 bg-white text-indigo-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Send a Message
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              onClick={onClose}
              className="mt-4 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Keep Exploring
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

MatchCelebration.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    currentUserAvatar: PropTypes.string,
    matchedUserAvatar: PropTypes.string,
    aiSummary: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onMessage: PropTypes.func.isRequired
};

export default MatchCelebration;
