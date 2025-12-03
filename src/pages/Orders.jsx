import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiEye, FiDownload } from 'react-icons/fi';
import Card from '../components/Card';
import Loader from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API
        setOrders([
          {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'delivered',
            total: 299.99,
            items: [
              { name: 'Premium Wireless Headphones', quantity: 1, price: 299.99 },
            ],
            shipping: {
              address: '123 Main St, City, State 12345',
              method: 'Standard Shipping',
              tracking: 'TRK123456789',
            },
          },
          {
            id: 'ORD-002',
            date: '2024-01-12',
            status: 'shipped',
            total: 149.50,
            items: [
              { name: 'Smart Watch Series X', quantity: 1, price: 149.50 },
            ],
            shipping: {
              address: '123 Main St, City, State 12345',
              method: 'Express Shipping',
              tracking: 'TRK987654321',
            },
          },
          {
            id: 'ORD-003',
            date: '2024-01-10',
            status: 'processing',
            total: 89.99,
            items: [
              { name: 'Bluetooth Speaker', quantity: 1, price: 89.99 },
            ],
            shipping: {
              address: '123 Main St, City, State 12345',
              method: 'Standard Shipping',
              tracking: null,
            },
          },
        ]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return <Loader className="py-16" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
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
                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <FiPackage className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              ${item.price}
                            </p>
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
    </div>
  );
};

export default Orders;
