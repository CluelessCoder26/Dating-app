import React, { useState } from 'react';

const NotificationBroadcast = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('push');
  
  const handleBroadcast = (e) => {
    e.preventDefault();
    alert(`Broadcast scheduled via ${channel}:\n\nTitle: ${title}\nMessage: ${message}`);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="notification-broadcast-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Global Notification Broadcast</h2>
      <p style={{ color: '#aaa', fontSize: '14px' }}>Schedule push, email, or in-app announcements for all users.</p>
      
      <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Broadcast Channel</label>
          <select 
            value={channel} 
            onChange={(e) => setChannel(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '4px', backgroundColor: '#2d2d44', color: '#fff', border: '1px solid #444', outline: 'none' }}
          >
            <option value="push">Push Notification</option>
            <option value="email">Email Blast</option>
            <option value="in_app">In-App Banner</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Scheduled Maintenance"
            required
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '4px', backgroundColor: '#2d2d44', color: '#fff', border: '1px solid #444', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Message</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the broadcast message here..."
            required
            rows="5"
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '4px', backgroundColor: '#2d2d44', color: '#fff', border: '1px solid #444', outline: 'none', resize: 'vertical' }}
          />
        </div>
        <button type="submit" style={{ padding: '12px', backgroundColor: '#03a9f4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', fontSize: '16px' }}>
          Schedule Broadcast
        </button>
      </form>
    </div>
  );
};

export default NotificationBroadcast;
