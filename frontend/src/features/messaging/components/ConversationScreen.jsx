import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MessageTimeline from './MessageTimeline';
import MediaSharing from './MediaSharing';

const ConversationScreen = ({ currentMatch, messages, onSendMessage, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Can be linked to real presence API

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage({ type: 'text', content: inputText });
      setInputText('');
    }
  };

  const handleMediaUpload = (file) => {
    onSendMessage({ type: 'image', content: URL.createObjectURL(file) });
  };

  return (
    <div className="flex flex-col h-full bg-white w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b shadow-sm">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="md:hidden text-gray-600 p-2">
            &larr;
          </button>
          <img src={currentMatch?.avatarUrl} alt={currentMatch?.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h2 className="font-semibold text-gray-900">{currentMatch?.name}</h2>
            <p className="text-xs text-green-500">{currentMatch?.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-gray-500">
          <button className="p-2 hover:bg-gray-100 rounded-full">Phone</button>
          <button className="p-2 hover:bg-gray-100 rounded-full">Video</button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        <MessageTimeline messages={messages} />
        {isTyping && (
          <div className="absolute bottom-4 left-4 text-sm text-gray-500 italic bg-white/80 px-2 py-1 rounded">
            {currentMatch?.name} is typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-white flex items-center space-x-2">
        <MediaSharing onUpload={handleMediaUpload} />
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <button 
          onClick={handleSend}
          className="bg-red-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

ConversationScreen.propTypes = {
  currentMatch: PropTypes.object,
  messages: PropTypes.array,
  onSendMessage: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ConversationScreen;
