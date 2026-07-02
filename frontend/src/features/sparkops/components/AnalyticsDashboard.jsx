import React from 'react';

const AnalyticsDashboard = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Analytics Hub</h1>
        <div style={styles.dateRange}>
          <span style={styles.dateLabel}>Showing:</span> Last 30 Days ▼
        </div>
      </header>

      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Daily Active Users (DAU)</div>
          <div style={styles.kpiValue}>24.5K</div>
          <div style={styles.kpiTrendPositive}>↑ 12.4% vs last period</div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Monthly Active Users (MAU)</div>
          <div style={styles.kpiValue}>142.8K</div>
          <div style={styles.kpiTrendPositive}>↑ 8.1% vs last period</div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Retention Rate (D7)</div>
          <div style={styles.kpiValue}>41.2%</div>
          <div style={styles.kpiTrendNegative}>↓ 2.3% vs last period</div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiLabel}>Conversion (Free to Paid)</div>
          <div style={styles.kpiValue}>8.4%</div>
          <div style={styles.kpiTrendPositive}>↑ 1.5% vs last period</div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Active Users Trend</h3>
          <div style={styles.mockChart}>
            <div style={styles.mockChartBarGroup}>
              {[40, 60, 50, 80, 70, 90, 85].map((h, i) => (
                <div key={i} style={styles.barWrapper}>
                  <div style={{...styles.mockBar, height: `${h}%`}}></div>
                  <div style={styles.barLabel}>{['M','T','W','T','F','S','S'][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Conversion Funnel</h3>
          <div style={styles.mockChart}>
             <div style={styles.funnelContainer}>
               <div style={{...styles.funnelStep, width: '90%', opacity: 1}}>
                 <span>Sign Up</span> <span style={styles.funnelVal}>100%</span>
               </div>
               <div style={{...styles.funnelStep, width: '75%', opacity: 0.85}}>
                 <span>Onboarded</span> <span style={styles.funnelVal}>80%</span>
               </div>
               <div style={{...styles.funnelStep, width: '50%', opacity: 0.7}}>
                 <span>First Match</span> <span style={styles.funnelVal}>40%</span>
               </div>
               <div style={{...styles.funnelStep, width: '25%', opacity: 0.55}}>
                 <span>Premium</span> <span style={styles.funnelVal}>10%</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' },
  title: { margin: 0, fontSize: '1.875rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.025em' },
  dateRange: { backgroundColor: '#1e293b', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', color: '#f8fafc', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, border: '1px solid #334155' },
  dateLabel: { color: '#94a3b8', marginRight: '0.5rem', fontWeight: 400 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' },
  kpiCard: { backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  kpiLabel: { color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
  kpiValue: { fontSize: '2.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
  kpiTrendPositive: { color: '#34d399', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' },
  kpiTrendNegative: { color: '#f87171', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' },
  chartContainer: { backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
  chartTitle: { margin: '0 0 1.5rem 0', fontSize: '1.125rem', color: '#e2e8f0', fontWeight: 600 },
  mockChart: { height: '300px', backgroundColor: '#0f172a', borderRadius: '0.5rem', border: '1px dashed #334155', padding: '1.5rem', position: 'relative' },
  mockChartBarGroup: { display: 'flex', gap: '1rem', width: '100%', height: '100%', alignItems: 'flex-end', justifyContent: 'space-around' },
  barWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', height: '100%', justifyContent: 'flex-end', width: '100%' },
  mockBar: { width: '100%', maxWidth: '48px', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease', backgroundImage: 'linear-gradient(to top, #2563eb, #60a5fa)' },
  barLabel: { color: '#64748b', fontSize: '0.875rem', fontWeight: 500 },
  funnelContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '1rem', height: '100%' },
  funnelStep: { backgroundColor: '#6366f1', color: '#fff', display: 'flex', justifyContent: 'space-between', padding: '0.875rem 1.5rem', borderRadius: '4px', fontSize: '0.9375rem', fontWeight: 500, transition: 'all 0.3s ease', clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)' },
  funnelVal: { fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem' }
};

export default AnalyticsDashboard;
