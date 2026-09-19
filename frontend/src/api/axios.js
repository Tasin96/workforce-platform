import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('wf_user');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    localStorage.removeItem('wf_user');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || '';
      if (msg.includes('token failed') || msg.includes('no token') || msg.includes('not authorized')) {
        try {
          localStorage.removeItem('wf_user');
        } catch (e) {}
      }
    }
    return Promise.reject(error);
  }
);

export default api;
