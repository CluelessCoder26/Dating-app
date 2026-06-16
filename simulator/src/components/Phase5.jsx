import React, { useState } from 'react';
import { Bell, ShieldCheck, ShieldAlert, CheckCircle, Ban } from 'lucide-react';

export default function Phase5() {
  const [recipientOnline, setRecipientOnline] = useState(false);
  const [notifLogs, setNotifLogs] = useState([]);
  
  const [textToScan, setTextToScan] = useState('');
  const [textScanResults, setTextScanResults] = useState(null);
  const [imageScanResults, setImageScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [blockLogs, setBlockLogs] = useState([]);

  const sendPushTest = () => {
    const jobId = `push_job_${Date.now()}`;

    let logs = [];
    logs.push(`[Event] Match Activity or Chat Message fired for User 102`);
    logs.push(`[API] Checked Redis active session table: User 102 is ${recipientOnline ? 'ONLINE (WebSocket)' : 'OFFLINE (FCM Required)'}`);

    if (recipientOnline) {
      logs.push(`[Socket.io] Match payload delivered instantly. FCM notification SKIPPED.`);
    } else {
      logs.push(`[BullMQ Push Queue] Queued Job ${jobId} for background delivery`);
      logs.push(`[BullMQ Worker] Picked up Job ${jobId}: Fetching FCM device token for User 102 from PostgreSQL`);
      logs.push(`[FCM API] Payload POST https://fcm.googleapis.com/v1/projects/dating-app/messages:send`);
      logs.push(`[FCM API] RESPONSE: { "name": "projects/dating-app/messages/fcm_response_9a91" }`);
      logs.push(`[APNs Client] iOS device token APNs delivery status: Delivered successfully`);
    }

    setNotifLogs(prev => [...logs.reverse(), ...prev].slice(0, 15));
  };

  const handleTextScan = (e) => {
    const text = e.target.value;
    setTextToScan(text);

    if (!text.trim()) {
      setTextScanResults(null);
      return;
    }

    const toxicKeywords = ['hate', 'kill', 'abuse', 'hack', 'bitch', 'idiot', 'spam', 'crap'];
    const hasToxic = toxicKeywords.some(w => text.toLowerCase().includes(w));

    if (hasToxic) {
      setTextScanResults({
        flagged: true,
        categories: {
          harassment: text.toLowerCase().includes('idiot') || text.toLowerCase().includes('bitch') ? 0.92 : 0.05,
          violence: text.toLowerCase().includes('kill') || text.toLowerCase().includes('abuse') ? 0.98 : 0.02,
          hate: text.toLowerCase().includes('hate') ? 0.95 : 0.01
        },
        action: 'BLOCK_MESSAGE_BROADCAST'
      });
    } else {
      setTextScanResults({
        flagged: false,
        categories: { harassment: 0.01, violence: 0.00, hate: 0.02 },
        action: 'ALLOW'
      });
    }
  };

  const simulateImageModeration = (isUnsafe) => {
    setIsScanning(true);
    setImageScanResults(null);

    setTimeout(() => {
      setIsScanning(false);
      if (isUnsafe) {
        setImageScanResults({
          safe: false,
          moderationLabels: [
            { Name: 'Nudity', Confidence: 98.4 },
            { Name: 'Explicit Text / Suggestive', Confidence: 89.2 }
          ],
          action: 'BLOCK_IMAGE_CDN_UPLOAD',
          confidenceThreshold: 80.0
        });
      } else {
        setImageScanResults({
          safe: true,
          moderationLabels: [
            { Name: 'Face Detected', Confidence: 99.8 },
            { Name: 'Casual Portrait', Confidence: 95.0 }
          ],
          action: 'ALLOW_CDN_UPLOAD',
          confidenceThreshold: 80.0
        });
      }
    }, 1200);
  };

  const executeBlockUser = (userId) => {
    let logs = [];
    logs.push(`[API] POST /block-user { blockedUserId: "${userId}" }`);
    logs.push(`[PostgreSQL] INSERT INTO reports_and_blocks (reporter_id, blocked_id, action_type, blocked_at) VALUES (101, "${userId}", 'block', NOW())`);
    logs.push(`[Redis Cache] SADD blocklist:user_101 "user_${userId}"`);
    logs.push(`[Redis Cache] Verification: Checked SISMEMBER blocklist:user_101 "user_${userId}" -> 1 (Blocked Profile hidden from swipe stacks)`);

    setBlockLogs(prev => [...logs.reverse(), ...prev].slice(0, 10));
  };

  const getModerationBackendCode = () => {
    return `// server/services/safety.js
const { OpenAI } = require('openai');
const AWS = require('aws-sdk');

const openai = new OpenAI();
const rekognition = new AWS.Rekognition();

// 1. OpenAI Text Moderation gate
async function scanMessageText(content) {
  const modResponse = await openai.moderations.create({ input: content });
  const [result] = modResponse.results;
  
  return {
    flagged: result.flagged,
    categories: result.categories
  };
}

// 2. AWS Rekognition Image Scan gate
async function scanProfilePhoto(s3Bucket, s3Key) {
  const params = {
    Image: {
      S3Object: { Bucket: s3Bucket, Name: s3Key }
    },
    MinConfidence: 80.0
  };

  const response = await rekognition.detectModerationLabels(params).promise();
  
  const isUnsafe = response.ModerationLabels.length > 0;
  return {
    safe: !isUnsafe,
    labels: response.ModerationLabels
  };
}`;
  };

  return (
    <div className="split-grid animate-fade-in">
      
      {/* Interactive Safety Features & Inputs */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div>
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-rose)', background: 'rgba(244, 63, 94, 0.15)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '16px' }}>
            Phase 5 Simulator
          </span>
          <h2 className="text-2xl font-bold" style={{ margin: '0 0 8px 0' }}>Push Notifications & Safety Shield</h2>
          <p className="text-xs text-muted" style={{ margin: '0 0 24px 0' }}>
            Simulate FCM push notification queues, AWS Rekognition photo safety scans, and OpenAI text filtering gates in real time.
          </p>

          {/* FCM Push Notification Simulator */}
          <div style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '16px', backgroundColor: 'rgba(0, 0, 0, 0.3)', marginBottom: '24px' }}>
            <h3 className="text-xs font-bold uppercase text-muted" style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={13} className="text-color-amber" />
              FCM & APNs Push Queue Simulation
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
              <div>
                <span className="text-xs font-bold" style={{ display: 'block' }}>Recipient Status (Sophia)</span>
                <span className="text-[10px] text-muted" style={{ display: 'block' }}>Toggle target online state to trigger queues</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setRecipientOnline(true)}
                  className={`btn-secondary`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: recipientOnline ? 'var(--color-emerald)' : '',
                    color: recipientOnline ? 'white' : ''
                  }}
                >
                  Online
                </button>
                <button
                  onClick={() => setRecipientOnline(false)}
                  className={`btn-secondary`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: !recipientOnline ? 'var(--color-rose)' : '',
                    color: !recipientOnline ? 'white' : ''
                  }}
                >
                  Offline
                </button>
              </div>
            </div>

            <button onClick={sendPushTest} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Trigger Chat Activity / Send Push Alert
            </button>
          </div>

          {/* AI Content Moderation Sandbox */}
          <div style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '16px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <h3 className="text-xs font-bold uppercase text-muted" style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={13} className="text-color-rose" />
              AI Safety Gates (OpenAI & AWS Rekognition)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '9px', fontWeight: 'bold', uppercase: 'true', color: 'var(--text-muted)', marginBottom: '6px' }}>OpenAI Text Scanner Sandbox</label>
                <input
                  type="text"
                  placeholder="Type message... (e.g. 'I hate you' to trigger OpenAI flag)"
                  value={textToScan}
                  onChange={handleTextScan}
                  className="input-field"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                />

                {textScanResults && (
                  <div className="animate-shake" style={{
                    marginTop: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid',
                    fontSize: '11px',
                    display: 'flex',
                    gap: '8px',
                    backgroundColor: textScanResults.flagged ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    borderColor: textScanResults.flagged ? 'var(--color-rose)' : 'var(--color-emerald)',
                    color: textScanResults.flagged ? 'var(--color-rose)' : 'var(--color-emerald)'
                  }}>
                    {textScanResults.flagged ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                    <div>
                      <span className="font-bold">{textScanResults.flagged ? 'OpenAI Flagged: VIOLENT/ABUSIVE' : 'OpenAI Approved: SAFE'}</span>
                      <p style={{ fontSize: '9px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        Harassment: {Math.round(textScanResults.categories.harassment * 100)}% | 
                        Violence: {Math.round(textScanResults.categories.violence * 100)}% | 
                        Hate: {Math.round(textScanResults.categories.hate * 100)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '9px', fontWeight: 'bold', uppercase: 'true', color: 'var(--text-muted)', marginBottom: '6px' }}>AWS Rekognition Image Scanner</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    onClick={() => simulateImageModeration(false)}
                    disabled={isScanning}
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '8px', justifyContent: 'center' }}
                  >
                    Scan Normal Photo
                  </button>
                  <button 
                    onClick={() => simulateImageModeration(true)}
                    disabled={isScanning}
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '8px', justifyContent: 'center', borderColor: 'rgba(244,63,94,0.3)', color: 'var(--color-rose)' }}
                  >
                    Scan Unsafe Photo
                  </button>
                </div>

                {isScanning && (
                  <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '12px', color: 'var(--text-dim)' }} className="animate-pulse">AWS Rekognition photo analysis in progress...</div>
                )}

                {imageScanResults && (
                  <div style={{
                    marginTop: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid',
                    fontSize: '11px',
                    display: 'flex',
                    gap: '8px',
                    backgroundColor: !imageScanResults.safe ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    borderColor: !imageScanResults.safe ? 'var(--color-rose)' : 'var(--color-emerald)',
                    color: !imageScanResults.safe ? 'var(--color-rose)' : 'var(--color-emerald)'
                  }}>
                    {!imageScanResults.safe ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                    <div>
                      <span className="font-bold">{!imageScanResults.safe ? 'AWS Moderation Alert: EXPLICIT CONTENT DETECTED' : 'AWS Approved: PHOTO SAFE'}</span>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {imageScanResults.moderationLabels.map((lbl, idx) => (
                          <div key={idx}>- {lbl.Name}: {lbl.Confidence.toFixed(1)}% Confidence</div>
                        ))}
                      </div>
                      <span className="font-mono text-[8px] bg-black/40 px-2 py-0.5 rounded text-white inline-block mt-2">Action: {imageScanResults.action}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => executeBlockUser('sophia_102')}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '11px', padding: '8px', justifyContent: 'center', borderColor: 'rgba(244,63,94,0.3)', color: 'var(--color-rose)' }}
          >
            <Ban size={12} /> Block Sophia (Save DB & Redis)
          </button>
        </div>
      </div>

      {/* Safety Logs & Code Config Side */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 className="font-bold text-sm text-gradient-amber" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={14} /> BullMQ Push Queue & FCM Logs
            </h3>
            <div className="log-box-stream" style={{ height: '180px', color: 'var(--color-amber)' }}>
              {notifLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: '72px' }}>Click "Trigger Chat Activity" on the left to fire the notification pipelines.</div>
              ) : (
                notifLogs.map((log, idx) => (
                  <div key={idx} style={{ paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '4px' }}>{log}</div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gradient-pink" style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ban size={14} /> Block & Report Pipeline (Redis Sync)
            </h3>
            <div className="log-box-stream" style={{ height: '120px', color: 'var(--color-rose)' }}>
              {blockLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: '40px' }}>No users blocked yet. Click block Sophia on the left.</div>
              ) : (
                blockLogs.map((log, idx) => (
                  <div key={idx} style={{ paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '4px' }}>{log}</div>
                ))
              )}
            </div>
          </div>

          <div>
            <span className="text-dim" style={{ fontSize: '10px', display: 'block', marginBottom: '4px' }}>AI Moderation Backend Service:</span>
            <div className="code-container" style={{ maxHeight: '120px', overflowY: 'auto' }}>
              <pre style={{ margin: 0, fontSize: '9px', lineHeight: '1.3', color: '#a78bfa' }}>
                {getModerationBackendCode()}
              </pre>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
