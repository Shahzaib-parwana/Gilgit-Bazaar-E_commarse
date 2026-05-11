// services/reviewService.js
import api from './api';

const reviewService = {
    /**
     * Helper function to get full image URL
     */
    getFullImageUrl: (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;

        // Use the origin (http://localhost:8000) instead of the api baseURL
        // This ensures we don't accidentally include '/api/v1' in the image path
        const backendServer = api.defaults.baseURL.split('/api')[0]; 
        
        const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${backendServer}${cleanImagePath}`;
    },

    /**
     * Helper function to process review images
     */
    processReviewImages: (review) => {
        if (!review) return review;
        
        // Process images array
        if (review.images && Array.isArray(review.images)) {
            review.images = review.images.map(img => reviewService.getFullImageUrl(img));
        }
        
        // Process user avatar if exists
        if (review.user_avatar) {
            review.user_avatar = reviewService.getFullImageUrl(review.user_avatar);
        }
        
        // Some APIs might store images differently
        if (review.review_images && Array.isArray(review.review_images)) {
            review.review_images = review.review_images.map(img => reviewService.getFullImageUrl(img));
        }
        
        return review;
    },

    /**
     * Get reviews for a product with pagination
     */
    getProductReviews: async (productId, params = {}) => {
        const queryParams = new URLSearchParams({
            product: productId,
            page: params.page || 1,
            page_size: params.pageSize || 10,
            ...(params.rating && { rating: params.rating }),
            ...(params.ordering && { ordering: params.ordering })
        });
        const response = await api.get(`/reviews/?${queryParams}`);
        
        // Process images in response
        if (response.data) {
            if (response.data.results && Array.isArray(response.data.results)) {
                response.data.results = response.data.results.map(review => 
                    reviewService.processReviewImages(review)
                );
            } else if (Array.isArray(response.data)) {
                response.data = response.data.map(review => 
                    reviewService.processReviewImages(review)
                );
            }
        }
        
        return response.data;
    },

    /**
     * Get all reviews across products (for home page)
     */
    getAllReviews: async (params = {}) => {
        const queryParams = new URLSearchParams({
            page: params.page || 1,
            page_size: params.pageSize || 20,
            ordering: params.ordering || '-rating',
            min_rating: params.minRating || 4,
            ...(params.is_approved && { is_approved: params.is_approved })
        });
        const response = await api.get(`/reviews/all/?${queryParams}`);
        
        // Process images in response
        if (response.data) {
            if (response.data.results && Array.isArray(response.data.results)) {
                response.data.results = response.data.results.map(review => 
                    reviewService.processReviewImages(review)
                );
            } else if (Array.isArray(response.data)) {
                response.data = response.data.map(review => 
                    reviewService.processReviewImages(review)
                );
            }
        }
        
        return response.data;
    },

    /**
     * Get review statistics for a product
     */
    getReviewStats: async (productId) => {
        const response = await api.get(`/reviews/product/${productId}/stats/`);
        return response.data;
    },

    /**
     * Create a new review
     */
    createReview: async (reviewData) => {
        const response = await api.post(`/reviews/`, reviewData);
        return response.data;
    },

    /**
     * Update a review
     */
    updateReview: async (reviewId, reviewData) => {
        const response = await api.patch(`/reviews/${reviewId}/`, reviewData);
        return response.data;
    },

    /**
     * Delete a review
     */
    deleteReview: async (reviewId) => {
        const response = await api.delete(`/reviews/${reviewId}/`);
        return response.data;
    },

    /**
     * Mark review as helpful/unhelpful
     */
    toggleHelpful: async (reviewId) => {
        const response = await api.post(`/reviews/${reviewId}/helpful/`);
        return response.data;
    },

    /**
     * Get user's reviews
     */
    getUserReviews: async (page = 1) => {
        const response = await api.get(`/reviews/my-reviews/?page=${page}`);
        
        // Process images in response
        if (response.data) {
            if (response.data.results && Array.isArray(response.data.results)) {
                response.data.results = response.data.results.map(review => 
                    reviewService.processReviewImages(review)
                );
            } else if (Array.isArray(response.data)) {
                response.data = response.data.map(review => 
                    reviewService.processReviewImages(review)
                );
            }
        }
        
        return response.data;
    },

    /**
     * Check if user can review a product
     */
    canReviewProduct: async (productId) => {
        const response = await api.get(`/reviews/can_review/?product=${productId}`);
        return response.data;
    },

    /**
     * Upload review images
     */
    uploadReviewImages: async (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        const response = await api.post('/reviews/upload_images/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Process uploaded image URLs
        if (response.data && response.data.urls && Array.isArray(response.data.urls)) {
            response.data.urls = response.data.urls.map(url => 
                reviewService.getFullImageUrl(url)
            );
        }
        
        return response.data;
    }
};

export default reviewService;