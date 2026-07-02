import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

const AICompatibility = ({ compatibilityScore, summary, strengths, challenges }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            AIOS Compatibility
          </h3>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-800"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * compatibilityScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-lg font-bold text-white">{compatibilityScore}%</span>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        {summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h4 className="font-semibold text-indigo-400 text-sm uppercase tracking-wider">Strengths</h4>
          </div>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h4 className="font-semibold text-rose-400 text-sm uppercase tracking-wider">Challenges</h4>
          </div>
          <ul className="space-y-2">
            {challenges.map((challenge, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

AICompatibility.propTypes = {
  compatibilityScore: PropTypes.number.isRequired,
  summary: PropTypes.string.isRequired,
  strengths: PropTypes.arrayOf(PropTypes.string).isRequired,
  challenges: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AICompatibility;
