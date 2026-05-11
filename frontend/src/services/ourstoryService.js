import api from './api';

class OurStoryService {
  // Get all story data in one request
  async getAllStoryData() {
    try {
      const response = await api.get('/our-story/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching story data:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load story data'
      };
    }
  }

  // Get hero section data
  async getHeroSection() {
    try {
      const response = await api.get('/our-story/hero/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching hero section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load hero section'
      };
    }
  }

  // Update hero section
  async updateHeroSection(heroData) {
    try {
      const response = await api.put('/our-story/hero/', heroData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating hero section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to update hero section'
      };
    }
  }

  // Get intro section data
  async getIntroSection() {
    try {
      const response = await api.get('/our-story/intro/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching intro section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load intro section'
      };
    }
  }

  // Update intro section
  async updateIntroSection(introData) {
    try {
      const response = await api.put('/our-story/intro/', introData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating intro section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to update intro section'
      };
    }
  }

  // Get all stats
  async getStats() {
    try {
      const response = await api.get('/our-story/stats/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load statistics'
      };
    }
  }

  // Create new stat
  async createStat(statData) {
    try {
      const response = await api.post('/our-story/stats/', statData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error creating stat:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to create statistic'
      };
    }
  }

  // Update stat
  async updateStat(id, statData) {
    try {
      const response = await api.put(`/our-story/stats/${id}/`, statData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating stat:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to update statistic'
      };
    }
  }

  // Delete stat
  async deleteStat(id) {
    try {
      await api.delete(`/our-story/stats/${id}/`);
      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('Error deleting stat:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete statistic'
      };
    }
  }

  // Get video section
  async getVideoSection() {
    try {
      const response = await api.get('/our-story/video/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching video section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load video section'
      };
    }
  }

  // Update video section
  async updateVideoSection(videoData) {
    try {
      const response = await api.put('/our-story/video/', videoData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating video section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to update video section'
      };
    }
  }

  // Get all artisan stories
  async getArtisanStories() {
    try {
      const response = await api.get('/our-story/stories/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching artisan stories:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load artisan stories'
      };
    }
  }

  // Create new artisan story
  async createArtisanStory(storyData) {
    try {
      const response = await api.post('/our-story/stories/', storyData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error creating artisan story:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to create artisan story'
      };
    }
  }

  // Update artisan story
  async updateArtisanStory(id, storyData) {
    try {
      const response = await api.put(`/our-story/stories/${id}/`, storyData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating artisan story:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to update artisan story'
      };
    }
  }

  // Delete artisan story
  async deleteArtisanStory(id) {
    try {
      await api.delete(`/our-story/stories/${id}/`);
      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('Error deleting artisan story:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete artisan story'
      };
    }
  }

  // Get all process steps
  async getProcessSteps() {
    try {
      const response = await api.get('/our-story/process/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching process steps:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load process steps'
      };
    }
  }

  // Create new process step
  async createProcessStep(stepData) {
    try {
      const response = await api.post('/our-story/process/', stepData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error creating process step:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to create process step'
      };
    }
  }

  // Update process step
  async updateProcessStep(id, stepData) {
    try {
      const response = await api.put(`/our-story/process/${id}/`, stepData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating process step:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to update process step'
      };
    }
  }

  // Delete process step
  async deleteProcessStep(id) {
    try {
      await api.delete(`/our-story/process/${id}/`);
      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('Error deleting process step:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete process step'
      };
    }
  }

  // Get CTA section
  async getCTASection() {
    try {
      const response = await api.get('/our-story/cta/');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching CTA section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load CTA section'
      };
    }
  }

  // Update CTA section
  async updateCTASection(ctaData) {
    try {
      const response = await api.put('/our-story/cta/', ctaData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating CTA section:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to update CTA section'
      };
    }
  }
}

export default new OurStoryService(); 