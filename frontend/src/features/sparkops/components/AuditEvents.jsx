import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AuditEvents = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(e => 
    e.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="audit-events-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Audit Events</h2>
      <input 
        type="text" 
        placeholder="Search events by action or admin..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', padding: '12px', marginTop: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2d2d44', color: '#fff' }}
      />
      <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#252538', borderRadius: '6px' }}>
        {filteredEvents.map(evt => (
          <div key={evt.id} style={{ padding: '12px 15px', borderBottom: '1px solid #2d2d44' }}>
            <span style={{ color: '#aaa', fontSize: '12px' }}>{new Date(evt.timestamp).toLocaleString()}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
              <strong style={{ color: '#03a9f4' }}>{evt.admin}</strong>
              <span style={{ fontWeight: '500' }}>{evt.action}</span>
            </div>
            {evt.details && <p style={{ fontSize: '13px', color: '#888', margin: '5px 0 0 0' }}>{evt.details}</p>}
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <p style={{ padding: '15px', textAlign: 'center', color: '#aaa' }}>No events found.</p>
        )}
      </div>
    </div>
  );
};

AuditEvents.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      admin: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      details: PropTypes.string,
    })
  )
};

AuditEvents.defaultProps = {
  events: [
    { id: '1', timestamp: '2026-07-02T10:00:00Z', admin: 'sysadmin', action: 'Toggled Feature Flag', details: 'Disabled payments kill switch' },
    { id: '2', timestamp: '2026-07-02T09:30:00Z', admin: 'moderator_01', action: 'Banned User', details: 'User ID: 938472 for ToS violation' },
    { id: '3', timestamp: '2026-07-02T08:15:00Z', admin: 'sysadmin', action: 'Cleared Cache', details: 'Redis sessions cache cleared' },
  ]
};

export default AuditEvents;
