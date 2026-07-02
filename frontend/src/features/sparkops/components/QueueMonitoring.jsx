import React from 'react';
import PropTypes from 'prop-types';

const QueueMonitoring = ({ queues }) => {
  return (
    <div className="queue-monitoring-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Queue Monitoring (BullMQ)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
        {queues.map(q => (
          <div key={q.name} style={{ backgroundColor: '#2d2d44', padding: '15px', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{q.name}</h3>
            <p><strong>Pending:</strong> {q.pending}</p>
            <p><strong>Running:</strong> {q.running}</p>
            <p><strong>Completed:</strong> {q.completed}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

QueueMonitoring.propTypes = {
  queues: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      pending: PropTypes.number.isRequired,
      running: PropTypes.number.isRequired,
      completed: PropTypes.number.isRequired,
    })
  )
};

QueueMonitoring.defaultProps = {
  queues: [
    { name: 'Email Queue', pending: 12, running: 3, completed: 15420 },
    { name: 'Match Processing', pending: 45, running: 10, completed: 89030 },
  ]
};

export default QueueMonitoring;
