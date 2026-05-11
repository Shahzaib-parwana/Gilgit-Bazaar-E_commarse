// src/services/wishlistService.js
import api from './api';

const wishlistService = {
    // Get user's wishlist
    getWishlist: async () => {
        try {
            const response = await api.get('/wishlist/wishlist/');
            return response.data;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;
        }
    },

    // Add item to wishlist
    addToWishlist: async (productId, variantId = null) => {
        try {
            const response = await api.post('/wishlist/wishlist/add/', {
                product_id: productId,
                variant_id: variantId
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },

    // Remove item from wishlist
    removeFromWishlist: async (itemId) => {
        try {
            const response = await api.delete(`/wishlist/wishlist/remove/${itemId}/`);
            return response.data;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    },

    // Clear entire wishlist
    clearWishlist: async () => {
        try {
            const response = await api.delete('/wishlist/wishlist/clear/');
            return response.data;
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        }
    },

    // Move item to cart
    moveToCart: async (itemId) => {
        try {
            const response = await api.post(`/wishlist/wishlist/move-to-cart/${itemId}/`);
            return response.data;
        } catch (error) {
            console.error('Error moving to cart:', error);
            throw error;
        }
    }
};

export default wishlistService;