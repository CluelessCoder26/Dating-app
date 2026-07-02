import React from 'react';
import PropTypes from 'prop-types';

const MessageBubble = ({ message }) => {
  const isMine = message.senderId === 'me';

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} my-2`}>
      <div className={`max-w-[75%] rounded-2xl p-3 ${
        isMine 
          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-br-none shadow-md' 
          : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
      }`}>
        {message.type === 'text' && (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
        {message.type === 'image' && (
          <img 
            src={message.content} 
            alt="Shared media" 
            className="rounded-xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" 
          />
        )}
        {message.isDeleted && (
          <p className="text-sm italic text-gray-400">This message was deleted.</p>
        )}
      </div>
      
      <div className="flex items-center mt-1 space-x-1 px-1">
        <span className="text-[10px] text-gray-400">{message.timestamp}</span>
        {isMine && (
          <span className="text-[10px] text-blue-500">
            {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : '...'}
          </span>
        )}
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'image', 'system']),
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['sent', 'delivered', 'read']),
    isDeleted: PropTypes.bool,
  }).isRequired,
};

export default MessageBubble;
