import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('deck-auth');
  if (token) {
    const { state } = JSON.parse(token);
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/users', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/users/login', { email, password })
};

export const projectAPI = {
  list: (status = 'active') => api.get('/projects', { params: { status } }),
  create: (title: string, skillId?: string) =>
    api.post('/projects', { title, skillId }),
  get: (id: string) => api.get(`/projects/${id}`)
};

export const sourceAPI = {
  list: (projectId: string) => api.get('/sources', { params: { projectId } }),
  create: (projectId: string, type: string, url?: string, title?: string) =>
    api.post('/sources', { projectId, type, url, title }),
  delete: (id: string) => api.delete(`/sources/${id}`)
};

export default api;
