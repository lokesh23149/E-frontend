import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiPackage, FiTruck, FiHome, FiShoppingBag, FiCreditCard, FiMapPin } from 'react-icons/fi';
import Card from '../components/Card';
import Loader from '../components/Loader';
import OrderItemsList from '../components/OrderItemsList';
import { orderService } from '../api/orderService';
import { useAuth } from '../context/AuthContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderRef = location.state?.orderRef;
  const isSuccess = location.state?.orderSuccess;

  useEffect(() => {
    if (!orderRef) {
      navigate('/cart');
      return;
    }

    fetchOrderDetails();
  }, [orderRef]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const order = await orderService.getOrder(orderRef);
      setOrderDetails(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details. Please check your orders page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center">
        <Loader className="py-16" />
      </div>
    );
  }

  if (error || !isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-3xl opacity-20"></div>
                <FiXCircle className="w-32 h-32 text-red-500 dark:text-red-400 mx-auto relative z-10" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-6"
              >
                Order Failed
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
              >
                {error || "We're sorry, but your order could not be processed at this time. Please try again or contact customer support."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-4"
              >
                <Link
                  to="/cart"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mr-4"
                >
                  <FiCreditCard className="w-5 h-5 mr-3" />
                  Try Again
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FiShoppingBag className="w-5 h-5 mr-3" />
                  Continue Shopping
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-center mb-8"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
              <FiCheckCircle className="w-24 h-24 text-green-500 dark:text-green-400 mx-auto relative z-10" />
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>

            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <span className="text-green-800 dark:text-green-200 font-semibold">
                Order #{orderDetails?.referenceId || orderRef}
              </span>
            </div>
          </motion.div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <FiPackage className="w-6 h-6 mr-3 text-blue-500" />
                  Order Summary
                </h2>

                {orderDetails && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Order Date:</span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                        <p className="text-green-600 dark:text-green-400 font-semibold capitalize">
                          {orderDetails.status}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Items Ordered
                      </h3>
                      <OrderItemsList items={orderDetails.orderitems || []} showTotal={true} />
                    </div>
                  </div>
                )}
              </Card>

              {/* What's Next */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <FiTruck className="w-6 h-6 mr-3 text-purple-500" />
                  What's Next?
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Order Processing</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We'll start processing your order within 24 hours. You'll receive an email confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Shipping</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Once shipped, you'll get tracking information via email and SMS.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Delivery</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your order will be delivered to your doorstep. Track it in real-time!
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Order Actions
                </h2>

                <div className="space-y-4">
                  <Link
                    to={`/account/orders/track/${orderRef}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FiTruck className="w-5 h-5 mr-3" />
                    Track Order
                  </Link>

                  <Link
                    to="/account/orders"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FiPackage className="w-5 h-5 mr-3" />
                    View All Orders
                  </Link>

                  <Link
                    to="/products"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FiShoppingBag className="w-5 h-5 mr-3" />
                    Continue Shopping
                  </Link>

                  <Link
                    to="/"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FiHome className="w-5 h-5 mr-3" />
                    Back to Home
                  </Link>
                </div>

                {/* Order Total */}
                {orderDetails && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Order Total</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        INR {orderDetails.total?.toFixed(2)}
                      </span>
                    </div>
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

export default OrderConfirmation;
