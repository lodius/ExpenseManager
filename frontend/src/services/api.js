import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Expense endpoints
export const expensesAPI = {
  create: (data) => axiosInstance.post('/expenses', data),
  getAll: (skip = 0, limit = 100, filters = {}) =>
    axiosInstance.get('/expenses', { params: { skip, limit, ...filters } }),
  getById: (id) => axiosInstance.get(`/expenses/${id}`),
  update: (id, data) => axiosInstance.put(`/expenses/${id}`, data),
  delete: (id) => axiosInstance.delete(`/expenses/${id}`),
};

// Reports endpoints
export const reportsAPI = {
  getSummary: () => axiosInstance.get('/expenses/reports/summary'),
  getDaily: (days = 30) => axiosInstance.get('/expenses/reports/daily', { params: { days } }),
  getByCategory: () => axiosInstance.get('/expenses/reports/category'),
};

// Categories endpoints
export const categoriesAPI = {
  getAll: (skip = 0, limit = 100) =>
    axiosInstance.get('/categories', { params: { skip, limit } }),
  create: (data) => axiosInstance.post('/categories', data),
  update: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  delete: (id) => axiosInstance.delete(`/categories/${id}`),
};

// Settings endpoints
export const settingsAPI = {
  getAll: () => axiosInstance.get('/settings'),
  getById: (id) => axiosInstance.get(`/settings/${id}`),
  update: (id, data) => axiosInstance.put(`/settings/${id}`, data),
};

// Sync endpoints
export const syncAPI = {
  fetchEmails: () => axiosInstance.post('/sync/fetch-emails'),
};

export default axiosInstance;
