import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MatchesHome = ({ matches = [], onMatchSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMatches = matches.filter(match => 
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const newMatches = filteredMatches.filter(m => m.isNew);
  const activeMatches = filteredMatches.filter(m => !m.isNew && !m.isArchived);

  return (
    <div className="flex flex-col h-full bg-white w-full max-w-md border-r">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4">Matches & Messages</h2>
        <input 
          type="text" 
          placeholder="Search matches..." 
          className="w-full p-2 border rounded-full bg-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {newMatches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-red-500 uppercase mb-3">New Matches</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {newMatches.map(match => (
                <div key={match.id} className="relative flex flex-col items-center cursor-pointer min-w-[70px]" onClick={() => onMatchSelect(match)}>
                  <div className="relative">
                    <img src={match.avatarUrl} alt={match.name} className="w-16 h-16 rounded-full object-cover border-2 border-red-500 p-0.5" />
                    {match.isOnline && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1 truncate w-full text-center">{match.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Messages</h3>
          <div className="space-y-4">
            {activeMatches.map(match => (
              <div key={match.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg" onClick={() => onMatchSelect(match)}>
                <div className="relative">
                  <img src={match.avatarUrl} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
                  {match.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-gray-900 truncate">{match.name}</h4>
                    <span className="text-xs text-gray-500">{match.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                </div>
                {match.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {match.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

MatchesHome.propTypes = {
  matches: PropTypes.array,
  onMatchSelect: PropTypes.func.isRequired,
};

export default MatchesHome;
