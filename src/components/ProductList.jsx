import { useState, useEffect, memo } from 'react';
import { FiGrid, FiList } from 'react-icons/fi';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { productService } from '../api/productService';

const ProductList = memo(({ category, searchQuery, sortBy = 'name' }) => {

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
        className={`grid gap-4 sm:gap-6 lg:gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
            : 'grid-cols-1 gap-4 sm:gap-6'
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
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {filteredProducts.length} products found
        </span>

        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button onClick={() => setViewMode('grid')}>
            <FiGrid />
          </button>
          <button onClick={() => setViewMode('list')}>
            <FiList />
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3>No products found</h3>
        </div>
      ) : (
        <motion.div
          layout
          className={`grid gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
              : 'grid-cols-1'
          }`}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;
