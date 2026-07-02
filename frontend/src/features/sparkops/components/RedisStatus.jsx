import React from 'react';
import PropTypes from 'prop-types';

const RedisStatus = ({ memoryUsage, connections, cacheHitRate }) => {
  return (
    <div className="redis-status-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Redis Status</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
        <div style={{ flex: 1, minWidth: '150px', backgroundColor: '#2d2d44', padding: '15px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Memory Usage</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{memoryUsage}</p>
        </div>
        <div style={{ flex: 1, minWidth: '150px', backgroundColor: '#2d2d44', padding: '15px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Active Connections</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{connections}</p>
        </div>
        <div style={{ flex: 1, minWidth: '150px', backgroundColor: '#2d2d44', padding: '15px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Cache Hit Rate</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: cacheHitRate > 90 ? '#4caf50' : '#ff9800' }}>{cacheHitRate}%</p>
        </div>
      </div>
    </div>
  );
};

RedisStatus.propTypes = {
  memoryUsage: PropTypes.string,
  connections: PropTypes.number,
  cacheHitRate: PropTypes.number,
};

RedisStatus.defaultProps = {
  memoryUsage: '452 MB',
  connections: 128,
  cacheHitRate: 94.2,
};

export default RedisStatus;
