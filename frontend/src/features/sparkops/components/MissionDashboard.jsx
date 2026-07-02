import React from 'react';

const MissionDashboard = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Mission Control</h1>
        <div style={styles.statusBadge}>System Status: ALL SYSTEMS OPERATIONAL</div>
      </header>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Platform Health</h2>
          <div style={styles.statGroup}>
            <div style={styles.stat}>
              <span style={styles.statLabel}>API Uptime</span>
              <span style={styles.statValue}>99.99%</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Database Load</span>
              <span style={styles.statValue}>24%</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Error Rate</span>
              <span style={styles.statValue}>0.01%</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Live Activity</h2>
          <div style={styles.activityFeed}>
            <div style={styles.activityItem}>User 'Alex' registered <span style={styles.time}>2m ago</span></div>
            <div style={styles.activityItem}>Matching algorithm triggered <span style={styles.time}>5m ago</span></div>
            <div style={styles.activityItem}>AI Profile moderation complete <span style={styles.time}>12m ago</span></div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Active Alerts</h2>
          <div style={styles.alertGroup}>
            <div style={{...styles.alert, borderLeft: '4px solid #f59e0b'}}>High latency in US-East region</div>
            <div style={{...styles.alert, borderLeft: '4px solid #3b82f6'}}>Scheduled maintenance in 2 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' },
  title: { margin: 0, fontSize: '1.875rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.025em' },
  statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
  cardTitle: { margin: '0 0 1.25rem 0', fontSize: '1.125rem', fontWeight: 500, color: '#94a3b8' },
  statGroup: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  stat: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: '#cbd5e1', fontSize: '0.9375rem' },
  statValue: { fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' },
  activityFeed: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  activityItem: { fontSize: '0.9375rem', color: '#e2e8f0', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' },
  time: { fontSize: '0.75rem', color: '#94a3b8', float: 'right', fontWeight: 500 },
  alertGroup: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  alert: { backgroundColor: '#0f172a', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.9375rem', color: '#e2e8f0', border: '1px solid #334155' }
};

export default MissionDashboard;
