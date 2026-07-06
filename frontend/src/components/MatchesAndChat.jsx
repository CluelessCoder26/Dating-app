/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { useToast } from './Toast';
import MessageSentConfirmation from './MessageSentConfirmation';
import { AnimatePresence } from 'framer-motion';

export default function MatchesAndChat({ myProfile, activeMatchInfo, onClearActiveMatch, onBackToDiscovery }) {
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(activeMatchInfo || null); // { matchId, profile }
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { showToast } = useToast();

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load matches list
  const loadMatches = async () => {
    try {
      const data = await api.getMatches();
      // Sort matches by newest activity (last message or match creation)
      const sorted = (data || []).sort((a, b) => {
        const tA = new Date(a.lastMessageAt || a.createdAt || 0).getTime();
        const tB = new Date(b.lastMessageAt || b.createdAt || 0).getTime();
        return tB - tA;
      });
      setMatches(sorted);
    } catch (err) {
      console.warn('Failed to load matches:', err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // Socket listeners for updating matches list in background
  useEffect(() => {
    const socket = api.getSocket();
    if (!socket) return;

    const onMatchCreated = (data) => {
      const otherUserId = data.user1Id === myProfile.userId ? data.user2Id : data.user1Id;
      api.getProfile(otherUserId).then(p => {
        const newMatch = {
          matchId: data.matchId,
          profile: p,
          createdAt: new Date().toISOString(),
          unreadCount: 0
        };
        setMatches(prev => [newMatch, ...prev]);
      });
    };

    const onRecvMsg = (msg) => {
      setMatches(prev => {
        const idx = prev.findIndex(m => m.matchId === msg.matchId);
        if (idx === -1) return prev;
        const m = prev[idx];
        const isCurrentActive = activeMatch?.matchId === msg.matchId;
        const updatedMatch = { 
          ...m, 
          lastMessageAt: msg.createdAt, 
          lastMessageText: msg.isImage ? '📸 Image' : msg.text,
          unreadCount: isCurrentActive ? 0 : ((m.unreadCount || 0) + 1)
        };
        const newList = [...prev];
        newList.splice(idx, 1);
        newList.unshift(updatedMatch);
        return newList;
      });
    };

    const onMsgRead = (data) => {
      if (activeMatch && data.matchId === activeMatch.matchId) {
        setMessages(prev => prev.map(m => m.readAt ? m : { ...m, readAt: new Date().toISOString() }));
      }
    };

    socket.on('match_created', onMatchCreated);
    socket.on('match.created', onMatchCreated);
    socket.on('recv_msg', onRecvMsg);
    socket.on('message.delivered', onRecvMsg);
    socket.on('messages.read', onMsgRead);

    return () => {
      socket.off('match_created', onMatchCreated);
      socket.off('match.created', onMatchCreated);
      socket.off('recv_msg', onRecvMsg);
      socket.off('message.delivered', onRecvMsg);
      socket.off('messages.read', onMsgRead);
    };
  }, [myProfile.userId, activeMatch]);

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
        
        // Clear unread count in matches list
        setMatches(prev => prev.map(m => m.matchId === activeMatch.matchId ? { ...m, unreadCount: 0 } : m));
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

      // Check for first message
      const messagedSet = new Set(JSON.parse(localStorage.getItem('messagedMatches') || '[]'));
      if (!messagedSet.has(activeMatch.matchId) && messages.length === 0) {
        messagedSet.add(activeMatch.matchId);
        localStorage.setItem('messagedMatches', JSON.stringify(Array.from(messagedSet)));
        setShowConfirmation(true);
      }
    } else {
      showToast('Real-time connection unavailable.', 'error');
    }
  };

  const fillStarter = (text) => {
    setInputText(text);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading image...', 'info');
      const res = await api.uploadPhoto(file, false); // use /photos/upload endpoint
      const imgUrl = res.photo.url;
      
      if (socketRef.current) {
        socketRef.current.emit('send_msg', {
          matchId: activeMatch.matchId,
          targetUserId: activeMatch.profile.userId,
          text: imgUrl,
          isImage: true
        });

        const localMsg = {
          id: Math.random().toString(),
          matchId: activeMatch.matchId,
          senderId: myProfile.userId,
          text: imgUrl,
          isImage: true,
          createdAt: new Date().toISOString(),
          readAt: null
        };
        setMessages((prev) => [...prev, localMsg]);
        
        // Update local matches list
        setMatches(prev => {
          const idx = prev.findIndex(m => m.matchId === activeMatch.matchId);
          if (idx === -1) return prev;
          const updated = { ...prev[idx], lastMessageAt: localMsg.createdAt, lastMessageText: '📸 Image' };
          const newList = [...prev];
          newList.splice(idx, 1);
          newList.unshift(updated);
          return newList;
        });
      }
    } catch (err) {
      showToast('Failed to upload image: ' + err.message, 'error');
    }
  };

  // Filtering matches based on search query
  const filteredMatches = matches.filter(m => 
    m.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!activeMatch) {
    return (
      <main className="flex-grow pt-24 pb-28 px-container-margin-mobile md:px-container-margin-desktop w-full h-full max-w-4xl mx-auto overflow-y-auto hide-scrollbar selection:bg-primary-container selection:text-on-primary-container">
        
        {/* Header Section */}
        <section className="mb-stack-lg">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Matches &amp; Messages</h1>
          <p className="text-secondary font-body-md">Connect with your latest sparks and conversations.</p>
        </section>

        {/* New Sparks (Horizontal Avatars) */}
        <section className="mb-stack-lg">
          <div className="flex items-center justify-between mb-stack-md">
            <h2 className="font-title-md text-title-md text-on-surface">New Sparks</h2>
            <span className="text-primary font-label-sm uppercase tracking-wider">{matches.length} Sparks</span>
          </div>
          {loadingMatches ? (
            <div className="flex justify-center py-4">
              <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            </div>
          ) : matches.length === 0 ? (
            <p className="text-sm text-secondary bg-surface-container-low p-4 rounded-xl text-center border border-outline-variant/20 pearl-layer">
              No sparks yet. Swipe right in discovery to meet new people!
            </p>
          ) : (
            <div className="flex gap-stack-md overflow-x-auto hide-scrollbar py-2 -mx-2 px-2">
              {matches.map((m) => (
                <div 
                  key={m.matchId}
                  onClick={() => setActiveMatch({ matchId: m.matchId, profile: m.profile })}
                  className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-primary to-inverse-primary ring-2 ring-white ring-offset-2 ring-offset-primary/10 transition-transform group-hover:scale-105 active:scale-95 relative">
                    <img 
                      alt={m.profile.name} 
                      src={m.profile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
                      className="w-full h-full rounded-full object-cover" 
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 right-1 w-5 h-5 bg-tertiary rounded-full border-2 border-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                  </div>
                  <span className="font-label-sm text-on-surface">{m.profile.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Search Input */}
        <section className="mb-stack-lg">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all pearl-layer"
              placeholder="Search your sparks..." 
              type="text"
            />
          </div>
        </section>

        {/* Messages List (Vertical) */}
        <section className="space-y-4">
          <h2 className="font-title-md text-title-md text-on-surface mb-stack-md">Recent Messages</h2>
          {loadingMatches ? (
            <div className="flex justify-center py-6">
              <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            </div>
          ) : filteredMatches.length === 0 ? (
            <p className="text-sm text-secondary text-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 pearl-layer">
              No conversations match your search.
            </p>
          ) : (
            filteredMatches.map((m) => (
              <div 
                key={m.matchId}
                onClick={() => setActiveMatch({ matchId: m.matchId, profile: m.profile })}
                className="pearl-layer p-4 rounded-2xl flex items-center gap-4 hover:bg-surface-container-high transition-colors cursor-pointer group relative overflow-hidden"
              >
                <div className="relative shrink-0">
                  <img 
                    alt={m.profile.name} 
                    src={m.profile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} 
                    className="w-14 h-14 rounded-full object-cover shadow-sm" 
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-title-md text-[16px] truncate ${m.unreadCount ? 'font-bold text-on-surface' : 'text-on-surface'}`}>{m.profile.name}</h3>
                    <span className="font-label-sm text-primary">{m.unreadCount ? `${m.unreadCount} NEW` : 'Open Chat'}</span>
                  </div>
                  <p className={`font-body-md truncate font-medium ${m.unreadCount ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {m.lastMessageText ? m.lastMessageText : (m.profile.bio ? m.profile.bio.split('\n\n')[0] : 'Click to start chatting...')}
                  </p>
                </div>
                {m.unreadCount > 0 && <div className="w-2.5 h-2.5 bg-primary rounded-full spark-pulse"></div>}
              </div>
            ))
          )}
        </section>

      </main>
    );
  }

  // Active Chat Screen view mapping to first_message_to_elena/code.html mockup
  return (
    <div className="flex-grow pt-16 w-full h-full max-w-xl mx-auto flex flex-col bg-background relative overflow-hidden">
      
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Match Header visual summary */}
        {messages.length === 0 && !loadingMessages && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center mt-6 text-center w-full px-4">
            
            {/* Match Visual Context */}
            <section className="relative w-full flex justify-center items-center mb-8 mt-4">
              <div className="flex items-center gap-2 md:gap-4 relative">
                {/* User Profile */}
                <div className="relative z-10">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-surface overflow-hidden shadow-xl bg-surface-container-low">
                    <img src={myProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"} alt="You" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* Match Connector */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-primary/30 to-tertiary/30"></div>
                  <div className="absolute w-10 h-10 glass-panel rounded-full flex items-center justify-center shadow-md animate-spark z-20">
                    <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </div>
                  <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-tertiary/30 to-primary/30"></div>
                </div>
                {/* Match Profile */}
                <div className="relative z-10">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-surface overflow-hidden shadow-xl bg-surface-container-low">
                    <img src={activeMatch.profile.photos?.[0]?.url} alt={activeMatch.profile.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-tertiary rounded-full border-2 border-surface flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="text-center mb-8">
              <h2 className="font-headline-lg-mobile text-[28px] font-bold text-on-surface mb-2">
                It's a Match!
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                Send the first spark to <span className="text-primary font-semibold">{activeMatch.profile.name}</span>
              </p>
            </section>

            {/* Icebreakers / Starters */}
            <section className="w-full mb-8 text-left">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-tertiary text-sm">lightbulb</span>
                <span className="font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Conversation Starters</span>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  `Ask about travel photos ✈️`,
                  `Mention interest in music 🎷`,
                  `Ask about favorite cafe ☕`
                ].map((text, idx) => (
                  <button 
                    key={idx}
                    onClick={() => fillStarter(text.replace(/[✈️🎷☕]/g, '').trim())}
                    className="glass-panel px-4 py-3 rounded-xl text-left hover:border-tertiary/40 border border-outline-variant/10 transition-all active:scale-95 group w-full md:w-auto"
                  >
                    <p className="font-body-md text-sm font-medium text-on-surface-variant group-hover:text-tertiary transition-colors">{text}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Pro Tip Card */}
            <section className="w-full text-left mb-auto">
              <div className="p-5 md:p-6 rounded-3xl bg-surface-container-low/80 border border-outline-variant/10 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
                </div>
                <div>
                  <h3 className="font-title-md font-bold text-on-surface mb-1 text-sm">Pro Tip</h3>
                  <p className="font-body-md text-on-surface-variant text-xs md:text-sm leading-relaxed">
                    Matches are 3x more likely to reply when you mention a specific detail from their profile!
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* Message Logs */}
        {loadingMessages ? (
          <div className="flex justify-center py-6">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === myProfile.userId;
            const isRead = msg.readAt != null;
            return (
              <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div 
                  className={`max-w-[75%] px-4 py-3 rounded-[20px] text-xs leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-r from-primary to-primary-container text-white rounded-tr-none' 
                      : 'bg-white/80 text-on-surface border border-outline-variant/20 rounded-tl-none'
                  }`}
                >
                  {msg.isImage ? (
                    <img src={msg.text} alt="Attachment" className="max-w-full rounded-lg mb-1" loading="lazy" />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <div className={`flex items-center justify-end gap-1 mt-1.5 ${isMe ? 'text-white/60' : 'text-on-surface-variant/50'}`}>
                    <span className="text-[8px]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isRead ? 'done_all' : 'check'}
                      </span>
                    )}
                  </div>
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

      {/* WhatsApp style Input Area */}
      <div className="w-full px-3 pt-2 pb-[calc(5.5rem+env(safe-area-inset-bottom))] bg-background/80 backdrop-blur-md shrink-0 flex gap-2 items-end z-20 border-t border-outline-variant/10">
        <form 
          onSubmit={handleSendMessage}
          className={`flex-grow flex items-center bg-surface-container-lowest rounded-[24px] px-2 py-1.5 shadow-sm border border-outline-variant/20 ${messages.length === 0 ? 'spark-glow' : ''}`}
        >
          <button type="button" className="text-on-surface-variant/70 hover:text-primary transition-colors p-1.5 shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">mood</span>
          </button>
          
          <input 
            value={inputText}
            onChange={handleInputChange}
            placeholder="Message"
            className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] text-on-surface px-1 py-1.5 placeholder:text-on-surface-variant/60"
            type="text"
          />
          
          <div className="flex items-center shrink-0 pr-1 gap-1">
            <label className="text-on-surface-variant/70 hover:text-primary transition-colors p-1.5 flex items-center justify-center transform -rotate-45 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <span className="material-symbols-outlined text-[22px]">attach_file</span>
            </label>
            {!inputText.trim() && (
              <label className="text-on-surface-variant/70 hover:text-primary transition-colors p-1.5 flex items-center justify-center cursor-pointer">
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                <span className="material-symbols-outlined text-[22px]">photo_camera</span>
              </label>
            )}
          </div>
        </form>

        <button 
          onClick={handleSendMessage}
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-all duration-200 ${
            inputText.trim() 
              ? 'bg-gradient-to-tr from-primary to-primary-container text-white' 
              : 'bg-primary text-white'
          }`}
        >
          {inputText.trim() ? (
            <span className="material-symbols-outlined text-[20px] ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          ) : (
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <MessageSentConfirmation 
            matchProfile={activeMatch.profile}
            myProfile={myProfile}
            onComplete={() => setShowConfirmation(false)}
            onViewAllMatches={() => {
              setShowConfirmation(false);
              setActiveMatch(null);
              onClearActiveMatch();
            }}
            onBackToDiscovery={onBackToDiscovery || (() => setShowConfirmation(false))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
