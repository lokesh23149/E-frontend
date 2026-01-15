import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiPlus, FiMinus, FiEye, FiX, FiStar } from "react-icons/fi";
import { useState } from "react";
import Card from "./Card";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Product Image Section */}
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
            <img
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Discount Badge */}
            {product.discount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium z-10"
              >
                -{product.discount}%
              </motion.div>
            )}

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistToggle();
              }}
              className={`absolute top-3 right-3 p-2 rounded-md shadow-sm transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-red-500'
              }`}
              aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </motion.button>

            {/* Quick View Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 p-2 bg-white text-gray-400 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50 hover:text-gray-600 z-10"
              aria-label="Quick view"
            >
              <FiEye className="w-4 h-4" />
            </motion.button>
          </div>
        </Link>

        {/* Product Info Section */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Category */}
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {product.category}
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`} className="mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3 min-h-[24px]">
            <div className="flex items-center space-x-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= (product.rating || 0)
                      ? 'text-amber-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 dark:text-gray-500 line-through font-medium">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Quantity Selector & Add to Cart - Pushed to bottom */}
          <div className="flex items-center justify-between space-x-2 mt-auto">
            <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={decrementQuantity}
                className="p-1.5 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <FiMinus className="w-3 h-3" />
              </motion.button>
              <span className="px-3 py-1.5 bg-white dark:bg-gray-600 rounded text-sm font-semibold min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={incrementQuantity}
                className="p-1.5 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm"
                aria-label="Increase quantity"
              >
                <FiPlus className="w-3 h-3" />
              </motion.button>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
              aria-label={`Add ${quantity} ${product.name} to cart`}
            >
              <FiShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </Card>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2 p-6">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                    <img
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {product.name}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowQuickView(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (product.rating || 0)
                              ? 'text-amber-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xl text-gray-400 dark:text-gray-500 line-through font-medium">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Save {product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="flex-1 mb-6">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {product.description || 'Experience premium quality with this carefully crafted product. Perfect for your everyday needs with exceptional durability and style.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                      <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={decrementQuantity}
                          className="p-2 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={quantity <= 1}
                        >
                          <FiMinus className="w-4 h-4" />
                        </motion.button>
                        <span className="px-4 py-2 bg-white dark:bg-gray-600 rounded text-sm font-semibold min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={incrementQuantity}
                          className="p-2 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm"
                        >
                          <FiPlus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleAddToCart();
                          setShowQuickView(false);
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                      >
                        <FiShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleWishlistToggle();
                        }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          isInWishlist(product.id)
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        <FiHeart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>

                    {/* View Details Link */}
                    <Link
                      to={`/products/${product.id}`}
                      onClick={() => setShowQuickView(false)}
                      className="block text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      View Full Details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
