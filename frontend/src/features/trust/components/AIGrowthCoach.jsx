import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AIGrowthCoach = ({ profileCompleteness, recentInteractions }) => {
  const [activeTip, setActiveTip] = useState(0);

  const tips = [
    {
      category: 'Profile',
      message: 'Adding a full-body picture can increase your match rate by 30%!',
      action: 'Upload Photo'
    },
    {
      category: 'Conversation',
      message: 'Try asking open-ended questions to keep the conversation flowing.',
      action: 'View Examples'
    },
    {
      category: 'Relationship',
      message: 'Consistency is key! Regular check-ins build stronger bonds.',
      action: 'Read Article'
    }
  ];

  return (
    <div className="ai-coach-container" style={styles.container}>
      <div className="coach-header" style={styles.header}>
        <div className="ai-avatar" style={styles.avatar}>🤖</div>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem' }}>AI Growth Coach</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Your personalized dating and relationship assistant</p>
        </div>
      </div>

      <div className="coach-insights" style={styles.insightsGrid}>
        <div className="insight-card" style={styles.insightCard}>
          <h3 style={styles.cardTitle}>Profile Strength</h3>
          <div className="progress-ring" style={styles.progressRing}>
            <span style={styles.progressValue}>{profileCompleteness}%</span>
          </div>
          <p style={styles.insightText}>
            {profileCompleteness < 80 ? 'Almost there! Add more details to stand out.' : 'Looking great! Your profile is highly visible.'}
          </p>
        </div>
        
        <div className="insight-card" style={styles.insightCard}>
          <h3 style={styles.cardTitle}>Recent Activity</h3>
          <div style={styles.activityValue}>{recentInteractions}</div>
          <p style={styles.insightText}>active chats this week.</p>
          <div style={styles.trendIndicator}>🔥 +2 from last week</div>
        </div>
      </div>

      <div className="coach-tips" style={styles.tipsSection}>
        <h3 style={{ marginBottom: '16px' }}>Today's Coaching Tips</h3>
        <div className="tip-carousel" style={styles.carousel}>
          <div className="tip-card" style={styles.tipCard}>
            <span style={styles.tipCategory}>{tips[activeTip].category} Tip</span>
            <p style={styles.tipMessage}>"{tips[activeTip].message}"</p>
            <button style={styles.tipBtn}>{tips[activeTip].action}</button>
          </div>
          
          <div className="carousel-controls" style={styles.controls}>
            <button 
              disabled={activeTip === 0} 
              onClick={() => setActiveTip(prev => prev - 1)}
              style={{ ...styles.controlBtn, opacity: activeTip === 0 ? 0.5 : 1 }}
            >
              ← Prev
            </button>
            <span style={styles.indicator}>{activeTip + 1} / {tips.length}</span>
            <button 
              disabled={activeTip === tips.length - 1} 
              onClick={() => setActiveTip(prev => prev + 1)}
              style={{ ...styles.controlBtn, opacity: activeTip === tips.length - 1 ? 0.5 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'inherit', color: '#333', background: '#fdfdfd', borderRadius: '16px', border: '1px solid #eaeaea', padding: '24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  avatar: { fontSize: '2.5rem', background: '#f0f4ff', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,255,0.1)' },
  insightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
  insightCard: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  cardTitle: { margin: '0 0 16px 0', fontSize: '1.1rem', color: '#444' },
  progressRing: { width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#4caf50 75%, #eee 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative' },
  progressValue: { background: '#fff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
  activityValue: { fontSize: '3rem', fontWeight: 'bold', color: '#007bff', lineHeight: 1, margin: '16px 0' },
  insightText: { color: '#666', fontSize: '0.95rem', margin: 0 },
  trendIndicator: { marginTop: '12px', display: 'inline-block', background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' },
  tipsSection: { background: '#f8f9fc', padding: '24px', borderRadius: '12px' },
  carousel: { display: 'flex', flexDirection: 'column', gap: '20px' },
  tipCard: { background: '#fff', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #6e8efb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  tipCategory: { fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#6e8efb', fontWeight: 'bold', display: 'block', marginBottom: '8px' },
  tipMessage: { fontSize: '1.1rem', fontStyle: 'italic', margin: '0 0 20px 0', color: '#333' },
  tipBtn: { background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  controlBtn: { background: 'none', border: 'none', color: '#007bff', fontWeight: 'bold', cursor: 'pointer', padding: '8px' },
  indicator: { color: '#888', fontSize: '0.9rem', fontWeight: 'bold' }
};

AIGrowthCoach.propTypes = {
  profileCompleteness: PropTypes.number,
  recentInteractions: PropTypes.number
};

AIGrowthCoach.defaultProps = {
  profileCompleteness: 75,
  recentInteractions: 4
};

export default AIGrowthCoach;
