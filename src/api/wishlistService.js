import axios from './axios';

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await axios.get('/api/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await axios.post(`/api/wishlist/add/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await axios.delete(`/api/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if product is in wishlist
  checkInWishlist: async (productId) => {
    try {
      const response = await axios.get(`/api/wishlist/check/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  }
};

export { wishlistService };
