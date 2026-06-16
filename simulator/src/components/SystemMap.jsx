import React, { useState } from 'react';
import { Database, Server, Zap, Cpu, Shield, Layers, MessageSquare } from 'lucide-react';

export default function SystemMap({ activePhase, setActivePhase }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    {
      id: 'frontend',
      label: 'Mobile & Web Client',
      sub: 'React Native + Expo / Next.js',
      icon: Layers,
      color: 'var(--color-blue)',
      phases: [1, 2, 3, 4, 5],
      details: 'Captures location, handles swipe gestures (Reanimated), renders chat UI, uploads media directly to S3 via pre-signed URLs, and handles Firebase notifications.',
    },
    {
      id: 'api',
      label: 'Primary API Gateway',
      sub: 'Node.js Express / FastAPI',
      icon: Server,
      color: 'var(--color-purple)',
      phases: [1, 2, 3, 4, 5],
      details: 'Handles authentication tokens, user onboarding, photo upload signing, swipe POST logic, and serves basic client endpoints.',
    },
    {
      id: 'postgres',
      label: 'PostgreSQL DB',
      sub: 'Relational Store + PostGIS',
      icon: Database,
      color: 'var(--color-emerald)',
      phases: [1, 2, 3, 4, 5],
      details: 'Primary database storing users, profiles, swipes, matches, and offline message history. Geolocation queries run via PostGIS indices.',
    },
    {
      id: 'redis',
      label: 'Redis Caching & PubSub',
      sub: 'Sorted Sets, Sliding Window',
      icon: Zap,
      color: 'var(--color-pink)',
      phases: [2, 3, 4, 5],
      details: 'Caches active candidate stacks, handles swipe rate-limiting, and broadcasts match events to the socket cluster via Pub/Sub.',
    },
    {
      id: 'socket',
      label: 'WebSocket Cluster',
      sub: 'Socket.io Server',
      icon: MessageSquare,
      color: 'var(--color-blue)',
      phases: [4],
      details: 'Maintains live state connections, delivers real-time typing events, and synchronizes live chat messages via match rooms.',
    },
    {
      id: 'bullmq',
      label: 'BullMQ Job Workers',
      sub: 'Asynchronous Tasks',
      icon: Cpu,
      color: 'var(--color-amber)',
      phases: [2, 4, 5],
      details: 'Runs ELO scoring recalculations, writes chat history to PostgreSQL asynchronously, and schedules offline push notifications.',
    },
    {
      id: 'saas',
      label: 'External Services & safety',
      sub: 'S3, FCM, OpenAI, APNs',
      icon: Shield,
      color: 'var(--color-rose)',
      phases: [1, 4, 5],
      details: 'Handles Cloudinary image resizing, AWS Rekognition photo scanning, OpenAI chat moderation, and Firebase Cloud Messaging for pushes.',
    }
  ];

  return (
    <div className="glass-panel system-map-box animate-fade-in">
      <div className="system-map-top">
        <div>
          <h2 className="text-xl font-bold text-gradient-pink" style={{ margin: 0 }}>System Architecture Flow</h2>
          <p className="text-xs text-muted" style={{ margin: '4px 0 0 0' }}>Hover over nodes to see their role in the dating app infrastructure.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-emerald)' }}></span> Relational DB</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-pink)' }}></span> Cache / PubSub</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-amber)' }}></span> Async Worker</span>
        </div>
      </div>

      <div className="system-map-grid">
        {/* Visual Map Canvas for desktop / Interactive nodes */}
        <div className="system-map-canvas">
          {nodes.map((node) => {
            const IconComponent = node.icon;
            const isHighlighted = activePhase === null || node.phases.includes(activePhase);
            const isHovered = hoveredNode === node.id;
            
            return (
              <div
                key={node.id}
                className={`system-node-card glass-panel-interactive glass-panel ${isHovered ? 'scale-105 shadow-glow' : ''}`}
                style={{
                  opacity: isHighlighted ? 1 : 0.35,
                  borderLeftColor: node.color,
                  boxShadow: isHovered ? `0 0 15px ${node.color}40` : ''
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="system-node-card-header">
                  <div className="system-node-icon-box" style={{ backgroundColor: `${node.color}15`, color: node.color }}>
                    <IconComponent size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs" style={{ margin: 0 }}>{node.label}</h3>
                    <p className="text-dim font-mono" style={{ margin: '2px 0 0 0', fontSize: '9px' }}>{node.sub}</p>
                  </div>
                </div>
                
                <div className="system-node-chips">
                  {node.phases.map(p => (
                    <span 
                      key={p} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhase(p);
                      }}
                      className={`system-node-chip ${activePhase === p ? 'active' : ''}`}
                    >
                      P{p} Setup
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.5)' }}>
          <div>
            <h3 className="font-bold text-sm text-gradient-blue border-b border-border-glass pb-2 flex items-center gap-2" style={{ margin: '0 0 12px 0' }}>
              <Layers size={14} />
              Component Details
            </h3>
            {hoveredNode ? (
              (() => {
                const node = nodes.find(n => n.id === hoveredNode);
                return (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 className="font-bold text-sm" style={{ color: node.color, margin: 0 }}>{node.label}</h4>
                    <p className="text-xs text-muted" style={{ margin: 0 }}>{node.sub}</p>
                    <p className="text-xs leading-relaxed text-white bg-white/5 p-3 rounded-lg border border-white/5" style={{ margin: '8px 0 0 0' }}>
                      {node.details}
                    </p>
                    <div style={{ marginTop: '12px' }}>
                      <span className="text-xs font-bold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Phase Integrations:</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {node.phases.map(p => (
                          <span key={p} className="text-dim" style={{ fontSize: '9px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                            Phase {p} Setup
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-dim)' }}>
                <p className="text-xs">Hover over any database or server stack block in the system grid map to inspect integration schemas, queries, and APIs.</p>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <span className="text-xs font-bold text-muted" style={{ display: 'block', marginBottom: '8px' }}>Active Phase Filter:</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePhase(activePhase === p ? null : p)}
                  className={`btn-secondary`}
                  style={{
                    padding: '6px',
                    fontSize: '11px',
                    fontWeight: activePhase === p ? 'bold' : 'normal',
                    borderColor: activePhase === p ? 'var(--color-pink)' : '',
                    color: activePhase === p ? 'var(--color-pink)' : ''
                  }}
                >
                  P{p}
                </button>
              ))}
            </div>
            {activePhase && (
              <button 
                onClick={() => setActivePhase(null)}
                className="text-color-pink hover:underline"
                style={{ fontSize: '11px', background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'center', marginTop: '8px' }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
