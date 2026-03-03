import axios from 'axios';

// Backend API – mock data used only when network fails (connection refused, etc.)
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('[API Error]', err.response?.data || err.message);
    return Promise.reject(err.response?.data || err);
  }
);

export const getJerseys = (params = {}) => api.get('/jerseys', { params });
export const getJersey = (id) => api.get(`/jerseys/${id}`);
export const getProducts = (params = {}) => api.get('/products', { params });
export const getLeagues = (params = {}) => api.get('/leagues', { params });
export const getLeague = (id) => api.get(`/leagues/${id}`);
export const getClubs = (params = {}) => api.get('/clubs', { params });
export const getClubJerseys = (clubId, params = {}) => api.get(`/clubs/${clubId}/jerseys`, { params });
