import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';

export default function MatchesAndChat({ myProfile, activeMatchInfo, onClearActiveMatch }) {
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(activeMatchInfo || null); // { matchId, profile }
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load matches list
  const loadMatches = async () => {
    try {
      const data = await api.getMatches();
      setMatches(data || []);
    } catch (err) {
      console.warn('Failed to load matches:', err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // Update activeMatch when prop changes (from Match success click)
  useEffect(() => {
    if (activeMatchInfo) {
      setActiveMatch(activeMatchInfo);
    }
  }, [activeMatchInfo]);

  // Handle active conversation loading & sockets
  useEffect(() => {
    if (!activeMatch) {
      setMessages([]);
      return;
    }

    const loadChatHistory = async () => {
      setLoadingMessages(true);
      try {
        const history = await api.getMessages(activeMatch.matchId);
        setMessages(history || []);
        await api.markMessagesRead(activeMatch.matchId);
      } catch (err) {
        console.error('Failed to load chat history:', err.message);
      } finally {
        setLoadingMessages(false);
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    loadChatHistory();

    // Setup Socket
    const socket = api.getSocket();
    if (socket) {
      socketRef.current = socket;
      socket.emit('join_match', { matchId: activeMatch.matchId });

      socket.on('recv_msg', (msg) => {
        if (msg.matchId === activeMatch.matchId) {
          setMessages((prev) => [...prev, msg]);
          api.markMessagesRead(activeMatch.matchId).catch(console.error);
        }
      });

      socket.on('typing_status', (data) => {
        if (data.matchId === activeMatch.matchId && data.userId !== myProfile.userId) {
          setIsOtherTyping(data.isTyping);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('recv_msg');
        socketRef.current.off('typing_status');
      }
    };
  }, [activeMatch, myProfile.userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherTyping]);

  // Handle inputs typing state
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socketRef.current) {
      socketRef.current.emit('typing', { matchId: activeMatch.matchId, isTyping: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing', { matchId: activeMatch.matchId, isTyping: false });
      }, 2000);
    }
  };

  // Send Message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (socketRef.current) {
      socketRef.current.emit('typing', { matchId: activeMatch.matchId, isTyping: false });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      socketRef.current.emit('send_msg', {
        matchId: activeMatch.matchId,
        targetUserId: activeMatch.profile.userId,
        text: textToSend,
        isImage: false
      });

      const localMsg = {
        id: Math.random().toString(),
        matchId: activeMatch.matchId,
        senderId: myProfile.userId,
        text: textToSend,
        isImage: false,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, localMsg]);
    } else {
      alert('Real-time connection unavailable.');
    }
  };

  const fillStarter = (text) => {
    setInputText(text);
  };

  // Filtering matches based on search query
  const filteredMatches = matches.filter(m => 
    m.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render list of matches if no active match is open
  if (!activeMatch) {
    return (
      <div className="flex-grow pt-16 pb-24 w-full h-full max-w-xl mx-auto px-6 overflow-y-auto bg-background selection:bg-primary/20">
        
        {/* Header Section */}
        <section className="my-6">
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-1">Matches &amp; Messages</h1>
          <p className="text-xs text-on-surface-variant font-medium">Connect with your latest sparks and conversations.</p>
        </section>

        {/* New Sparks (Horizontal scrolling row) */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase">New Sparks</h2>
            <span className="bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              {matches.length} Sparks
            </span>
          </div>
          {loadingMatches ? (
            <div className="flex justify-center py-4">
              <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            </div>
          ) : matches.length === 0 ? (
            <p className="text-xs text-on-surface-variant bg-white/40 p-4 rounded-xl text-center border border-outline-variant/20">
              No sparks yet. Swipe right in discovery to meet new people!
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
              {matches.map((m) => (
                <div 
                  key={m.matchId}
                  onClick={() => setActiveMatch({ matchId: m.matchId, profile: m.profile })}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-inverse-primary transition-transform group-hover:scale-105 active:scale-95 shadow-md">
                    <img 
                      alt={m.profile.name} 
                      src={m.profile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
                      className="w-full h-full rounded-full object-cover border border-white" 
                    />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">{m.profile.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Search Input */}
        <section className="mb-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
              search
            </span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface placeholder:text-outline/70 transition-all font-medium"
              placeholder="Search your sparks..." 
              type="text"
            />
          </div>
        </section>

        {/* Messages List (Vertical) */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide mb-4">Recent Conversations</h2>
          {loadingMatches ? (
            <div className="flex justify-center py-6">
              <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            </div>
          ) : filteredMatches.length === 0 ? (
            <p className="text-xs text-on-surface-variant text-center bg-white/40 p-6 rounded-2xl border border-outline-variant/20">
              No conversations match your search.
            </p>
          ) : (
            filteredMatches.map((m) => (
              <div 
                key={m.matchId}
                onClick={() => setActiveMatch({ matchId: m.matchId, profile: m.profile })}
                className="pearl-layer p-4 rounded-2xl flex items-center gap-4 hover:bg-white/60 hover:shadow-sm border border-outline-variant/10 transition-all cursor-pointer bg-white/30 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-outline-variant/20 shadow-sm">
                  <img 
                    alt={m.profile.name} 
                    src={m.profile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-bold text-on-surface truncate">{m.profile.name}</h3>
                    <span className="text-[10px] text-primary font-bold">Open Chat</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate font-medium max-w-[240px]">
                    {m.profile.bio ? m.profile.bio.split('\n\n')[0] : 'Click to start chatting...'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px]">chevron_right</span>
              </div>
            ))
          )}
        </section>

      </div>
    );
  }

  // Active Chat Screen view mapping to first_message_to_elena/code.html mockup
  return (
    <div className="flex-grow pt-16 pb-24 w-full h-full max-w-xl mx-auto flex flex-col bg-background relative overflow-hidden">
      
      {/* Chat Sub-Header */}
      <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-white/40 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveMatch(null);
              onClearActiveMatch();
            }} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">arrow_back</span>
          </button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 shadow-sm shrink-0">
            <img 
              src={activeMatch.profile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
              alt={activeMatch.profile.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-on-surface leading-tight">{activeMatch.profile.name}</h3>
            <p className="text-[10px] text-tertiary font-bold animate-pulse">
              {isOtherTyping ? 'typing...' : 'Active now'}
            </p>
          </div>
        </div>

        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        
        {/* Match Header visual summary */}
        {messages.length === 0 && !loadingMessages && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center mt-6 text-center">
            {/* Visual match connectors */}
            <div className="flex items-center justify-center gap-8 my-4 relative">
              <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden">
                <img src={myProfile.photos?.[0]?.url} alt="You" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-outline-variant/30 text-tertiary">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden">
                <img src={activeMatch.profile.photos?.[0]?.url} alt={activeMatch.profile.name} className="w-full h-full object-cover" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-on-surface mb-1">It's a Match!</h2>
            <p className="text-xs text-on-surface-variant max-w-xs mb-6">
              Send the first spark to <span className="text-primary font-bold">{activeMatch.profile.name}</span>
            </p>

            {/* Icebreakers / Starters */}
            <div className="w-full text-left bg-white/40 rounded-2xl p-4 border border-outline-variant/10 shadow-sm max-w-sm">
              <div className="flex items-center gap-1 text-[11px] font-bold text-tertiary mb-3 uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">lightbulb</span> Conversation Starters
              </div>
              <div className="flex flex-col gap-2">
                {[
                  `Hi ${activeMatch.profile.name}! Ask about interests... 🎨`,
                  `Mention favorite local cafe spots... ☕`,
                  `Ask about travel pictures... ✈️`
                ].map((text, idx) => (
                  <button 
                    key={idx}
                    onClick={() => fillStarter(text)}
                    className="text-left py-2 px-3 rounded-lg bg-white/80 hover:bg-primary/5 hover:text-primary transition-all border border-outline-variant/20 text-xs font-semibold text-on-surface-variant active:scale-[0.98]"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 text-left max-w-sm mt-4">
              <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
              <div>
                <h4 className="text-[11px] font-bold text-primary uppercase">Pro Tip</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Matches are 3x more likely to reply when you mention a specific detail from their bio, like their interests!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message Logs */}
        {loadingMessages ? (
          <div className="flex justify-center py-6">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === myProfile.userId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div 
                  className={`max-w-[75%] px-4 py-3 rounded-[20px] text-xs leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-r from-primary to-primary-container text-white rounded-tr-none' 
                      : 'bg-white/80 text-on-surface border border-outline-variant/20 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[8px] mt-1.5 text-right ${isMe ? 'text-white/60' : 'text-on-surface-variant/50'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isOtherTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 border border-outline-variant/10 px-4 py-2.5 rounded-[20px] rounded-tl-none text-[10px] text-secondary font-bold tracking-wider animate-pulse flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <form 
        onSubmit={handleSendMessage}
        className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 p-1.5 rounded-full glass-panel border border-outline-variant/20 shadow-lg"
      >
        <input 
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-on-surface font-semibold px-4"
          type="text"
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-tertiary text-white flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-transform disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </button>
      </form>

    </div>
  );
}
