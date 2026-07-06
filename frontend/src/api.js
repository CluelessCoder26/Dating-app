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

  // Always parse the body first so we can show real error messages
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // For session-expired 401s on non-auth routes, clear token
    if ((response.status === 401 || response.status === 403) && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
      localStorage.removeItem('token');
    }
    
    let errMsg = data.error || data.message || `Request failed (${response.status})`;
    // Include Zod validation details if present
    if (data.details && Array.isArray(data.details)) {
      errMsg = data.details.map(d => d.message).join(', ');
    }
    
    throw new Error(errMsg);
  }

  return data;
}

export const api = {
  // Auth
  async login(identifier, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async register(phone, email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, email, password })
    });
  },

  async verifyOtp(email, code) {
    const data = await request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getMe() {
    return request('/auth/me');
  },

  async forgotPassword(email) {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(email, code, newPassword) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword })
    });
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

  updateProfile(profileData) {
    return request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  getProfile(userId) {
    return request(`/profile/${userId}`);
  },

  updateLocation(latitude, longitude) {
    return request('/profile/location', {
      method: 'PUT',
      body: JSON.stringify({ latitude, longitude })
    });
  },

  getSettings() {
    return request('/profile/settings');
  },

  updateSettings(settings) {
    return request('/profile/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  getPreferences() {
    return request('/profile/preferences');
  },

  updatePreferences(preferences) {
    return request('/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  },

  getDiscover(maxDistance = 50) {
    return request(`/discovery?maxDistance=${maxDistance}`);
  },

  getDiscoverNext(cursor, maxDistance = 50) {
    const params = new URLSearchParams({ maxDistance });
    if (cursor) params.set('cursor', cursor);
    return request(`/discovery/next?${params}`);
  },

  getDiscoveryPreferences() {
    return request('/discovery/preferences');
  },

  updateDiscoveryPreferences(prefs) {
    return request('/discovery/preferences', {
      method: 'PATCH',
      body: JSON.stringify(prefs)
    });
  },

  // Swipes & Matches (unified interactions API)
  swipe(targetId, action) {
    return request('/interactions/swipe', {
      method: 'POST',
      body: JSON.stringify({ targetId, action })
    });
  },

  undoSwipe(targetId) {
    return request('/interactions/swipe', {
      method: 'POST',
      body: JSON.stringify({ targetId, action: 'REWIND' })
    });
  },

  getMatches() {
    return request('/swipe/matches');
  },

  getLikesReceived(page = 1, pageSize = 20) {
    return request(`/interactions/likes-received?page=${page}&pageSize=${pageSize}`);
  },

  acceptLike(likerId) {
    return request(`/interactions/likes-received/${likerId}/accept`, { method: 'POST' });
  },

  rejectLike(likerId) {
    return request(`/interactions/likes-received/${likerId}/reject`, { method: 'POST' });
  },

  getMessages(matchId) {
    return request(`/swipe/matches/${matchId}/messages`);
  },

  markMessagesRead(matchId) {
    return request(`/swipe/matches/${matchId}/read`, {
      method: 'POST'
    });
  },

  // Photos — uses multipart/form-data to match backend multer middleware
  async uploadPhoto(file, isPrimary = false) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('isPrimary', isPrimary.toString());

    const response = await fetch(`${API_BASE}/photos/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || data.message || `Upload failed (${response.status})`);
    }
    return data;
  },

  getPhotos() {
    return request('/photos');
  },

  deletePhoto(photoId) {
    return request(`/photos/${photoId}`, {
      method: 'DELETE'
    });
  },

  setPrimaryPhoto(photoId) {
    return request('/photos/primary', {
      method: 'PATCH',
      body: JSON.stringify({ photoId })
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

  // Safety & Moderation — uses /trust/report (not /report which 404s)
  reportUser(targetId, reasonCategory, description) {
    return request('/trust/report', {
      method: 'POST',
      body: JSON.stringify({ targetId, targetType: 'USER', reasonCategory, description })
    });
  },

  // Subscriptions & Entitlements
  getSubscriptionPlans() {
    return request('/growth/plans');
  },

  subscribe(planId) {
    return request('/growth/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ planId })
    });
  },

  cancelSubscription(subscriptionId) {
    return request(`/growth/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    });
  },

  getEntitlements() {
    return request('/growth/entitlements');
  },

  // Insights / Stats
  getInteractionStats() {
    return request('/interactions/stats');
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
