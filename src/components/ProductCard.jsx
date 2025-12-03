import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import Card from './Card';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden group cursor-pointer">
        <Link to={`/products/${product.id}`}>
          <div className="relative">
            <img
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            <div className="absolute top-2 right-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <FiHeart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{product.discount}%
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating || 4.5}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FiShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </motion.button>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
