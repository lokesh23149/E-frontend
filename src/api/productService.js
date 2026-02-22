import api from './axios';

// Use relative URL for development (proxy), full URL for production
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
const API_URL = `${API_BASE}/api/products`;

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const queryParams = {
        page: params.page || 0,
        size: params.size || 12,
        sortBy: params.sortBy || 'name'
      };

      // Add filter parameters
      if (params.category) queryParams.category = params.category;
      if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice;
      if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
      if (params.rating) queryParams.rating = params.rating;
      if (params.search) queryParams.keywords = params.search;
      if (params.limit) queryParams.size = params.limit; // Support limit parameter

      const response = await api.get(API_URL, { params: queryParams });

      // Backend now returns structured response with pagination
      const data = response.data;
      const products = data.products || [];

      return {
        products: products.map(product => {
          const mappedImages = (product.images || []).map(img => {
            const url = img?.url || '';
            return {
              ...img,
              url: url.startsWith('http') ? url : `${API_BASE}/api/products/images/${url.split('/').pop()}`
            };
          });
          return {
            ...product,
            description: product.discripsion || product.description,
            reviewCount: product.numofreviews ?? product.reviewCount ?? 0,
            images: mappedImages,
            image: mappedImages[0]?.url ? (mappedImages[0].url.startsWith('http') ? mappedImages[0].url : `${API_BASE}/api/products/images/${(mappedImages[0].url || '').split('/').pop()}`) : '/placeholder-product.jpg',
            discount: product.discount || 0
          };
        }),
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
      const response = await api.get(API_URL, { params: { category, size: 1000 } });
      const data = response.data || {};
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      // Validate product ID before API call
      if (!id || String(id).trim() === '' || isNaN(Number(id))) {
        throw new Error('Invalid product ID');
      }

      const response = await api.get(`${API_URL}/${id}`);
      const product = response.data;
      if (!product || !product.id) {
        throw new Error('Product not found');
      }
      return {
        ...product,
        description: product.discripsion || product.description,
        reviewCount: product.numofreviews ?? product.reviewCount ?? 0,
        reviews: product.reviews || [],
        images: (product.images || []).map(img => ({
          ...img,
          url: (img?.url || '').startsWith('http') ? img.url : `${API_BASE}/api/products/images/${(img?.url || '').split('/').pop()}`
        }))
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
