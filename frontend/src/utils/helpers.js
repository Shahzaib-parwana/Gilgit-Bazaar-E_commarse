/**
 * Format price to PKR currency
 */
export const formatPrice = (price) => {
  return `PKR ${parseFloat(price).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Pakistani format)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate slug from string
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (cartItems) => {
  const subtotal = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);

  const shippingCost = 200; // Fixed shipping cost
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shippingCost + tax;

  return {
    subtotal: subtotal.toFixed(2),
    shippingCost: shippingCost.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  };
};

/**
 * Check if item is in stock
 */
export const isInStock = (product, quantity = 1) => {
  return product.stock >= quantity;
};

/**
 * Get image URL or placeholder
 */
export const getImageUrl = (imageUrl, placeholder = 'https://via.placeholder.com/400') => {
  return imageUrl || placeholder;
};

/**
 * Parse error messages from API response
 */
export const parseErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data) {
    const errorData = error.response.data;
    const firstKey = Object.keys(errorData)[0];
    if (Array.isArray(errorData[firstKey])) {
      return errorData[firstKey][0];
    }
    return errorData[firstKey];
  }
  
  return error.message || 'An error occurred';
};

/**
 * Local storage helpers
 */
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    behavior,
  });
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};