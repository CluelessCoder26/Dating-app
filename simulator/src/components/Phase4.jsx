import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Image, ShieldAlert, Check, CheckCheck, Play, ArrowRightLeft } from 'lucide-react';
import sophiaImg from '../assets/sophia.png';

export default function Phase4() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'sophia', text: 'Hey there! Loved your bio. Do you climb or just hike?', timestamp: '1:02 PM', read: true },
    { id: 2, sender: 'me', text: 'Hey Sophia! Mostly hiking, but I\'m getting into indoor climbing. What about you?', timestamp: '1:04 PM', read: true },
    { id: 3, sender: 'sophia', text: 'I climb outdoors mostly! Let\'s plan a climbing gym session sometime.', timestamp: '1:05 PM', read: true }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socketLogs, setSocketLogs] = useState([]);
  const [bullQueue, setBullQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const bottomRef = useRef(null);

  const logSocketEvent = (event, data) => {
    setSocketLogs(prev => [`[Socket.io] EMIT: ${event} -> ${JSON.stringify(data)}`, ...prev].slice(0, 10));
  };

  const queueBullJob = (msgId, text, sender) => {
    const jobId = `persist_msg_${msgId}`;
    setBullQueue(prev => [
      { id: jobId, status: 'queued', text, sender, time: new Date().toLocaleTimeString() },
      ...prev
    ].slice(0, 6));

    setTimeout(() => {
      setBullQueue(prev => prev.map(job => {
        if (job.id === jobId) {
          logSocketEvent('msg_persisted_postgres', { jobId, msgId, status: 'success' });
          return { ...job, status: 'completed' };
        }
        return job;
      }));
    }, 2000);
  };

  const handleSend = (text, isImage = false) => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      isImage
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    logSocketEvent('send_message', { roomId: 'match_sophia_101', text, senderId: 101, isImage });
    queueBullJob(newMsg.id, text, 'me');

    setTimeout(() => {
      setIsTyping(true);
      logSocketEvent('typing_indicator', { roomId: 'match_sophia_101', userId: 'sophia', status: 'typing' });
      
      setTimeout(() => {
        setIsTyping(false);
        logSocketEvent('typing_indicator', { roomId: 'match_sophia_101', userId: 'sophia', status: 'idle' });
        
        const sophiaMsg = {
          id: Date.now() + 1,
          sender: 'sophia',
          text: isImage ? "That looks awesome! Where is this?" : "That sounds like a great plan! Sunday works best for me.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true
        };
        
        setMessages(prev => [...prev, sophiaMsg]);
        logSocketEvent('receive_message', { roomId: 'match_sophia_101', text: sophiaMsg.text, senderId: 'sophia' });
        queueBullJob(sophiaMsg.id, sophiaMsg.text, 'sophia');

        setMessages(prev => prev.map(m => m.sender === 'me' ? { ...m, read: true } : m));
        logSocketEvent('read_receipt', { roomId: 'match_sophia_101', userId: 'sophia', readUpTo: sophiaMsg.id });

      }, 2500);
    }, 1500);
  };

  const simulateS3Upload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    logSocketEvent('s3_presigned_url_request', { fileName: file.name, contentType: file.type });
    
    setTimeout(() => {
      const fakeS3Url = `https://dating-app-chat-media.s3.amazonaws.com/uploads/match_sophia_101/${Date.now()}_${file.name}`;
      logSocketEvent('s3_upload_complete', { s3Url: fakeS3Url });
      setIsUploading(false);
      handleSend(fakeS3Url, true);
    }, 1500);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getSocketServerCode = () => {
    return `// server/sockets/chat.js
const socketIo = require('socket.io');
const BullMQ = require('bullmq');

const messageQueue = new BullMQ.Queue('messagePersistence');

module.exports = function(server, redisAdapter) {
  const io = socketIo(server, { adapter: redisAdapter });

  io.on('connection', (socket) => {
    // Join match room
    socket.on('join_match', ({ matchId }) => {
      socket.join(\`room:\${matchId}\`);
      socket.to(\`room:\${matchId}\`).emit('typing_status', { userId: socket.userId, typing: false });
    });

    // Handle incoming message
    socket.on('send_message', async ({ roomId, text, senderId, isImage }) => {
      // 1. Instantly broadcast message to other user in the room (Zero-latency)
      socket.to(\`room:\${roomId}\`).emit('receive_message', { text, senderId, isImage });

      // 2. Offload database write to BullMQ background queue
      await messageQueue.add('saveMessage', {
        roomId,
        text,
        senderId,
        isImage,
        createdAt: new Date()
      });
    });

    socket.on('typing', ({ roomId, isTyping }) => {
      socket.to(\`room:\${roomId}\`).emit('typing_status', { userId: socket.userId, typing: isTyping });
    });
  });
};`;
  };

  return (
    <div className="split-grid animate-fade-in">
      
      {/* Live Chat Simulator App Screen */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div>
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-purple)', background: 'rgba(139, 92, 246, 0.15)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '16px' }}>
            Phase 4 Simulator
          </span>
          <h2 className="text-2xl font-bold" style={{ margin: '0 0 8px 0' }}>Real-Time Chat Simulator</h2>
          <p className="text-xs text-muted" style={{ margin: '0 0 16px 0' }}>
            Test the zero-latency websocket pipeline. Sending messages updates the UI instantly, and database writes are queued in the background.
          </p>

          <div className="chat-window">
            {/* Chat Header */}
            <div className="chat-window-header">
              <div className="chat-user-info">
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-emerald)' }} className="pulse-glow-pink"></span>
                <div>
                  <h3 className="font-bold text-xs text-white" style={{ margin: 0 }}>Sophia</h3>
                  <p className="text-dim" style={{ fontSize: '9px', margin: '2px 0 0 0' }}>Active Room: match_sophia_101</p>
                </div>
              </div>
              <span className="font-mono text-dim" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px' }}>Socket.io Connected</span>
            </div>

            {/* Message Thread Area */}
            <div className="chat-message-list">
              {messages.map((m) => {
                const isMe = m.sender === 'me';
                return (
                  <div key={m.id} className={`chat-msg ${isMe ? 'me' : 'other'}`}>
                    <div className="chat-msg-body">
                      {m.isImage ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <img src={m.text.startsWith('http') ? sophiaImg : m.text} alt="Shared File" style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span className="font-mono" style={{ fontSize: '8px', opacity: 0.5 }}>Direct S3 URL</span>
                        </div>
                      ) : (
                        m.text
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '9px', color: 'var(--text-dim)' }}>
                      <span>{m.timestamp}</span>
                      {isMe && (
                        m.read ? <CheckCheck size={10} style={{ color: 'var(--color-blue)' }} /> : <Check size={10} />
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="chat-msg other" style={{ fontStyle: 'italic', fontSize: '10px', color: 'var(--text-dim)', padding: '4px 8px' }}>
                  Sophia is typing...
                </div>
              )}
              <div ref={bottomRef}></div>
            </div>

            {/* Input Footer */}
            <div className="chat-input-bar">
              <label className="btn-secondary" style={{ padding: '8px', cursor: 'pointer' }}>
                <Image size={14} className={isUploading ? 'animate-spin text-color-purple' : 'text-muted'} />
                <input type="file" accept="image/*" style={{ display: 'none' }} disabled={isUploading} onChange={simulateS3Upload} />
              </label>
              
              <input
                type="text"
                placeholder={isUploading ? "Uploading direct to S3..." : "Type your message..."}
                value={input}
                disabled={isUploading}
                onChange={(e) => {
                  setInput(e.target.value);
                  logSocketEvent('typing_indicator', { roomId: 'match_sophia_101', userId: 'me', status: 'typing' });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend(input);
                }}
                className="input-field"
                style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              />
              
              <button 
                onClick={() => handleSend(input)}
                className="btn-primary"
                style={{ padding: '8px' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Behind-the-Scenes Websockets & Workers */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <h3 className="font-bold text-sm text-gradient-blue" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowRightLeft size={14} /> Socket.io Live Frame Activity
            </h3>
            <div className="log-box-stream" style={{ height: '180px', color: 'var(--color-blue)' }}>
              {socketLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: '72px' }}>Send a message to see raw Socket.io room frame transmissions.</div>
              ) : (
                socketLogs.map((log, idx) => (
                  <div key={idx} style={{ paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '4px' }}>{log}</div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gradient-pink" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={14} /> Asynchronous persistence Queue (BullMQ Worker)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {bullQueue.length === 0 ? (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontSize: '11px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                  No messages queued in BullMQ yet.
                </div>
              ) : (
                bullQueue.map((job) => (
                  <div key={job.id} style={{ background: '#0a0812', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', fontSize: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="font-mono font-bold truncate" style={{ color: 'var(--color-purple)', maxWidth: '90px' }}>{job.id}</span>
                      <span style={{
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontWeight: 'bold',
                        fontSize: '8px',
                        backgroundColor: job.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: job.status === 'completed' ? 'var(--color-emerald)' : 'var(--color-amber)'
                      }}>{job.status.toUpperCase()}</span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Msg: "{job.text}"</p>
                    <span style={{ fontSize: '8px', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>Queued: {job.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <span className="text-dim" style={{ fontSize: '10px', display: 'block', marginBottom: '4px' }}>WebSocket Server Code:</span>
            <div className="code-container" style={{ maxHeight: '120px', overflowY: 'auto' }}>
              <pre style={{ margin: 0, fontSize: '9px', lineHeight: '1.3', color: '#a78bfa' }}>
                {getSocketServerCode()}
              </pre>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
