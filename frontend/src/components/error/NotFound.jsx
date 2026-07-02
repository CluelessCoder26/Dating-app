import React from 'react';

const NotFound = () => {
  return (
    <div className="error-screen" style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Page Not Found</h2>
      <p style={styles.text}>The page you are looking for doesn't exist or has been moved.</p>
      <button style={styles.button} onClick={() => window.location.href = '/'}>
        Go to Home
      </button>
    </div>
  );
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
    color: 'var(--primary-color, #ff4b4b)',
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
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: 'var(--primary-color, #ff4b4b)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'opacity 0.2s',
  }
};

export default NotFound;
