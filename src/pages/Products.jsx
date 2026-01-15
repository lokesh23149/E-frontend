import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiGrid, FiList, FiSliders, FiPackage, FiSearch } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { productService } from '../api/productService';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: category ? [category] : searchParams.get('category') ? [searchParams.get('category')] : [],
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    sortBy: 'name',
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 12
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: '-name', label: 'Name Z-A' },
    { value: 'price', label: 'Price Low-High' },
    { value: '-price', label: 'Price High-Low' },
    { value: 'rating', label: 'Rating' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categoriesData = await productService.getCategories();
        const allCategories = [...(categoriesData || []), 'offers'];
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['offers']); // Fallback to offers only
        setError('Failed to load categories. Please try again later.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      // Reset to first page when search changes
      setPagination(prev => ({ ...prev, currentPage: 0 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: pagination.currentPage,
          size: pagination.size,
          category: filters.categories.filter(cat => cat !== 'offers').length > 0 ? filters.categories.filter(cat => cat !== 'offers').join(',') : undefined,
          minPrice: filters.minPrice,
          search: debouncedSearchTerm,
        };

        const response = await productService.getAllProducts(params);
        let filteredProducts = response.products || [];

        // Filter for offers if 'offers' is selected
        if (filters.categories.includes('offers')) {
          filteredProducts = filteredProducts.filter(product => product.discount && product.discount > 0);
        }

        // Apply client-side pagination for offers filter
        const totalFilteredElements = filteredProducts.length;
        const startIndex = pagination.currentPage * pagination.size;
        const endIndex = startIndex + pagination.size;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);
        setPagination({
          currentPage: pagination.currentPage,
          totalPages: Math.ceil(totalFilteredElements / pagination.size),
          totalElements: totalFilteredElements,
          size: pagination.size
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchParams, pagination.currentPage, debouncedSearchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      sortBy: 'name',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">





        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="lg:hidden fixed inset-0 z-50 lg:relative lg:inset-auto"
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 lg:hidden" onClick={() => setShowFilters(false)} />
                <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none lg:relative lg:w-64">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Filters
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Filter Content */}
                    <div className="space-y-6">
                    {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Category
                        </label>
                        {categoriesLoading ? (
                          <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {categories.map((category) => (
                              <label key={category} className="flex items-center">
                                <input
                                  type="checkbox"
                                  value={category}
                                  checked={filters.categories.includes(category)}
                                  onChange={() => handleCategoryChange(category)}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                  {category}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Price Range
                        </label>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min Price</label>
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              value={filters.minPrice}
                              onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">INR ${filters.minPrice}</span>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Price</label>
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              value={filters.maxPrice}
                              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">INR ${filters.maxPrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Minimum Rating
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleFilterChange('rating', star)}
                              className={`w-8 h-8 ${
                                filters.rating >= star
                                  ? 'text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <button
                        onClick={clearFilters}
                        className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Filters
              </h2>

              {/* Filter Content - Same as mobile */}
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          value={category}
                          checked={filters.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">INR ${filters.minPrice}</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Price</label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">INR ${filters.maxPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Minimum Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleFilterChange('rating', star)}
                        className={`w-8 h-8 ${
                          filters.rating >= star
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left: Product count and mobile filters */}
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <FiSliders className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                  </button>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {pagination.totalElements} products found
                  </span>
                </div>

                {/* Right: Search and Sort */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 w-64"
                    />
                  </div>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-medium"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <Loader className="py-16" />
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FiPackage className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Error Loading Products
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search terms.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(0, prev.currentPage - 1) }))}
                    disabled={pagination.currentPage === 0}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.currentPage + 1} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages - 1, prev.currentPage + 1) }))}
                    disabled={pagination.currentPage === pagination.totalPages - 1}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
