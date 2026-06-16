import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { MessageSquare, Heart, Loader2 } from 'lucide-react';

export default function MatchesScreen({ onOpenChat }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagePreviews, setMessagePreviews] = useState({});

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getMatches();
      setMatches(data);
      
      // Fetch last message for each match
      for (const m of data) {
        try {
          const msgs = await api.getMessages(m.matchId);
          if (msgs && msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            setMessagePreviews(prev => ({
              ...prev,
              [m.matchId]: lastMsg.text
            }));
          }
        } catch (msgErr) {
          console.warn('Failed to fetch messages for match', m.matchId, msgErr.message);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="matches-screen py-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Heart size={20} className="text-color-pink fill-current" />
        Your Matches
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-color-pink" size={28} />
        </div>
      ) : matches.length === 0 ? (
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Heart size={20} className="text-muted" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">No Matches Yet</h3>
          <p className="text-xs text-dim">Start swiping on profiles! Mutual likes will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => {
            const photoUrl = m.profile.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
            const lastMsg = messagePreviews[m.matchId] || 'Say hi! You matched recently.';

            return (
              <div
                key={m.matchId}
                onClick={() => onOpenChat(m.matchId, m.profile)}
                className="match-card glass-panel p-4 flex items-center gap-4 cursor-pointer hover:border-color-pink/30 hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Photo */}
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10 relative">
                  <img src={photoUrl} alt={m.profile.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-white text-sm truncate">
                      {m.profile.name}, {m.profile.age}
                    </span>
                    <span className="text-[10px] text-dim shrink-0">
                      {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate pr-4">{lastMsg}</p>
                </div>

                {/* Action button */}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted group-hover:text-white transition-all shrink-0">
                  <MessageSquare size={14} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
