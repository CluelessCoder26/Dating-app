import React from 'react';
import PropTypes from 'prop-types';

const ServerError = ({ onRetry, error }) => {
  return (
    <div className="error-screen" style={styles.container}>
      <h1 style={styles.title}>500</h1>
      <h2 style={styles.subtitle}>Something went wrong</h2>
      <p style={styles.text}>
        We are experiencing some technical difficulties. Please try again.
      </p>
      {error && (
        <details style={styles.details}>
          <summary>Error Details</summary>
          <pre style={styles.pre}>{error.toString()}</pre>
        </details>
      )}
      <button style={styles.button} onClick={onRetry || (() => window.location.reload())}>
        Try Again
      </button>
    </div>
  );
};

ServerError.propTypes = {
  onRetry: PropTypes.func,
  error: PropTypes.object
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: 'var(--bg-primary, #ffffff)',
    color: 'var(--text-primary, #333333)',
  },
  title: {
    fontSize: '6rem',
    margin: '0',
    color: 'var(--error-color, #dc3545)',
  },
  subtitle: {
    fontSize: '2rem',
    marginTop: '1rem',
  },
  text: {
    fontSize: '1rem',
    color: 'var(--text-secondary, #666666)',
    maxWidth: '400px',
    marginBottom: '2rem',
  },
  details: {
    marginBottom: '2rem',
    textAlign: 'left',
    maxWidth: '80%',
    backgroundColor: 'var(--bg-secondary, #f8f9fa)',
    padding: '1rem',
    borderRadius: '8px',
  },
  pre: {
    whiteSpace: 'pre-wrap',
    fontSize: '0.875rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: 'var(--primary-color, #ff4b4b)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default ServerError;
