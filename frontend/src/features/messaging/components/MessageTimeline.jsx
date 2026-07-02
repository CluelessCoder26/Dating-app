import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';

const MessageTimeline = ({ messages = [] }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 h-full">
      {/* Date Separator Example */}
      <div className="flex items-center justify-center">
        <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">Today</span>
      </div>

      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          {msg.isUnreadDivider && (
            <div className="flex items-center justify-center my-4">
              <div className="border-t border-red-300 flex-1"></div>
              <span className="text-xs text-red-500 px-2 font-medium">New Messages</span>
              <div className="border-t border-red-300 flex-1"></div>
            </div>
          )}
          <MessageBubble message={msg} />
        </React.Fragment>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

MessageTimeline.propTypes = {
  messages: PropTypes.array,
};

export default MessageTimeline;
