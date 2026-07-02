import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, RotateCcw, Zap } from 'lucide-react';
import { DiscoveryCard } from './DiscoveryCard';

const SWIPE_THRESHOLD = 100;

export const SwipeExperience = ({ profiles, onSwipe }) => {
  const [cards, setCards] = useState(profiles);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setCards(profiles);
  }, [profiles]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);
  const superLikeOpacity = useTransform(y, [0, -100], [0, 1]);

  const controls = useAnimation();

  const removeCard = (direction, card) => {
    setCards((prev) => prev.slice(0, -1));
    setHistory((prev) => [...prev, card]);
    if (onSwipe) {
      onSwipe(card, direction);
    }
  };

  const handleAction = async (direction) => {
    if (cards.length === 0) return;
    const currentCard = cards[cards.length - 1];

    let destX = 0;
    let destY = 0;

    if (direction === 'like') destX = 400;
    else if (direction === 'pass') destX = -400;
    else if (direction === 'superlike') destY = -400;

    await controls.start({
      x: destX,
      y: destY,
      opacity: 0,
      transition: { duration: 0.3 }
    });

    x.set(0);
    y.set(0);
    removeCard(direction, currentCard);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (cards.length === 0) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handleAction('pass');
          break;
        case 'ArrowRight':
          handleAction('like');
          break;
        case 'ArrowUp':
          handleAction('superlike');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length]);

  const handleDragEnd = async (event, info) => {
    const offset = info.offset;

    if (offset.x > SWIPE_THRESHOLD) {
      handleAction('like');
    } else if (offset.x < -SWIPE_THRESHOLD) {
      handleAction('pass');
    } else if (offset.y < -SWIPE_THRESHOLD && Math.abs(offset.x) < SWIPE_THRESHOLD) {
      handleAction('superlike');
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastCard = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCards((prev) => [...prev, lastCard]);
  };

  return (
    <div className="relative w-full h-full max-w-sm mx-auto flex flex-col items-center">
      <div className="relative w-full aspect-[3/4] flex-1 mb-6">
        <AnimatePresence>
          {cards.map((profile, index) => {
            const isActive = index === cards.length - 1;
            
            return (
              <motion.div
                key={profile.id}
                className="absolute inset-0 origin-bottom"
                style={isActive ? { x, y, rotate, opacity } : { scale: 1 - (cards.length - 1 - index) * 0.05, y: (cards.length - 1 - index) * -10, zIndex: index }}
                drag={isActive ? true : false}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDragEnd={isActive ? handleDragEnd : undefined}
                animate={isActive ? controls : {}}
              >
                <DiscoveryCard profile={profile} isActive={isActive} />
                
                {/* Swipe Indicators */}
                {isActive && (
                  <>
                    <motion.div 
                      className="absolute top-10 left-10 border-4 border-green-500 rounded-lg px-4 py-1 z-30 transform -rotate-12"
                      style={{ opacity: likeOpacity }}
                    >
                      <span className="text-green-500 font-bold text-4xl tracking-widest uppercase shadow-sm">Like</span>
                    </motion.div>
                    
                    <motion.div 
                      className="absolute top-10 right-10 border-4 border-red-500 rounded-lg px-4 py-1 z-30 transform rotate-12"
                      style={{ opacity: nopeOpacity }}
                    >
                      <span className="text-red-500 font-bold text-4xl tracking-widest uppercase shadow-sm">Nope</span>
                    </motion.div>
                    
                    <motion.div 
                      className="absolute bottom-1/4 left-1/2 -translate-x-1/2 border-4 border-blue-500 rounded-lg px-4 py-1 z-30"
                      style={{ opacity: superLikeOpacity }}
                    >
                      <span className="text-blue-500 font-bold text-4xl tracking-widest uppercase shadow-sm">Super</span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 py-4 w-full px-6 z-10">
        <button 
          onClick={handleUndo}
          disabled={history.length === 0}
          className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 dark:border-gray-700"
          aria-label="Undo"
        >
          <RotateCcw size={20} className="text-yellow-500" />
        </button>

        <button 
          onClick={() => handleAction('pass')}
          className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform active:scale-95 border border-gray-100 dark:border-gray-700"
          aria-label="Pass"
        >
          <X size={32} className="text-red-500" />
        </button>

        <button 
          onClick={() => handleAction('superlike')}
          className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform active:scale-95 border border-gray-100 dark:border-gray-700"
          aria-label="Super Like"
        >
          <Star size={24} className="text-blue-500" fill="currentColor" />
        </button>

        <button 
          onClick={() => handleAction('like')}
          className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform active:scale-95 border border-gray-100 dark:border-gray-700"
          aria-label="Like"
        >
          <Heart size={32} className="text-green-500" fill="currentColor" />
        </button>

        <button 
          className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform active:scale-95 border border-gray-100 dark:border-gray-700"
          aria-label="Boost"
        >
          <Zap size={20} className="text-purple-500" fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

SwipeExperience.propTypes = {
  profiles: PropTypes.array.isRequired,
  onSwipe: PropTypes.func
};
