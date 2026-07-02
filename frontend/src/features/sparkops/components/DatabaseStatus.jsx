import React from 'react';
import PropTypes from 'prop-types';

const DatabaseStatus = ({ poolSize, activeConnections, queryLatency, indexHealth }) => {
  return (
    <div className="database-status-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Database Health</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0 0 0' }}>
        <li style={{ padding: '12px', borderBottom: '1px solid #2d2d44', display: 'flex', justifyContent: 'space-between', backgroundColor: '#252538' }}>
          <span style={{ color: '#ccc' }}>Connection Pool</span>
          <span style={{ fontWeight: 'bold' }}>{activeConnections} / {poolSize} active</span>
        </li>
        <li style={{ padding: '12px', borderBottom: '1px solid #2d2d44', display: 'flex', justifyContent: 'space-between', backgroundColor: '#252538' }}>
          <span style={{ color: '#ccc' }}>Avg Query Latency</span>
          <span style={{ fontWeight: 'bold' }}>{queryLatency} ms</span>
        </li>
        <li style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#252538' }}>
          <span style={{ color: '#ccc' }}>Index Health</span>
          <span style={{ fontWeight: 'bold', color: indexHealth === 'Optimal' ? '#4caf50' : '#ff9800' }}>{indexHealth}</span>
        </li>
      </ul>
    </div>
  );
};

DatabaseStatus.propTypes = {
  poolSize: PropTypes.number,
  activeConnections: PropTypes.number,
  queryLatency: PropTypes.number,
  indexHealth: PropTypes.string,
};

DatabaseStatus.defaultProps = {
  poolSize: 100,
  activeConnections: 42,
  queryLatency: 12.4,
  indexHealth: 'Optimal',
};

export default DatabaseStatus;
