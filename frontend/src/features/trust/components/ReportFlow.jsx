import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReportFlow = ({ targetUserId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [evidence, setEvidence] = useState('');

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to report
    onComplete({ targetUserId, category, evidence });
    setStep(4);
  };

  return (
    <div className="report-flow-wizard">
      <h2>Report User</h2>
      {step === 1 && (
        <div className="step-1">
          <h3>Step 1: Select Category</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a reason</option>
            <option value="spam">Spam or Scam</option>
            <option value="harassment">Harassment</option>
            <option value="inappropriate">Inappropriate Content</option>
            <option value="fake_profile">Fake Profile</option>
          </select>
          <button onClick={handleNext} disabled={!category}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="step-2">
          <h3>Step 2: Provide Evidence</h3>
          <textarea 
            placeholder="Please provide details or links to evidence..."
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={5}
          />
          <div className="actions">
            <button onClick={handleBack}>Back</button>
            <button onClick={handleNext} disabled={!evidence}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-3">
          <h3>Step 3: Confirmation</h3>
          <p>You are reporting a user for: <strong>{category}</strong></p>
          <p>Evidence provided:</p>
          <blockquote>{evidence}</blockquote>
          <div className="actions">
            <button onClick={handleBack}>Back</button>
            <button onClick={handleSubmit} className="danger">Submit Report</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step-4 success">
          <h3>Report Submitted</h3>
          <p>Thank you for keeping our community safe. Our moderation team will review this shortly.</p>
          <p>You can track the status of this report in your appeals/reports dashboard.</p>
        </div>
      )}
    </div>
  );
};

ReportFlow.propTypes = {
  targetUserId: PropTypes.string.isRequired,
  onComplete: PropTypes.func
};

ReportFlow.defaultProps = {
  onComplete: () => {}
};

export default ReportFlow;
