import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ShieldAlert, VolumeX, Ban, Flag, ChevronDown } from 'lucide-react';

export const SafetyActions = ({ userName = "this user", onBlock, onReport, onMute }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <ShieldAlert className="w-4 h-4" />
        Safety & Privacy
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
            <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Safety Tip
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Never share financial information or passwords. If something feels off, you can safely report or block {userName}.
            </p>
          </div>
          
          <div className="p-2 space-y-1">
            <button 
              onClick={() => { onMute?.(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <VolumeX className="w-4 h-4" />
              Mute Conversation
            </button>
            <button 
              onClick={() => { onReport?.(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors"
            >
              <Flag className="w-4 h-4" />
              Report {userName}
            </button>
            <button 
              onClick={() => { onBlock?.(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <Ban className="w-4 h-4" />
              Block {userName}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

SafetyActions.propTypes = {
  userName: PropTypes.string,
  onBlock: PropTypes.func,
  onReport: PropTypes.func,
  onMute: PropTypes.func,
};
