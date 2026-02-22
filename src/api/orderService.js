import api from './axios';

const BASE = '/api/order';

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await api.post(BASE, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrder: async (referenceID) => {
    try {
      const response = await api.get(`${BASE}/${referenceID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const response = await api.get(`${BASE}/user/orders`);
      const data = response.data;
      const orders = Array.isArray(data) ? data : [];
      return orders.map(order => ({
        ...order,
        referenceId: order.referenceId ?? order.referenceID,
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  getAdminOrders: async () => {
    try {
      const response = await api.get(`${BASE}/admin/orders`);
      const data = response.data;
      const orders = Array.isArray(data) ? data : [];
      return orders.map(order => ({
        ...order,
        referenceId: order.referenceId ?? order.referenceID,
      }));
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      return [];
    }
  },

  updateOrderStatus: async (referenceID, status) => {
    try {
      const response = await api.put(`${BASE}/${referenceID}/status`, status);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  getOrderTracking: async (referenceID) => {
    try {
      const response = await api.get(`${BASE}/${referenceID}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      throw error;
    }
  },
};
