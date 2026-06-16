import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { ChevronLeft, Send, Loader2, Smile } from 'lucide-react';

export default function ChatScreen({ matchId, otherProfile, onBack, myUserId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await api.getMessages(matchId);
      setMessages(data);
      scrollToBottom();
      await api.markMessagesRead(matchId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    // Connect WebSocket
    const socket = api.getSocket();
    if (socket) {
      socketRef.current = socket;

      // Join the match room
      socket.emit('join_match', { matchId });

      // Listen for incoming messages
      socket.on('recv_msg', (msg) => {
        if (msg.matchId === matchId) {
          setMessages((prev) => [...prev, msg]);
          // Mark as read if user is actively looking at this screen
          api.markMessagesRead(matchId).catch(console.error);
        }
      });

      // Listen for typing indicator status
      socket.on('typing_status', (data) => {
        if (data.matchId === matchId && data.userId !== myUserId) {
          setIsTyping(data.isTyping);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('recv_msg');
        socketRef.current.off('typing_status');
      }
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    // Typing Emitter
    if (socketRef.current) {
      socketRef.current.emit('typing', { matchId, isTyping: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing', { matchId, isTyping: false });
      }, 2000);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (socketRef.current) {
      // Emit typing false instantly
      socketRef.current.emit('typing', { matchId, isTyping: false });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // Send message via Socket
      socketRef.current.emit('send_msg', {
        matchId,
        targetUserId: otherProfile.userId,
        text: textToSend,
        isImage: false
      });

      // Append locally for instant response
      const localMsg = {
        id: Math.random().toString(),
        matchId,
        senderId: myUserId,
        text: textToSend,
        isImage: false,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, localMsg]);
    } else {
      // Fallback to REST write (not real-time, but persists)
      // Wait, the backend REST swipe.js doesn't have an endpoint to send messages since it relies on WebSocket,
      // but websocket/src/index.js writes fallback to db synchronously anyway if Redis is down.
      alert('Real-time connection unavailable. Check Redis server.');
    }
  };

  return (
    <div className="chat-screen flex flex-col h-[70vh] w-full max-w-lg mx-auto glass-panel overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
        <button onClick={onBack} className="text-muted hover:text-white p-1 rounded-lg hover:bg-white/5">
          <ChevronLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
          <img
            src={otherProfile.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
            alt={otherProfile.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{otherProfile.name}</h3>
          <p className="text-[10px] text-color-purple font-semibold">
            {isTyping ? 'typing...' : 'Active now'}
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-color-pink" size={20} />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-dim text-xs">
            Start the conversation! Say something nice to {otherProfile.name}.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === myUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-tr from-color-pink to-color-purple text-white rounded-tr-none'
                      : 'bg-white/5 text-white/95 border border-white/5 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[8px] text-white/40 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-2 items-center bg-white/[0.01]">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={handleInputChange}
          className="text-input flex-1 py-2"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-xl bg-color-pink hover:bg-color-pink/90 text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 disabled:hover:bg-color-pink"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
