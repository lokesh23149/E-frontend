import axios from './axios';

const offerService = {
  // Get all active offers
  getAllOffers: async () => {
    try {
      const response = await axios.get('/api/offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  // Apply an offer
  applyOffer: async (offerId) => {
    try {
      const response = await axios.post(`/api/offers/apply/${offerId}`);
      return response.data;
    } catch (error) {
      console.error('Error applying offer:', error);
      throw error;
    }
  },
};

export { offerService };
