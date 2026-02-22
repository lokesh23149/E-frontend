import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiEye, FiDownload, FiClock, FiX } from 'react-icons/fi';
import Card from '../components/Card';
import Loader from '../components/Loader';
import OrderItemsList from '../components/OrderItemsList';
import { orderService } from '../api/orderService';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const location = useLocation();
  const navigate = useNavigate();
  

  
  

  

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userOrders = isAdmin
          ? await orderService.getAdminOrders()
          : await orderService.getUserOrders();
        // Transform the backend data to match the frontend format
        const transformedOrders = userOrders.map(order => ({
          id: order.id,
          referenceId: order.referenceId ?? order.referenceID,
          date: order.createdAt,
          status: order.status,
          total: order.total,
          items: (order.orderitems || []).map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image ? (item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://e-backend-r993.onrender.com'}${item.image}`) : null,
            productId: item.productId
          })),
          shipping: {
            address: 'Default Address', // You might want to add address to order entity
            method: 'Standard Shipping',
            tracking: order.trackingNumber,
          },
        }));
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  useEffect(() => {
    if (location.state?.orderSuccess) {
      setSuccessMessage(`Order placed successfully! Order ID: ${location.state.orderRef}`);
      // Clear the state after showing message
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'processing':
        return <FiPackage className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'processing', label: 'Order Placed', description: 'Your order has been received and is being processed.' },
      { key: 'shipped', label: 'Shipped', description: 'Your order has been shipped and is on its way.' },
      { key: 'delivered', label: 'Delivered', description: 'Your order has been successfully delivered.' },
    ];

    const currentIndex = steps.findIndex(step => step.key === status?.toLowerCase());
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status?.toLowerCase() === filter;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <Loader className="py-16" />;
  }

  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg"
          >
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
              <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Orders
            </h1>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'processing', label: 'Processing' },
                { key: 'shipped', label: 'Shipped' },
                { key: 'delivered', label: 'Delivered' },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filter === filterOption.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FiPackage className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                No orders found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {filter === 'all'
                  ? "You haven't placed any orders yet."
                  : `No ${filter} orders found.`
                }
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Order #{order.referenceId}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Placed on {order.date ? new Date(order.date).toLocaleDateString() : 'Date not available'}
                          </p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          


                     onClick={() => navigate(`/account/orders/track/${order.referenceId}`)}


                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          <FiTruck className="w-4 h-4 mr-2" />
                          Track Order
                        </button>
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <FiEye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          <FiDownload className="w-4 h-4 mr-2" />
                          Invoice
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Items Ordered
                      </h4>
                      <OrderItemsList items={order.items} showTotal={true} />
                    </div>

                    {/* Tracking Progress */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Order Tracking
                      </h4>
                      <div className="space-y-3">
                        {getStatusSteps(order.status).map((step, index) => (
                          <div key={step.key} className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                : step.current
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            }`}>
                              {step.completed ? (
                                <FiCheckCircle className="w-4 h-4" />
                              ) : step.current ? (
                                getStatusIcon(step.key)
                              ) : (
                                <FiClock className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className={`text-sm font-medium ${
                                step.completed
                                  ? 'text-green-600 dark:text-green-400'
                                  : step.current
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500'
                              }`}>
                                {step.label}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total: <span className="font-semibold text-gray-900 dark:text-gray-100">${order.total}</span>
                          </p>
                          {order.shipping.tracking && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Tracking: {order.shipping.tracking}
                            </p>
                          )}
                        </div>

                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Order Details #{selectedOrder.referenceId}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Order ID:</span> {selectedOrder.referenceId}</p>
                      <p><span className="font-medium">Date:</span> {selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : 'Date not available'}</p>
                      <p><span className="font-medium">Status:</span>
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="ml-1 capitalize">{selectedOrder.status}</span>
                        </span>
                      </p>
                      <p><span className="font-medium">Total:</span> ${selectedOrder.total}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Shipping Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Address:</span> {selectedOrder.shipping.address}</p>
                      <p><span className="font-medium">Method:</span> {selectedOrder.shipping.method}</p>
                      {selectedOrder.shipping.tracking && (
                        <p><span className="font-medium">Tracking:</span> {selectedOrder.shipping.tracking}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Items Ordered
                  </h3>
                  <OrderItemsList items={selectedOrder.items} showTotal={true} />
                </div>

                {/* Order Tracking */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Order Tracking
                  </h3>
                  <div className="space-y-3">
                    {getStatusSteps(selectedOrder.status).map((step, index) => (
                      <div key={step.key} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : step.current
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <FiCheckCircle className="w-4 h-4" />
                          ) : step.current ? (
                            getStatusIcon(step.key)
                          ) : (
                            <FiClock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-sm font-medium ${
                            step.completed
                              ? 'text-green-600 dark:text-green-400'
                              : step.current
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-500'
                          }`}>
                            {step.label}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => navigate(`/account/orders/track/${selectedOrder.referenceId}`)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <FiTruck className="w-4 h-4 mr-2" />
                  Track Order
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
