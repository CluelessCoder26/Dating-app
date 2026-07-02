import React from 'react';
import PropTypes from 'prop-types';

const IncidentList = ({ incidents }) => {
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#888';
    }
  };

  return (
    <div className="incident-list-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Ongoing Incidents</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        {incidents.length === 0 ? <p style={{ color: '#4caf50' }}>No active incidents. Systems operational.</p> : incidents.map(inc => (
          <div key={inc.id} style={{ padding: '15px', backgroundColor: '#2d2d44', borderRadius: '6px', borderLeft: `4px solid ${getSeverityColor(inc.severity)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{inc.title}</h3>
              <span style={{ padding: '4px 8px', backgroundColor: getSeverityColor(inc.severity), color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{inc.severity}</span>
            </div>
            <p style={{ margin: '10px 0', color: '#ccc', fontSize: '14px' }}>{inc.description}</p>
            {inc.runbookUrl && (
              <a href={inc.runbookUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#03a9f4', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                View Runbook &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

IncidentList.propTypes = {
  incidents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      severity: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      runbookUrl: PropTypes.string,
    })
  )
};

IncidentList.defaultProps = {
  incidents: [
    { id: 'inc-01', title: 'Redis Cache Latency Spike', severity: 'High', description: 'Cache hit rate dropped below 80%. Investigating connection limits.', runbookUrl: '/runbooks/redis-latency' },
    { id: 'inc-02', title: 'Image Upload Service Degradation', severity: 'Medium', description: 'S3 bucket is returning 503s for some uploads.', runbookUrl: '/runbooks/s3-uploads' },
  ]
};

export default IncidentList;
