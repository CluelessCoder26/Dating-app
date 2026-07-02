import React, { useState } from 'react';

const mockUsers = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', status: 'Active', joined: '2026-01-15' },
  { id: '2', name: 'Bob Jones', email: 'bob@example.com', status: 'Suspended', joined: '2026-03-22' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', status: 'Active', joined: '2026-05-10' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', status: 'Active', joined: '2026-06-01' },
];

const UserDirectory = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>User Directory</h1>
        <div style={styles.actions}>
          <input 
            type="text" 
            placeholder="Search users..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={styles.btnPrimary}>Export CSV</button>
        </div>
      </header>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={styles.avatar}>{user.name.charAt(0)}</div>
                    {user.name}
                  </div>
                </td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.joined}</td>
                <td style={styles.td}>
                  <span style={user.status === 'Active' ? styles.statusActive : styles.statusSuspended}>
                    {user.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button 
                    style={user.status === 'Active' ? styles.btnSuspend : styles.btnRestore}
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.status === 'Active' ? 'Suspend' : 'Restore'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { margin: 0, fontSize: '1.875rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.025em' },
  actions: { display: 'flex', gap: '1rem' },
  searchInput: { padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f8fafc', outline: 'none', width: '300px', fontSize: '0.875rem', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' },
  btnPrimary: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)' },
  tableContainer: { backgroundColor: '#1e293b', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '1.25rem 1.5rem', backgroundColor: '#0f172a', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #334155' },
  tr: { borderBottom: '1px solid #334155', transition: 'background-color 0.2s' },
  td: { padding: '1rem 1.5rem', color: '#e2e8f0', fontSize: '0.9375rem', verticalAlign: 'middle' },
  userCell: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: '#fff', fontWeight: 600 },
  statusActive: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' },
  statusSuspended: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.3)' },
  btnSuspend: { backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' },
  btnRestore: { backgroundColor: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' },
};

export default UserDirectory;
