import apiClient from './client';

// Leagues endpoints
export const getLeagues = (params = {}) => {
  return apiClient.get('/leagues', { params });
};

export const getLeagueById = (id) => {
  return apiClient.get(`/leagues/${id}`);
};

export const getLeagueClubs = (id, params = {}) => {
  return apiClient.get(`/leagues/${id}/clubs`, { params });
};

export const getLeagueJerseys = (id, params = {}) => {
  return apiClient.get(`/leagues/${id}/jerseys`, { params });
};

export default {
  getLeagues,
  getLeagueById,
  getLeagueClubs,
  getLeagueJerseys,
};
