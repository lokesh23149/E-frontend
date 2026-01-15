import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/orderService';
import Card from '../components/Card';
import Loader from '../components/Loader';

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <FiPackage className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return <Loader className="py-16" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Order Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your orders and view their current status
            </p>
          </div>

          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You haven't placed any orders yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Order #{order.referenceId}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'Unknown'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          ${order.total?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Items</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {order.orderitems?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Order ID</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {order.referenceId}
                        </p>
                      </div>
                    </div>

                    {order.orderitems && order.orderitems.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Items in this order:
                        </h4>
                        <div className="space-y-2">
                          {order.orderitems.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {item.product?.name || 'Product'} x{item.quantity}
                              </span>
                              <span className="text-gray-900 dark:text-gray-100">
                                ${(item.price * item.quantity)?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          ))}
                          {order.orderitems.length > 3 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              +{order.orderitems.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    {selectedOrder?.id === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          Order Details
                        </h4>
                        <div className="space-y-3">
                          {order.orderitems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.product?.name || 'Product'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Quantity: {item.quantity} × ${item.price?.toFixed(2) || '0.00'}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                ${(item.price * item.quantity)?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>${order.total?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;
