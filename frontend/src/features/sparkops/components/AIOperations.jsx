import React from 'react';

const AIOperations = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>AI Operations Center</h1>
        <div style={styles.statusLive}>
          <span style={styles.pulse}></span> AI Core Online
        </div>
      </header>

      <div style={styles.topMetrics}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Total Inference Cost (24h)</div>
          <div style={styles.metricValue}>$428.50</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Global Token Usage (24h)</div>
          <div style={styles.metricValue}>12.4M</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>System Average Latency</div>
          <div style={styles.metricValue}>420<span style={styles.metricUnit}>ms</span></div>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Provider Status</h2>
      <div style={styles.providersGrid}>
        <div style={styles.providerCard}>
          <div style={styles.providerHeader}>
            <div>
              <h3 style={styles.providerName}>OpenAI (GPT-4o)</h3>
              <div style={styles.providerRole}>Primary Reasoning Engine</div>
            </div>
            <span style={styles.badgeHealthy}>Optimal</span>
          </div>
          <div style={styles.providerDetails}>
            <div style={styles.detailRow}><span>24h Usage:</span> <span style={styles.detailVal}>8.2M tokens</span></div>
            <div style={styles.detailRow}><span>P95 Latency:</span> <span style={styles.detailVal}>350ms</span></div>
            <div style={styles.detailRow}><span>Error Rate:</span> <span style={styles.detailVal}>0.02%</span></div>
          </div>
          <div style={styles.providerFooter}>
            <div style={styles.costBadge}>Cost: $124.00</div>
          </div>
        </div>

        <div style={styles.providerCard}>
          <div style={styles.providerHeader}>
            <div>
              <h3 style={styles.providerName}>Anthropic (Claude-3.5)</h3>
              <div style={styles.providerRole}>Moderation & Safety</div>
            </div>
            <span style={styles.badgeHealthy}>Optimal</span>
          </div>
          <div style={styles.providerDetails}>
            <div style={styles.detailRow}><span>24h Usage:</span> <span style={styles.detailVal}>3.1M tokens</span></div>
            <div style={styles.detailRow}><span>P95 Latency:</span> <span style={styles.detailVal}>410ms</span></div>
            <div style={styles.detailRow}><span>Error Rate:</span> <span style={styles.detailVal}>0.05%</span></div>
          </div>
          <div style={styles.providerFooter}>
            <div style={styles.costBadge}>Cost: $46.50</div>
          </div>
        </div>

        <div style={styles.providerCard}>
          <div style={styles.providerHeader}>
            <div>
              <h3 style={styles.providerName}>Google (Gemini Pro)</h3>
              <div style={styles.providerRole}>Analytics & Insights</div>
            </div>
            <span style={styles.badgeWarning}>Degraded</span>
          </div>
          <div style={styles.providerDetails}>
            <div style={styles.detailRow}><span>24h Usage:</span> <span style={styles.detailVal}>1.1M tokens</span></div>
            <div style={styles.detailRow}><span>P95 Latency:</span> <span style={styles.warningText}>1250ms</span></div>
            <div style={styles.detailRow}><span>Error Rate:</span> <span style={styles.warningText}>1.2%</span></div>
          </div>
          <div style={styles.providerFooter}>
             <div style={styles.costBadge}>Cost: $8.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' },
  title: { margin: 0, fontSize: '1.875rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.025em' },
  statusLive: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1.25rem', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' },
  pulse: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981, 0 0 20px #10b981' },
  topMetrics: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  metricCard: { backgroundColor: '#1e293b', padding: '1.75rem', borderRadius: '1rem', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  metricLabel: { color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
  metricValue: { fontSize: '2.5rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.025em' },
  metricUnit: { fontSize: '1.25rem', color: '#64748b', marginLeft: '0.25rem', fontWeight: 500 },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '1.5rem' },
  providersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' },
  providerCard: { backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' },
  providerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  providerName: { margin: '0 0 0.25rem 0', fontSize: '1.125rem', color: '#f8fafc', fontWeight: 600 },
  providerRole: { color: '#64748b', fontSize: '0.875rem' },
  badgeHealthy: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' },
  badgeWarning: { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.3)' },
  providerDetails: { display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 },
  detailRow: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9375rem', borderBottom: '1px dashed #334155', paddingBottom: '0.5rem' },
  detailVal: { color: '#e2e8f0', fontWeight: 500 },
  warningText: { color: '#fbbf24', fontWeight: 600 },
  providerFooter: { paddingTop: '1rem', borderTop: '1px solid #334155' },
  costBadge: { display: 'inline-block', backgroundColor: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1', border: '1px solid #334155', fontWeight: 500 }
};

export default AIOperations;
