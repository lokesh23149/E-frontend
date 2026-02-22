import api from './axios';

const BASE = '/api/products/reviews';

export const reviewService = {
  addReview: async (reviewData) => {
    try {
      const payload = {
        productId: reviewData.productId ?? reviewData.productid,
        ratings: reviewData.ratings,
        comments: reviewData.comments
      };
      const response = await api.post(BASE, payload);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  getReviewsByProduct: async (productId) => {
    try {
      const response = await api.get(`${BASE}/${productId}`);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },
};
