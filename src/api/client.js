import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.data);
    return response.data; // Return only the data object
  },
  (error) => {
    if (!error.response) {
      const networkError = {
        success: false,
        code: error.code || 'ERR_NETWORK',
        error: `Cannot connect to backend API at ${API_BASE_URL}. Make sure backend server is running and CORS allows this origin.`,
        details: error.message,
      };
      console.error('[API Error]', networkError);
      return Promise.reject(networkError);
    }

    console.error('[API Error]', error.response.data || error.message);
    return Promise.reject(error.response.data || { success: false, error: error.message });
  }
);

export default apiClient;
