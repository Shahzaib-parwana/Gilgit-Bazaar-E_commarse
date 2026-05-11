import api from './api';

export const orderService = {
  async createOrder(orderData) {
    try {
      // console.log('Sending order to backend:', orderData);
      const response = await api.post('/orders/', orderData);
      // console.log('Order created response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error.response?.data || error.message);
      throw error;
    }
  },

  async getOrders() {
    const response = await api.get('/orders/');
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  async cancelOrder(id) {
    const response = await api.post(`/orders/${id}/cancel/`);
    return response.data;
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/${orderId}/update_status/`, { status });
      return response.data;
    } catch (error) {
      console.error('Status update error:', error.response?.data || error.message);
      throw error;
    }
  },
};