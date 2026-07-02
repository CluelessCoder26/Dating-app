import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, ShieldCheck } from 'lucide-react';

const DiscoveryFilters = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters || {
    distance: 50,
    ageRange: [18, 35],
    verifiedOnly: false,
    aiosMinimum: 70
  });

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#12121a] border-t border-white/10 rounded-t-3xl z-50 p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Discovery Filters</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Distance Filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">Maximum Distance</label>
                  <span className="text-indigo-400 font-semibold">{localFilters.distance} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="160"
                  value={localFilters.distance}
                  onChange={(e) => handleChange('distance', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Age Range Filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">Age Range</label>
                  <span className="text-indigo-400 font-semibold">
                    {localFilters.ageRange[0]} - {localFilters.ageRange[1]}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={localFilters.ageRange[0]}
                    onChange={(e) => {
                      const min = parseInt(e.target.value);
                      if (min <= localFilters.ageRange[1]) {
                        handleChange('ageRange', [min, localFilters.ageRange[1]]);
                      }
                    }}
                    className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={localFilters.ageRange[1]}
                    onChange={(e) => {
                      const max = parseInt(e.target.value);
                      if (max >= localFilters.ageRange[0]) {
                        handleChange('ageRange', [localFilters.ageRange[0], max]);
                      }
                    }}
                    className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* AIOS Minimum Filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">Minimum AIOS Compatibility</label>
                  <span className="text-purple-400 font-semibold">{localFilters.aiosMinimum}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localFilters.aiosMinimum}
                  onChange={(e) => handleChange('aiosMinimum', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Verified Only Toggle */}
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Verified Profiles Only</h4>
                    <p className="text-xs text-gray-400">Show only photo-verified users</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={localFilters.verifiedOnly}
                    onChange={(e) => handleChange('verifiedOnly', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

DiscoveryFilters.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.object,
  onApplyFilters: PropTypes.func.isRequired,
};

export default DiscoveryFilters;
