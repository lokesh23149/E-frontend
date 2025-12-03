import products from '../data/products';

export const productService = {
  getAllProducts: async (params = {}) => {
    let filteredProducts = [...products];

    // Apply category filter
    if (params.category && params.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Apply search filter
    if (params.q) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(params.q.toLowerCase()) ||
        product.description.toLowerCase().includes(params.q.toLowerCase())
      );
    }

    // Apply limit
    if (params.limit) {
      filteredProducts = filteredProducts.slice(0, params.limit);
    }

    return { products: filteredProducts };
  },

  getProductById: async (id) => {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  getProductsByCategory: async (category) => {
    const filteredProducts = products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
    return { products: filteredProducts };
  },

  searchProducts: async (query) => {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    return { products: filteredProducts };
  },

  createProduct: async (productData) => {
    const newProduct = {
      id: products.length + 1,
      ...productData
    };
    products.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id, productData) => {
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    products[index] = { ...products[index], ...productData };
    return products[index];
  },

  deleteProduct: async (id) => {
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    const deletedProduct = products.splice(index, 1)[0];
    return deletedProduct;
  },
};
