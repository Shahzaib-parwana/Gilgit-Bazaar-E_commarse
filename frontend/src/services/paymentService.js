import api from './api';

export const paymentService = {
  async createStripeIntent(orderId) {
    const response = await api.post('/payments/stripe/create-intent/', {
      order_id: orderId,
    });
    return response.data;
  },

  async processCOD(orderId) {
    const response = await api.post('/payments/cod/', {
      order_id: orderId,
    });
    return response.data;
  },
  // Make sure processCOD is properly implemented
async processCOD(orderId) {
  // This might just return the order or update status
  const response = await api.post(`/orders/${orderId}/process-cod/`);
  return response.data;
},
};