import api from './axios'

export const predictionsApi = {
  create: (data) => api.post('/predictions', data),
  list: (params) => api.get('/predictions', { params }),
  getById: (id) => api.get(`/predictions/${id}`),
  delete: (id) => api.delete(`/predictions/${id}`),
  getDashboard: () => api.get('/analytics/dashboard'),
}

export const adminApi = {
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPredictions: (params) => api.get('/admin/predictions', { params }),
  getSystemStats: () => api.get('/admin/system'),
}