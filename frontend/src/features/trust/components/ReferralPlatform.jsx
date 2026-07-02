import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReferralPlatform = ({ referralCode, totalReferrals, leaderboard }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="referral-platform" style={styles.container}>
      <div className="referral-hero" style={styles.hero}>
        <h2 style={{ margin: '0 0 10px 0' }}>Invite Friends, Get Rewarded!</h2>
        <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>Give your friends a premium trial and earn coins when they join.</p>
        
        <div className="referral-link-box" style={styles.linkBox}>
          <input 
            type="text" 
            readOnly 
            value={`https://app.com/join/${referralCode}`} 
            style={styles.input} 
          />
          <button onClick={handleCopy} style={styles.copyBtn}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="referral-stats" style={styles.statsContainer}>
        <div className="stat-card" style={styles.statCard}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#666' }}>Your Referrals</h3>
          <div className="stat-value" style={styles.statValue}>{totalReferrals}</div>
        </div>
        <div className="stat-card" style={styles.statCard}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#666' }}>Coins Earned</h3>
          <div className="stat-value" style={styles.statValue}>{totalReferrals * 50} 🪙</div>
        </div>
      </div>

      <div className="leaderboard-section" style={styles.leaderboard}>
        <h3 style={{ marginBottom: '16px' }}>Top Referrers</h3>
        <ul className="leaderboard-list" style={styles.list}>
          {leaderboard.map((user, index) => (
            <li key={user.id} style={styles.listItem}>
              <div style={styles.rankInfo}>
                <span style={styles.rank}>#{index + 1}</span>
                <span style={styles.avatar}>{user.avatar || '👤'}</span>
                <span style={styles.name}>{user.name}</span>
              </div>
              <span style={styles.score}>{user.referralCount} friends</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'inherit', color: '#333' },
  hero: { background: 'linear-gradient(135deg, #6e8efb, #a777e3)', padding: '40px 30px', borderRadius: '16px', color: '#fff', textAlign: 'center', marginBottom: '24px' },
  linkBox: { display: 'flex', background: '#fff', borderRadius: '8px', padding: '6px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  input: { flex: 1, border: 'none', padding: '10px 16px', fontSize: '1rem', outline: 'none', background: 'transparent', color: '#333' },
  copyBtn: { background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' },
  statsContainer: { display: 'flex', gap: '20px', marginBottom: '30px' },
  statCard: { flex: 1, background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  statValue: { fontSize: '2rem', fontWeight: 'bold', color: '#000' },
  leaderboard: { background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #eee' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f5f5f5' },
  rankInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  rank: { fontWeight: 'bold', color: '#999', width: '24px' },
  avatar: { fontSize: '1.5rem', background: '#f0f0f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '600', fontSize: '1rem' },
  score: { fontWeight: 'bold', color: '#6e8efb' }
};

ReferralPlatform.propTypes = {
  referralCode: PropTypes.string,
  totalReferrals: PropTypes.number,
  leaderboard: PropTypes.array
};

ReferralPlatform.defaultProps = {
  referralCode: 'TRUST2026',
  totalReferrals: 5,
  leaderboard: [
    { id: 1, name: 'Alice', referralCount: 42 },
    { id: 2, name: 'Bob', referralCount: 38 },
    { id: 3, name: 'Charlie', referralCount: 21 },
    { id: 4, name: 'David', referralCount: 15 }
  ]
};

export default ReferralPlatform;
