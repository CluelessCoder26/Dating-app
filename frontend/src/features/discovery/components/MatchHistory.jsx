import React from 'react';
import PropTypes from 'prop-types';
import { Heart, X, Star } from 'lucide-react';

export const MatchHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No History Yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start swiping to see your recent likes, passes, and matches here.
        </p>
      </div>
    );
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'like': return <Heart size={16} className="text-green-500" fill="currentColor" />;
      case 'pass': return <X size={16} className="text-red-500" />;
      case 'superlike': return <Star size={16} className="text-blue-500" fill="currentColor" />;
      case 'match': return <Heart size={16} className="text-pink-500" fill="currentColor" />;
      default: return null;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'like': return 'You liked';
      case 'pass': return 'You passed';
      case 'superlike': return 'You super liked';
      case 'match': return 'Matched with';
      default: return 'Interacted with';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>
      
      <ul className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {history.map((item, index) => (
          <li key={item.id || index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors mb-1">
            <div className="relative">
              <img 
                src={item.profile.primaryPhoto} 
                alt={item.profile.name} 
                className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-800"
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-950 rounded-full p-0.5 shadow-sm">
                {getActionIcon(item.action)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.profile.name}, {item.profile.age}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {getActionText(item.action)}
              </p>
            </div>
            
            <div className="text-xs text-gray-400">
              {item.timestamp || 'Just now'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

MatchHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    action: PropTypes.oneOf(['like', 'pass', 'superlike', 'match']).isRequired,
    timestamp: PropTypes.string,
    profile: PropTypes.shape({
      name: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      primaryPhoto: PropTypes.string.isRequired
    }).isRequired
  }))
};
