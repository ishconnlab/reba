import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  create: (data) => api.post('/users', data),
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const stockInAPI = {
  create: (data) => api.post('/stockin', data),
  getAll: (params) => api.get('/stockin', { params }),
  getById: (id) => api.get(`/stockin/${id}`),
  update: (id, data) => api.put(`/stockin/${id}`, data),
  delete: (id) => api.delete(`/stockin/${id}`),
};

export const stockOutAPI = {
  create: (data) => api.post('/stockout', data),
  getAll: (params) => api.get('/stockout', { params }),
  getById: (id) => api.get(`/stockout/${id}`),
  update: (id, data) => api.put(`/stockout/${id}`, data),
  delete: (id) => api.delete(`/stockout/${id}`),
};

export const reportAPI = {
  dailyStockStatus: () => api.get('/reports/daily-stock-status'),
  dateRange: (params) => api.get('/reports/date-range', { params }),
};

export default api;
