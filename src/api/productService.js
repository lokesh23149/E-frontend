import api from './axios';

const API_URL = "http://localhost:8080/api/products";

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const queryParams = {
        page: params.page || 0,
        size: params.size || 12,
        sortBy: params.sort || 'name'
      };

      // Add filter parameters
      if (params.category) queryParams.category = params.category;
      if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice;
      if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
      if (params.minRating) queryParams.rating = params.minRating;
      if (params.search) queryParams.keywords = params.search;

      const response = await api.get(API_URL, { params: queryParams });

      // Backend now returns structured response with pagination
      const data = response.data;
      const products = data.products || [];

      return {
        products: products.map(product => ({
          ...product,
          images: product.images || []
        })),
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        currentPage: data.currentPage || 0,
        size: data.size || 12
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get(`${API_URL}/categories`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`${API_URL}/category/${category}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      const product = response.data;
      return {
        ...product,
        images: product.images || []
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post(API_URL, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};
