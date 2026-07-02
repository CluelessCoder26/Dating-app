import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RewardsPlatform = ({ coins, badges, dailyStreak, achievements }) => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="rewards-platform">
      <div className="rewards-header" style={styles.header}>
        <h2>Your Rewards</h2>
        <div className="coins-display" style={styles.coins}>
          <span className="coin-icon">🪙</span>
          <span className="coin-balance">{coins}</span>
        </div>
      </div>

      <div className="rewards-tabs" style={styles.tabs}>
        <button 
          style={activeTab === 'daily' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('daily')}
        >
          Daily
        </button>
        <button 
          style={activeTab === 'achievements' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          style={activeTab === 'badges' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
      </div>

      <div className="rewards-content" style={styles.content}>
        {activeTab === 'daily' && (
          <div className="daily-rewards" style={styles.pane}>
            <h3>Daily Streak: {dailyStreak} 🔥</h3>
            <div className="milestone-tracker" style={styles.milestoneTracker}>
              <div style={{...styles.milestone, ...styles.completed}}>Day 1</div>
              <div style={{...styles.milestone, ...styles.completed}}>Day 2</div>
              <div style={{...styles.milestone, ...styles.active}}>Day 3</div>
              <div style={styles.milestone}>Day 4</div>
              <div style={styles.milestone}>Day 5</div>
            </div>
            <button style={styles.claimBtn}>Claim Today's Reward</button>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-list" style={styles.pane}>
            {achievements.map((ach, index) => (
              <div key={index} style={styles.card}>
                <h4 style={{ margin: '0 0 8px 0' }}>{ach.title}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#666' }}>{ach.description}</p>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${ach.progress}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="badges-grid" style={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <div key={index} style={styles.badgeItem}>
                <span style={styles.badgeIcon}>{badge.icon}</span>
                <span style={styles.badgeName}>{badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  coins: { fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', background: '#fff9e6', padding: '8px 16px', borderRadius: '20px', color: '#b8860b' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee' },
  tabBtn: { padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#666', borderBottom: '2px solid transparent', marginBottom: '-2px' },
  activeTabBtn: { padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#000', borderBottom: '2px solid #007bff', fontWeight: 'bold', marginBottom: '-2px' },
  content: { background: '#fafafa', padding: '20px', borderRadius: '12px' },
  pane: { animation: 'fadeIn 0.3s ease-in-out' },
  milestoneTracker: { display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '30px' },
  milestone: { padding: '10px', background: '#eee', borderRadius: '8px', flex: 1, textAlign: 'center', fontSize: '0.9rem' },
  completed: { background: '#4caf50', color: '#fff' },
  active: { background: '#007bff', color: '#fff', transform: 'scale(1.05)', boxShadow: '0 4px 10px rgba(0,123,255,0.3)' },
  claimBtn: { padding: '12px 24px', background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255,107,107,0.4)' },
  card: { background: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  progressBar: { height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#4caf50', borderRadius: '4px', transition: 'width 0.3s ease' },
  badgesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px', animation: 'fadeIn 0.3s ease-in-out' },
  badgeItem: { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  badgeIcon: { fontSize: '2rem' },
  badgeName: { fontSize: '0.9rem', fontWeight: 'bold' }
};

RewardsPlatform.propTypes = {
  coins: PropTypes.number,
  badges: PropTypes.array,
  dailyStreak: PropTypes.number,
  achievements: PropTypes.array
};

RewardsPlatform.defaultProps = {
  coins: 450,
  badges: [{ icon: '🌟', name: 'Early Bird' }, { icon: '💬', name: 'Chatterbox' }, { icon: '🔥', name: 'Hot Streak' }],
  dailyStreak: 3,
  achievements: [
    { title: 'First Date', description: 'Go on your first date', progress: 100 },
    { title: 'Social Butterfly', description: 'Talk to 10 new people', progress: 60 }
  ]
};

export default RewardsPlatform;
