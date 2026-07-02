import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FeatureFlags = ({ initialFlags }) => {
  const [flags, setFlags] = useState(initialFlags);

  const toggleFlag = (key) => {
    setFlags(flags.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="feature-flags-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Feature Flags & Kill Switches</h2>
      <div style={{ marginTop: '15px' }}>
        {flags.map(flag => (
          <div key={flag.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#2d2d44', marginBottom: '10px', borderRadius: '6px' }}>
            <div>
              <strong style={{ fontSize: '16px' }}>{flag.name}</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#aaa' }}>{flag.description}</p>
            </div>
            <button 
              onClick={() => toggleFlag(flag.key)}
              style={{
                backgroundColor: flag.enabled ? '#4caf50' : '#f44336',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '100px'
              }}
            >
              {flag.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

FeatureFlags.propTypes = {
  initialFlags: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired,
    })
  )
};

FeatureFlags.defaultProps = {
  initialFlags: [
    { key: 'new_matching_algo', name: 'New Matching Algorithm', description: 'Enable v2 of the matching algorithm for 5% of users.', enabled: true },
    { key: 'kill_switch_payments', name: 'Emergency: Disable Payments', description: 'Instantly disable all payment processing. Use only during active incidents.', enabled: false },
  ]
};

export default FeatureFlags;
