import React from 'react';
import PropTypes from 'prop-types';

const AccountExperience = ({ userEmail }) => {
  const handleExportData = () => {
    // Trigger data export workflow
    alert('Data export initiated. You will receive an email shortly.');
  };

  return (
    <div className="account-experience-settings">
      <h2>Account & Security</h2>

      <section className="settings-section privacy">
        <h3>Privacy Settings</h3>
        <label>
          <input type="checkbox" defaultChecked /> Show online status
        </label>
        <label>
          <input type="checkbox" defaultChecked /> Allow profile in search engines
        </label>
      </section>

      <section className="settings-section security">
        <h3>Security</h3>
        <div className="email-display">
          <span>Primary Email: {userEmail}</span>
          <button className="change-email-btn">Change</button>
        </div>
        <button className="password-reset-btn">Change Password</button>
      </section>

      <section className="settings-section sessions">
        <h3>Active Sessions</h3>
        <ul className="device-list">
          <li>
            <strong>Current Device</strong> - Windows PC (Chrome)
          </li>
          <li>
            <strong>Mobile App</strong> - iPhone 13 (Last active: 2 hours ago)
            <button className="revoke-btn">Revoke Access</button>
          </li>
        </ul>
      </section>

      <section className="settings-section data-export">
        <h3>Your Data</h3>
        <p>Download a copy of your data including matches, messages, and profile info.</p>
        <button onClick={handleExportData} className="export-btn">Request Data Export</button>
      </section>
    </div>
  );
};

AccountExperience.propTypes = {
  userEmail: PropTypes.string
};

AccountExperience.defaultProps = {
  userEmail: 'user@example.com'
};

export default AccountExperience;
