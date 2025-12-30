import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: This runs BEFORE every request leaves your app
api.interceptors.request.use(
  (config) => {
    // We get the token from localStorage (we will save it there during Login)
    const token = localStorage.getItem('access_token');
    
    // If a token exists, add it to the 'Authorization' header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: This runs AFTER a response comes back
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid (401), we can log the user out
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;