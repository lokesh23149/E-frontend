import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiStar, FiMinus, FiPlus, FiShoppingCart, FiTruck, FiShield, FiRotateCcw, FiHeart, FiSend, FiPercent, FiClock } from 'react-icons/fi';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';

import Loader from '../components/Loader';import { productService } from '../api/productService';
import { reviewService } from '../api/reviewService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await productService.getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error.response && error.response.status === 404) {
          setError('Product not found.');
        } else {
          setError('Failed to load product details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (product && product.id) {
        try {
          const reviewsData = await reviewService.getReviewsByProduct(product.id);
          console.log('Fetched reviews data:', reviewsData);
          // Ensure reviewsData is an array
          const reviewsArray = Array.isArray(reviewsData) ? reviewsData : [];
          setReviews(reviewsArray);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setReviews([]); // Set to empty array on error
        }
      }
    };

    fetchReviews();
  }, [product]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      setQuantity(1); // Reset quantity after adding
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await reviewService.addReview({
        productid: product.id,
        ratings: reviewRating,
        comments: reviewComment.trim()
      });

      // Refresh reviews
      const reviewsData = await reviewService.getReviewsByProduct(product.id);
      setReviews(reviewsData);

      // Reset form
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {error || 'Product not found'}
            </h1>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2 w-4 h-4" />
              Back to Products
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/products')}
          className="inline-flex items-center px-4 py-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <FiArrowLeft className="mr-2 w-4 h-4" />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <LazyImage
                  src={product.images?.[selectedImage]?.url || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 shrink-0 ${
                        selectedImage === index
                          ? 'border-blue-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <LazyImage
                        src={image.url || "/placeholder-product.jpg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="relative group">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {product.name}
              </h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistToggle}
                className={`absolute top-0 right-0 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white shadow-red-200'
                    : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-400 dark:text-gray-500 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl'
                }`}
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </motion.button>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {product.ratings || 0} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                INR {product.discount ? (product.price * (1 - product.discount / 100)).toFixed(0) : product.price}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">INR {product.price}</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">-{product.discount}% OFF</span>
                </>
              )}
              {product.originalPrice && !product.discount && (
                <span className="text-xl text-gray-500 line-through">INR {product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Stock: {product.stock || 0}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.stock > 10
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : product.stock > 0
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <FiMinus className="w-4 h-4" />
                    </motion.button>
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || quantity <= 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>Add to Cart - INR {(product.price * quantity).toFixed(2)}</span>
                </motion.button>
              </div>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.features ? (
                JSON.parse(product.features).map((feature, index) => {
                  const IconComponent = {
                    FiTruck,
                    FiShield,
                    FiRotateCcw,
                    FiPercent,
                    FiClock
                  }[feature.icon] || FiShield;

                  const iconColors = {
                    FiTruck: 'text-green-500',
                    FiShield: 'text-blue-500',
                    FiRotateCcw: 'text-purple-500',
                    FiPercent: 'text-orange-500',
                    FiClock: 'text-red-500'
                  };

                  return (
                    <div key={index} className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <IconComponent className={`w-5 h-5 ${iconColors[feature.icon] || 'text-blue-500'}`} />
                      <span>{feature.text}</span>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <FiTruck className="w-5 h-5 text-green-500" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <FiShield className="w-5 h-5 text-blue-500" />
                    <span>Quality Assured</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <FiRotateCcw className="w-5 h-5 text-purple-500" />
                    <span>30 Day Returns</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Customer Reviews ({reviews.length})
            </h2>

            {/* Review Submission Form */}
            <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Write a Review
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <FiStar
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {reviewRating} star{reviewRating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                    rows={4}
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submittingReview || !reviewComment.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {submittingReview ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </motion.button>
              </form>
            </Card>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.user ? review.user.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {review.user || 'Anonymous User'}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (review.ratings || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {review.comments || 'No comment provided.'}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          {review.date ? new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : `Review #${review.id || index + 1}`}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiStar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
