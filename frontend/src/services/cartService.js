// cartService.js
import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart/');
    return response.data;
  },

  async addToCart(data) {
    const response = await api.post('/cart/add_item/', data);
    return response.data;
  },

  async updateCartItem(data) {
    const response = await api.patch('/cart/update_item/', data);
    return response.data;
  },

  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/remove_item/?item_id=${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear/');
    return response.data;
  },

  // NEW: Apply coupon to cart
  async applyCoupon(code) {
    const response = await api.post('/cart/apply-coupon/', { code });
    return response.data;
  },

  // NEW: Remove coupon from cart
  async removeCoupon() {
    const response = await api.post('/cart/remove-coupon/');
    return response.data;
  },

  // NEW: Validate coupon without applying
  async validateCoupon(code) {
    const response = await api.post('/cart/validate-coupon/', { code });
    return response.data;
  },
  // Add to your cartService.js

async getStoreSettings() {
  const response = await api.get('/cart/settings/');
  return response.data;
},
};