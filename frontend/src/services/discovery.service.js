import { api } from '../lib/axios';

















export const discoveryService = {
  getRecommendations: async (filters) => {
    const response = await api.get('/discovery/recommendations', { params: filters });
    return response.data;
  },

  likeProfile: async (profileId) => {
    const response = await api.post(`/interactions/${profileId}/like`);
    return response.data;
  },

  passProfile: async (profileId) => {
    await api.post(`/interactions/${profileId}/pass`);
  }
};