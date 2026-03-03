import apiClient from './client';

// Jerseys endpoints (Full CRUD)
export const getJerseys = (params = {}) => {
  return apiClient.get('/jerseys', { params });
};

export const getJerseyById = (id) => {
  return apiClient.get(`/jerseys/${id}`);
};

export const createJersey = (data) => {
  return apiClient.post('/jerseys', data);
};

export const updateJersey = (id, data) => {
  return apiClient.put(`/jerseys/${id}`, data);
};

export const deleteJersey = (id) => {
  return apiClient.delete(`/jerseys/${id}`);
};

export default {
  getJerseys,
  getJerseyById,
  createJersey,
  updateJersey,
  deleteJersey,
};
