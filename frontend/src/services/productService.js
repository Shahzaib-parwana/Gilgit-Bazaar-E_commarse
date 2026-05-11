import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const apiParams = { ...params };
    
    // Category slug mapping
    if (apiParams.category) {
      apiParams.category__slug = apiParams.category;
      delete apiParams.category;
    }
    
    // Price range mapping
    if (apiParams.min_price !== undefined && apiParams.min_price !== '' && apiParams.min_price !== null) {
      apiParams.price__gte = Number(apiParams.min_price);
      delete apiParams.min_price;
    }
    if (apiParams.max_price !== undefined && apiParams.max_price !== '' && apiParams.max_price !== null) {
      apiParams.price__lte = Number(apiParams.max_price);
      delete apiParams.max_price;
    }
    
    // Quick chips mapping
    if (apiParams.featured === true) {
      apiParams.is_featured = true;
      delete apiParams.featured;
    }
    if (apiParams.discount === true) {
      apiParams.has_discount = true;
      delete apiParams.discount;
    }
    if (apiParams.best === true) {
      apiParams.is_best_seller = true;
      delete apiParams.best;
    }
    if (apiParams.budget === true) {
      // Budget filter: products under PKR 2,000
      apiParams.price__lte = 2000;
      delete apiParams.budget;
    }
    
    // Sort mapping
    if (apiParams.sort && apiParams.sort !== '') {
      apiParams.ordering = apiParams.sort;
      delete apiParams.sort;
    }
    
    // Remove empty/undefined values
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === undefined || apiParams[key] === null) {
        delete apiParams[key];
      }
    });
    
    // console.log('API Params being sent:', apiParams); // Debug log
    
    const response = await api.get('/products/', { params: apiParams });
    return response.data;
  },

  // Get a single product
  async getProduct(slug) {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  },

  async getProductDetail(slug) {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  },

  // Featured products
  async getFeaturedProducts() {
    const response = await api.get('/products/featured/');
    return response.data;
  },

  // Search
  async searchProducts(query) {
    const response = await api.get('/products/search/', { params: { q: query } });
    return response.data;
  },

  // Categories
  async getCategories() {
    const response = await api.get('/products/categories/');
    return response.data;
  },

  async getCategoryProducts(slug) {
    const response = await api.get(`/products/categories/${slug}/products/`);
    return response.data;
  },
  
  async getTopCategories(limit = 8) {
    const response = await api.get('/products/categories/', {
      params: { is_active: true }
    });
    const categories = response.data.results || response.data || [];
    return categories
      .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
      .slice(0, limit);
  },

  // Gift Hampers
  async getGiftHampers() {
    const response = await api.get('/products/gift-hampers/');
    return response.data;
  }
};