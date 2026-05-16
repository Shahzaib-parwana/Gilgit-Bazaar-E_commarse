import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    // Don't store token immediately - wait for verification
    if (response.data.requires_verification) {
      // Store email temporarily for verification
      sessionStorage.setItem('pending_verification_email', response.data.email);
    }
    return response.data;
  },

  async verifyEmail(email, verificationCode) {
    const response = await api.post('/auth/verify-email/', {
      email: email,
      verification_code: verificationCode
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      sessionStorage.removeItem('pending_verification_email');
    }
    return response.data;
  },

  async resendVerificationCode(email) {
    const response = await api.post('/auth/resend-verification/', { email });
    return response.data;
  },

  async googleLogin(idToken) {
    const response = await api.post('/auth/google-login/', { id_token: idToken });
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
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
  
  getPendingVerificationEmail() {
    return sessionStorage.getItem('pending_verification_email');
  },
  
  clearPendingVerification() {
    sessionStorage.removeItem('pending_verification_email');
  }
};