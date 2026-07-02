import React from 'react';
import PropTypes from 'prop-types';

const InsightsDashboard = ({ weeklyActivity, profileViews, discoveryStats }) => {
  const maxActivity = Math.max(...weeklyActivity.map(d => d.activity));

  return (
    <div className="insights-dashboard" style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: '0 0 4px 0' }}>Activity Insights</h2>
        <p style={{ margin: 0, color: '#666' }}>Track your growth and discovery metrics</p>
      </div>

      <div className="metrics-grid" style={styles.grid}>
        <div className="metric-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Profile Views</h3>
          <div className="metric-value" style={styles.value}>{profileViews.total}</div>
          <div style={{
            ...styles.trend,
            color: profileViews.trend > 0 ? '#2e7d32' : '#d32f2f',
            background: profileViews.trend > 0 ? '#e8f5e9' : '#ffebee'
          }}>
            {profileViews.trend > 0 ? '↑' : '↓'} {Math.abs(profileViews.trend)}% this week
          </div>
        </div>

        <div className="metric-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Discovery Rate</h3>
          <div className="metric-value" style={styles.value}>{discoveryStats.matches}</div>
          <div style={styles.label}>New matches generated</div>
        </div>
        
        <div className="metric-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Engagement Score</h3>
          <div className="metric-value" style={styles.value}>85/100</div>
          <div style={styles.label}>Top 15% of active users</div>
        </div>
      </div>

      <div className="charts-section" style={styles.chartSection}>
        <h3 style={{ margin: '0 0 20px 0' }}>Weekly Activity</h3>
        
        {/* Mock visual structure for lazy-loaded chart */}
        <div className="mock-chart-container" style={styles.chartContainer}>
          <div className="chart-bars" style={styles.chartBars}>
            {weeklyActivity.map((day, index) => {
              const heightPercent = (day.activity / maxActivity) * 100;
              return (
                <div key={index} className="chart-bar-group" style={styles.barGroup}>
                  <div style={styles.barWrapper}>
                    <div 
                      className="bar" 
                      style={{ ...styles.bar, height: `${heightPercent}%` }}
                      title={`${day.label}: ${day.activity}`}
                    ></div>
                  </div>
                  <span style={styles.barLabel}>{day.label}</span>
                </div>
              );
            })}
          </div>
          
          <div style={styles.chartOverlay}>
            <span style={styles.overlayText}>Detailed Analytics Chart (Lazy Loaded)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'inherit', color: '#333' },
  header: { marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
  card: { background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  cardTitle: { margin: '0 0 12px 0', fontSize: '1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
  value: { fontSize: '2.5rem', fontWeight: 'bold', color: '#111', margin: '0 0 12px 0' },
  trend: { display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' },
  label: { color: '#888', fontSize: '0.9rem' },
  chartSection: { background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px' },
  chartContainer: { position: 'relative', height: '300px', background: '#fafafa', borderRadius: '8px', padding: '20px' },
  chartBars: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%', paddingBottom: '30px' },
  barGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  barWrapper: { height: '220px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  bar: { width: '40%', background: 'linear-gradient(to top, #6e8efb, #4a6ee0)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' },
  barLabel: { marginTop: '12px', fontSize: '0.85rem', color: '#666', fontWeight: '500' },
  chartOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', border: '1px dashed #ccc', borderRadius: '8px' },
  overlayText: { background: '#333', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', opacity: 0.8 }
};

InsightsDashboard.propTypes = {
  weeklyActivity: PropTypes.array,
  profileViews: PropTypes.object,
  discoveryStats: PropTypes.object
};

InsightsDashboard.defaultProps = {
  weeklyActivity: [
    { label: 'Mon', activity: 40 },
    { label: 'Tue', activity: 65 },
    { label: 'Wed', activity: 45 },
    { label: 'Thu', activity: 80 },
    { label: 'Fri', activity: 95 },
    { label: 'Sat', activity: 100 },
    { label: 'Sun', activity: 70 }
  ],
  profileViews: { total: 124, trend: 15 },
  discoveryStats: { matches: 8 }
};

export default InsightsDashboard;
