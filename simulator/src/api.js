import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_BASE = 'http://localhost:5001';

let socket = null;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    window.location.reload();
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  // Auth
  async login(phone, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async register(phone, password) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getMe() {
    return request('/auth/me');
  },

  logout() {
    localStorage.removeItem('token');
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  // Profile
  saveProfile(profileData) {
    return request('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  },

  getProfile(userId) {
    return request(`/profile/${userId}`);
  },

  getDiscover(maxDistance = 10) {
    return request(`/profile/discover?maxDistance=${maxDistance}`);
  },

  // Swipes & Matches
  swipe(targetId, rating) {
    return request('/swipe', {
      method: 'POST',
      body: JSON.stringify({ targetId, rating })
    });
  },

  getMatches() {
    return request('/swipe/matches');
  },

  getMessages(matchId) {
    return request(`/swipe/matches/${matchId}/messages`);
  },

  markMessagesRead(matchId) {
    return request(`/swipe/matches/${matchId}/read`, {
      method: 'POST'
    });
  },

  // Photos
  uploadPhoto(photoData, isPrimary = false) {
    return request('/photos/upload', {
      method: 'POST',
      body: JSON.stringify({ photoData, isPrimary })
    });
  },

  deletePhoto(photoId) {
    return request(`/photos/${photoId}`, {
      method: 'DELETE'
    });
  },

  // Block
  blockUser(blockedId) {
    return request('/block', {
      method: 'POST',
      body: JSON.stringify({ blockedId })
    });
  },

  unblockUser(blockedId) {
    return request(`/block/${blockedId}`, {
      method: 'DELETE'
    });
  },

  getBlocked() {
    return request('/block');
  },

  // WebSocket Manager
  getSocket() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (!socket || !socket.connected) {
      socket = io(SOCKET_BASE, {
        auth: { token },
        transports: ['websocket']
      });

      socket.on('connect_error', (err) => {
        console.warn('Socket connection error:', err.message);
      });
    }

    return socket;
  }
};
