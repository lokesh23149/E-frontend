import api from './axios';

const API_URL = "http://localhost:8080/api/products/reviews";

export const reviewService = {
  addReview: async (reviewData) => {
    try {
      const response = await api.post(API_URL, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  getReviewsByProduct: async (productId) => {
    try {
      const response = await api.get(`${API_URL}/${productId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
};
