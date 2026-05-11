// services/siteSettingsService.js
import api from './api';

const siteSettingsService = {
    /**
     * Get all active announcements
     */
    getAnnouncements: async () => {
        try {
            const response = await api.get('/site-settings/announcements/');
            return response.data;
        } catch (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
    },

    /**
     * Get currently active flash sale
     */
    getActiveFlashSale: async () => {
        try {
            const response = await api.get('/site-settings/flash-sale/active/');
            return response.data;
        } catch (error) {
            console.error('Error fetching flash sale:', error);
            return null;
        }
    },

    /**
     * Get all home banner data (announcements + flash sale)
     */
    getHomeBanners: async () => {
        try {
            const response = await api.get('/site-settings/home-banners/');
            return response.data;
        } catch (error) {
            console.error('Error fetching home banners:', error);
            return { announcements: [], flash_sale: null };
        }
    },

    /**
     * Get a specific site setting by key
     */
    getSetting: async (key) => {
        try {
            const response = await api.get(`/site-settings/settings/${key}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching setting ${key}:`, error);
            return null;
        }
    }
};

export default siteSettingsService;