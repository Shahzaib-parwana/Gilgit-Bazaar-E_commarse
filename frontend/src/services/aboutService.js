import api from './api';

class AboutService {
  getFullImageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${imagePath}`;
  }

  async getAllAboutData() {
    try {
      const response = await api.get('/about/');
      
      // Process image URLs
      if (response.data) {
        if (response.data.hero?.hero_image) {
          response.data.hero.hero_image = this.getFullImageUrl(response.data.hero.hero_image);
        }
        if (response.data.story?.story_image) {
          response.data.story.story_image = this.getFullImageUrl(response.data.story.story_image);
        }
        if (response.data.team) {
          response.data.team = response.data.team.map(member => ({
            ...member,
            image: member.image ? this.getFullImageUrl(member.image) : null
          }));
        }
        if (response.data.spotlight) {
          if (response.data.spotlight.main_image) {
            response.data.spotlight.main_image = this.getFullImageUrl(response.data.spotlight.main_image);
          }
          if (response.data.spotlight.secondary_image_1) {
            response.data.spotlight.secondary_image_1 = this.getFullImageUrl(response.data.spotlight.secondary_image_1);
          }
          if (response.data.spotlight.secondary_image_2) {
            response.data.spotlight.secondary_image_2 = this.getFullImageUrl(response.data.spotlight.secondary_image_2);
          }
        }
      }
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      // console.error('Error fetching about data:', error);
      
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || 'Failed to load about page data'
      };
    }
  }
}

export default new AboutService();