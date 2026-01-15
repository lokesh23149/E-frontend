import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useCart } from '../hooks/useCart';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, placeOrder } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading for cart items
    setLoading(false);
  }, []);

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      await placeOrder();
      alert('Order placed successfully!');
    } catch (error) {
      setError('Failed to place order. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  if (loading) {
    return <Loader className="py-16" />;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-lg mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20"></div>
            <FiShoppingBag className="w-32 h-32 text-blue-500 dark:text-blue-400 mx-auto relative z-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-6"
          >
            Your cart is empty
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed"
          >
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up with amazing products!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FiShoppingBag className="w-5 h-5 mr-3" />
              Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-12 text-center"
          >
            Shopping Cart
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={item.images?.[0]?.url || item.image || "/placeholder-product.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {item.name}
                          </h3>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                            INR {item.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl shadow-sm">
                            <motion.button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                              whileTap={{ scale: 0.95 }}
                              className="p-3 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-all duration-200 rounded-l-2xl"
                            >
                              <FiMinus className="w-5 h-5" />
                            </motion.button>
                            <span className="px-6 py-3 text-gray-900 dark:text-gray-100 min-w-[4rem] text-center font-semibold text-lg">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                              whileTap={{ scale: 0.95 }}
                              className="p-3 text-gray-600 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-all duration-200 rounded-r-2xl"
                              disabled={item.quantity >= (item.stock || item.maxQuantity || 99)}
                            >
                              <FiPlus className="w-5 h-5" />
                            </motion.button>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            onClick={() => removeItem(item.id)}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </motion.button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            INR ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      INR {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {shipping === 0 ? 'Free' : `INR ${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      INR {tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        INR ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="mt-8 space-y-4"
                  >
                    <motion.button
                      onClick={handleCheckout}
                      disabled={loading}
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Processing...
                          </>
                        ) : (
                          'Proceed to Checkout'
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={clearCart}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="py-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        Clear Cart
                      </motion.button>

                      <Link
                        to="/products"
                        className="block text-center py-3 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </motion.div>

                {subtotal < 100 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                          Add INR {(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
