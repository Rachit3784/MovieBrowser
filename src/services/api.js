import axios from 'axios';
import { TMDB_CONFIG } from '../constants/endpoints';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: TMDB_CONFIG.baseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add API key to every request
api.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      api_key: TMDB_CONFIG.apiKey,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('TMDB API Error:', {
      url: error?.config?.url,
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      responseData: error?.response?.data,
    });
    const status = error?.response?.status;
    const message = error?.response?.data?.status_message || error?.message || 'An error occurred';

    if (status === 401) {
      return Promise.reject(new Error('Invalid API key. Please check your TMDB configuration.'));
    }
    if (status === 404) {
      return Promise.reject(new Error('Content not found.'));
    }
    if (status === 429) {
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }
    if (error?.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please check your internet connection.'));
    }
    if (error?.message === 'Network Error') {
      return Promise.reject(new Error('No internet connection. Please try again.'));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
