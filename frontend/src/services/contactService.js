import api from './api';

class ContactService {
  getFullImageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${imagePath}`;
  }

  async getAllContactData() {
    try {
      const response = await api.get('/contact/');
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching contact data:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load contact page data'
      };
    }
  }

  async submitContactForm(formData) {
    try {
      const response = await api.post('/contact/submit/', formData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to submit form'
      };
    }
  }
}

export default new ContactService();