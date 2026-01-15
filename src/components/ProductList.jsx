import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import Card from './Card';
import Loader from './Loader';
import { productService } from '../api/productService';

const ProductList = ({ category, searchQuery, sortBy = 'name' }) => {


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: category !== 'all' ? category : undefined,
          search: searchQuery,
          sort: sortBy,
        };

        const response = await productService.getAllProducts(params);
        setProducts(response.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, sortBy]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  if (loading) {
    return (
      <motion.div
        layout
        className={`grid gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
            : 'grid-cols-1 gap-6'
        }`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProducts.length} products found
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <div className="text-7xl mb-6 opacity-50">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className={`grid gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
              : 'grid-cols-1 gap-6'
          }`}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="h-fit"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductList;
