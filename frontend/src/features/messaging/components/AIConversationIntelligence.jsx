import React from 'react';
import PropTypes from 'prop-types';
import { Lightbulb, MessageCircle, Sparkles } from 'lucide-react';

export const AIConversationIntelligence = ({ 
  icebreakers = [], 
  replySuggestions = [], 
  conversationTone 
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Assistant
        </h3>
        {conversationTone && (
          <div className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
            Tone: {conversationTone}
          </div>
        )}
      </div>

      {icebreakers.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Icebreakers
          </h4>
          <div className="flex flex-wrap gap-2">
            {icebreakers.map((breaker, idx) => (
              <button 
                key={idx}
                className="text-left text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                {breaker}
              </button>
            ))}
          </div>
        </div>
      )}

      {replySuggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Reply Suggestions
          </h4>
          <div className="flex flex-col gap-2">
            {replySuggestions.map((reply, idx) => (
              <button 
                key={idx}
                className="text-left text-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AIConversationIntelligence.propTypes = {
  icebreakers: PropTypes.arrayOf(PropTypes.string),
  replySuggestions: PropTypes.arrayOf(PropTypes.string),
  conversationTone: PropTypes.string,
};
