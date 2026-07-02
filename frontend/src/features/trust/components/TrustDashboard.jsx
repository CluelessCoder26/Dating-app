import React from 'react';
import PropTypes from 'prop-types';

const TrustDashboard = ({ trustScore, verifications }) => {
  return (
    <div className="trust-dashboard">
      <h2>Trust & Safety Dashboard</h2>
      <div className="trust-score-card">
        <h3>Your Trust Score</h3>
        <div className="score-display">
          <span className="score-value">{trustScore}</span> / 100
        </div>
        <p className="score-description">
          A high trust score indicates you are a verified and positive member of the community.
        </p>
      </div>

      <div className="verifications-section">
        <h3>Verification Status</h3>
        <ul className="verification-list">
          <li className={`status ${verifications.email ? 'verified' : 'unverified'}`}>
            Email Verification: {verifications.email ? 'Verified' : 'Pending'}
          </li>
          <li className={`status ${verifications.phone ? 'verified' : 'unverified'}`}>
            Phone Verification: {verifications.phone ? 'Verified' : 'Pending'}
          </li>
          <li className={`status ${verifications.photo ? 'verified' : 'unverified'}`}>
            Photo Verification: {verifications.photo ? 'Verified' : 'Pending'}
          </li>
        </ul>
      </div>
    </div>
  );
};

TrustDashboard.propTypes = {
  trustScore: PropTypes.number,
  verifications: PropTypes.shape({
    email: PropTypes.bool,
    phone: PropTypes.bool,
    photo: PropTypes.bool,
  })
};

TrustDashboard.defaultProps = {
  trustScore: 85,
  verifications: {
    email: true,
    phone: false,
    photo: false,
  }
};

export default TrustDashboard;
