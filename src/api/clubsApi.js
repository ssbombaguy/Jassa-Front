import apiClient from './client';

// Clubs endpoints
export const getClubs = (params = {}) => {
  return apiClient.get('/clubs', { params });
};

export const getClubById = (id) => {
  return apiClient.get(`/clubs/${id}`);
};

export const getClubJerseys = (id, params = {}) => {
  return apiClient.get(`/clubs/${id}/jerseys`, { params });
};

export default {
  getClubs,
  getClubById,
  getClubJerseys,
};
