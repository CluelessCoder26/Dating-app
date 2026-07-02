import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SupportQueue = ({ initialTickets }) => {
  const [tickets, setTickets] = useState(initialTickets);

  const resolveTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  return (
    <div className="support-queue-container" style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px' }}>
      <h2>Support Escalations Queue</h2>
      <div style={{ marginTop: '15px', overflowX: 'auto' }}>
        {tickets.length === 0 ? <p style={{ color: '#4caf50', padding: '15px', backgroundColor: '#2d2d44', borderRadius: '6px' }}>No pending tickets. Great job!</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#252538' }}>
                <th style={{ padding: '15px', borderBottom: '2px solid #444', color: '#aaa' }}>Ticket ID</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #444', color: '#aaa' }}>User</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #444', color: '#aaa' }}>Issue</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #444', color: '#aaa' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid #2d2d44', backgroundColor: '#1e1e2f' }}>
                  <td style={{ padding: '15px', color: '#03a9f4', fontWeight: 'bold' }}>{ticket.id}</td>
                  <td style={{ padding: '15px' }}>{ticket.user}</td>
                  <td style={{ padding: '15px' }}>{ticket.issue}</td>
                  <td style={{ padding: '15px' }}>
                    <button 
                      onClick={() => resolveTicket(ticket.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

SupportQueue.propTypes = {
  initialTickets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      issue: PropTypes.string.isRequired,
    })
  )
};

SupportQueue.defaultProps = {
  initialTickets: [
    { id: 'TKT-9021', user: 'jane_doe99', issue: 'Account banned wrongfully' },
    { id: 'TKT-9022', user: 'mike_smith', issue: 'Payment charged twice for premium' },
    { id: 'TKT-9023', user: 'alex_j', issue: 'Cannot upload profile picture' },
  ]
};

export default SupportQueue;
