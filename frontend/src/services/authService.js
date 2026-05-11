import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout/');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch('/auth/profile/', data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async changePassword(data) {
    const response = await api.post('/auth/change-password/', data);
    return response.data;
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};