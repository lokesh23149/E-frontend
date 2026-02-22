import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPercent, FiArrowRight } from 'react-icons/fi';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { productService } from '../api/productService';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await productService.getAllProducts({ size: 100 });
        const withDiscount = (response.products || []).filter(
          (p) => p.discount && p.discount > 0
        );
        setProducts(withDiscount);
        setError(null);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Unable to load offers. Please check if the backend is running.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <FiPercent className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exclusive Offers & Deals
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Unlock amazing savings with our discounted products. Up to 35% off on selected items!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Browse All Products
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />
      </section>

      {/* Discounted Products Grid */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Products on Sale
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse through our discounted products and grab the best deals.
            </p>
          </motion.div>

          {loading ? (
            <Loader className="py-16" />
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <p className="text-gray-600 dark:text-gray-400">
                Please ensure the backend server is running.
              </p>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FiPercent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No offers available right now
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Check back later for amazing deals!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Products
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Offers;
