import React from 'react';
import PropTypes from 'prop-types';
import { SwipeExperience } from './SwipeExperience';
import { WifiOff, SearchX } from 'lucide-react';

export const DiscoveryHome = ({ profiles, isLoading, isOffline, onSwipe, onRefresh }) => {
  if (isOffline) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl">
        <WifiOff className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're Offline</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Please check your internet connection to continue finding matches.</p>
        <button 
          onClick={onRefresh}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!isLoading && (!profiles || profiles.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl">
        <SearchX className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No More Profiles</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You've seen everyone in your area. Try expanding your search preferences.</p>
        <button 
          onClick={onRefresh}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-colors"
        >
          Refresh Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full max-w-md mx-auto flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Discovery
        </h1>
      </header>
      
      <main className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
        {isLoading && profiles.length === 0 ? (
          <div className="animate-pulse flex flex-col items-center w-full max-w-sm">
            <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-3xl mb-4"></div>
            <div className="flex justify-center gap-4 w-full px-6">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
          </div>
        ) : (
          <SwipeExperience profiles={profiles} onSwipe={onSwipe} />
        )}
      </main>
    </div>
  );
};

DiscoveryHome.propTypes = {
  profiles: PropTypes.array,
  isLoading: PropTypes.bool,
  isOffline: PropTypes.bool,
  onSwipe: PropTypes.func,
  onRefresh: PropTypes.func
};

DiscoveryHome.defaultProps = {
  profiles: [],
  isLoading: false,
  isOffline: false,
  onSwipe: () => {},
  onRefresh: () => {}
};
