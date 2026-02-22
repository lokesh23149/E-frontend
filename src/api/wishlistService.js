import api from './axios';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://e-backend-r993.onrender.com/';

const transformProductImages = (product) => {
  if (!product) return product;
  const images = (product.images || []).map((img) => {
    const url = img?.url || '';
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}/api/products/images/${String(url).split('/').pop()}`;
    return { ...img, url: fullUrl };
  });
  return {
    ...product,
    description: product.description || product.discripsion,
    images,
    image: images[0]?.url || '/placeholder-product.jpg',
  };
};

const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await api.get('/api/wishlist');
      const data = response.data;
      const items = Array.isArray(data) ? data : [];
      return items.map((item) => ({
        ...item,
        product: transformProductImages(item.product),
      }));
    } catch (error) {
      if (error.response?.status === 401) return [];
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await api.post(`/api/wishlist/add/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/api/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if product is in wishlist
  checkInWishlist: async (productId) => {
    try {
      const response = await api.get(`/api/wishlist/check/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  }
};

export { wishlistService };
