// src/services/notificationService.js
import api from './api';

const notificationService = {
    // Get all notifications - GET /api/notifications/notifications/
    getNotifications: async (params = {}) => {
        try {
            const response = await api.get('/notifications/notifications/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },
    
    // Get single notification - GET /api/notifications/notifications/{id}/
    getNotification: async (id) => {
        try {
            const response = await api.get(`/notifications/notifications/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notification:', error);
            throw error;
        }
    },
    
    // Mark notification as read - POST /api/notifications/notifications/{id}/mark-read/
    markAsRead: async (id) => {
        try {
            // console.log(`Marking notification ${id} as read...`);
            const response = await api.post(`/notifications/notifications/${id}/mark-read/`);
            // console.log('Mark as read response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error marking as read:', error);
            if (error.response) {
                console.error('Error response:', error.response.status, error.response.data);
            }
            throw error;
        }
    },
    
    // Mark all notifications as read - POST /api/notifications/mark-all-read/
    markAllAsRead: async () => {
        try {
            const response = await api.post('/notifications/mark-all-read/');
            return response.data;
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    },
    
    // Delete notification - DELETE /api/notifications/notifications/{id}/
    deleteNotification: async (id) => {
        try {
            // console.log(`Deleting notification ${id}...`);
            const response = await api.delete(`/notifications/notifications/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    },
    
    // Get unread count - GET /api/notifications/unread-count/
    getUnreadCount: async () => {
        try {
            const response = await api.get('/notifications/unread-count/');
            return { unread_count: response.data.unread_count || 0 };
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return { unread_count: 0 };
        }
    }
};

export default notificationService;