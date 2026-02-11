import api from './axios';

const API_URL = 'http://localhost:8080/api/order';

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await api.post(API_URL, orderData);

         return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrder: async (referenceID) => {
    try {
      const response = await api.get(`${API_URL}/${referenceID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (referenceID, status) => {
    try {
      const response = await api.put(`${API_URL}/${referenceID}/status`, status);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  getOrderTracking: async (referenceID) => {
    try {
      const response = await api.get(`${API_URL}/${referenceID}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      throw error;
    }
  },
};
