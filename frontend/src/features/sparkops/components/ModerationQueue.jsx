import React, { useState } from 'react';

const mockReports = [
  { id: '101', type: 'Inappropriate Content', target: 'Profile_442', aiRecommendation: 'Suspend (92% confidence)', status: 'Pending', timestamp: '10 mins ago' },
  { id: '102', type: 'Spam Behavior', target: 'User_991', aiRecommendation: 'Shadowban (88% confidence)', status: 'Pending', timestamp: '22 mins ago' },
];

const ModerationQueue = () => {
  const [reports, setReports] = useState(mockReports);

  const handleAction = (id, action) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleWrapper}>
          <h1 style={styles.title}>Moderation Queue</h1>
          <div style={styles.counter}>{reports.length} pending items</div>
        </div>
        <button style={styles.btnSecondary}>Refresh Queue</button>
      </header>

      <div style={styles.queueList}>
        {reports.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎉</div>
            <div style={styles.emptyText}>Queue is empty. Great job!</div>
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>{report.type}</h3>
                  <div style={styles.cardMeta}>Report #{report.id} • {report.timestamp}</div>
                </div>
                <span style={styles.targetBadge}>Target: {report.target}</span>
              </div>
              
              <div style={styles.aiPanel}>
                <div style={styles.aiLabel}>✨ AI Recommendation:</div>
                <div style={styles.aiValue}>{report.aiRecommendation}</div>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnApprove} onClick={() => handleAction(report.id, 'Accept AI')}>Accept AI Rec</button>
                <button style={styles.btnOverride} onClick={() => handleAction(report.id, 'Manual Override')}>Manual Override</button>
                <button style={styles.btnDismiss} onClick={() => handleAction(report.id, 'Dismiss')}>Dismiss</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' },
  titleWrapper: { display: 'flex', alignItems: 'center', gap: '1rem' },
  title: { margin: 0, fontSize: '1.875rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.025em' },
  counter: { backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '0.375rem 0.75rem', borderRadius: '9999px', color: '#60a5fa', fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(59, 130, 246, 0.3)' },
  btnSecondary: { backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', transition: 'all 0.2s' },
  queueList: { display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' },
  emptyState: { textAlign: 'center', padding: '6rem 2rem', backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px dashed #334155' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyText: { color: '#94a3b8', fontSize: '1.125rem', fontWeight: 500 },
  card: { backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  cardTitle: { margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#f8fafc', fontWeight: 600 },
  cardMeta: { color: '#64748b', fontSize: '0.875rem' },
  targetBadge: { backgroundColor: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', border: '1px solid #334155', color: '#cbd5e1', fontWeight: 500 },
  aiPanel: { backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1rem 1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' },
  aiLabel: { color: '#818cf8', fontWeight: 600, fontSize: '0.9375rem' },
  aiValue: { color: '#e0e7ff', fontSize: '0.9375rem', fontWeight: 500 },
  actions: { display: 'flex', gap: '1rem', borderTop: '1px solid #334155', paddingTop: '1.5rem' },
  btnApprove: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.5)' },
  btnOverride: { backgroundColor: '#b45309', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'background-color 0.2s' },
  btnDismiss: { backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #475569', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', marginLeft: 'auto' },
};

export default ModerationQueue;
