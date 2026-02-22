import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiUsers, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productService } from '../api/productService';
import bannerImage from '../assets/banner.webp';



const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  
  // Dynamic mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const shouldReduceMotion = prefersReducedMotion || isMobile;

  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ products: 0, customers: null, avgRating: null });

  const categoryIcons = { Accessories: '🧢', Clothing: '👕', Equipment: '🏋️', Supplements: '💊' };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesData] = await Promise.all([
          productService.getAllProducts({ limit: 8 }),
          productService.getCategories().catch(() => []),
        ]);
        setFeaturedProducts(productsRes.products || []);
        setCategories(categoriesData || []);
        setStats({
          products: productsRes.totalElements ?? 0,
          customers: null,
          avgRating: null,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        const backendUrl = import.meta.env.VITE_API_URL || 'https://e-backend-r993.onrender.com';
        setError(`Unable to load data. Please check if the backend is running at ${backendUrl}`);
        setFeaturedProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white" style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl  md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Premium Shopping
              <br />
              Experience
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover amazing products with unbeatable quality and service.
              Shop with confidence and enjoy fast, secure delivery.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Shop Now
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </section>

      {/* Stats Section - from backend */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiShoppingBag, value: stats.products, label: 'Products' },
              { icon: FiUsers, value: stats.customers ?? '—', label: 'Customers' },
              { icon: FiStar, value: stats.avgRating ?? '—', label: 'Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Gym Section
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Explore our wide range of categories and find exactly what you're looking for.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={shouldReduceMotion ? {} : { y: -8 }}
                className="group cursor-pointer"
              >
                <Link to={`/products?category=${encodeURIComponent(cat)}`}>
                  <Card className="text-center overflow-hidden">
                    <div className="relative h-32 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl">{categoryIcons[cat] || '📦'}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {cat}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      products
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Big Offer Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                Special Gym Offer!
              </h3>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Get 50% off on all gym equipment and accessories. Limited time offer!
              </p>
              <Link
                to="/offers"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Claim Offer
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Check out our most popular and highly-rated products.
            </p>
          </motion.div>

          {loading ? (
            <Loader className="py-16" />
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <p className="text-gray-600 dark:text-gray-400">
                Please ensure the backend server is running on {import.meta.env.VITE_API_URL || 'https://e-backend-r993.onrender.com'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Products
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Home;
