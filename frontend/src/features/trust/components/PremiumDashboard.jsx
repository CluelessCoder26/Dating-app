import React from 'react';
import PropTypes from 'prop-types';

const PremiumDashboard = ({ currentPlan, onUpgrade }) => {
  return (
    <div className="premium-dashboard">
      <h2>Premium Subscription</h2>
      
      <div className="current-entitlement">
        <h3>Current Plan: {currentPlan === 'premium' ? 'Premium' : 'Free Tier'}</h3>
        {currentPlan === 'free' && (
          <p>Upgrade to Premium to unlock exclusive features and get more matches!</p>
        )}
      </div>

      <div className="plans-comparison">
        <div className="plan-card free">
          <h4>Free</h4>
          <ul>
            <li>Basic matching</li>
            <li>Limited daily swipes</li>
            <li>1 photo upload</li>
          </ul>
        </div>

        <div className="plan-card premium">
          <h4>Premium</h4>
          <ul>
            <li>Unlimited daily swipes</li>
            <li>See who liked you</li>
            <li>Advanced filters</li>
            <li>Priority profile visibility</li>
          </ul>
          {currentPlan !== 'premium' && (
            <button onClick={() => onUpgrade('premium')} className="upgrade-btn">
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

PremiumDashboard.propTypes = {
  currentPlan: PropTypes.oneOf(['free', 'premium']),
  onUpgrade: PropTypes.func
};

PremiumDashboard.defaultProps = {
  currentPlan: 'free',
  onUpgrade: () => {}
};

export default PremiumDashboard;
