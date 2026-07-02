import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Music, Coffee, Book } from 'lucide-react';

const ICON_MAP = {
  'shared_interests': Heart,
  'nearby': MapPin,
  'highly_compatible': Star,
  'music': Music,
  'lifestyle': Coffee,
  'education': Book,
};

const RecommendationTransparency = ({ reasons }) => {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-1">
        Recommended because
      </p>
      <div className="flex flex-wrap gap-2">
        {reasons.map((reason, index) => {
          const Icon = ICON_MAP[reason.type] || Star;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 backdrop-blur-sm"
            >
              <Icon className="w-4 h-4 text-purple-400" />
              <span>{reason.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

RecommendationTransparency.propTypes = {
  reasons: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecommendationTransparency;
