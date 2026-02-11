import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/orderService';
import Card from '../components/Card';
import Loader from '../components/Loader';
import OrderItemsList from '../components/OrderItemsList';

const OrderTracking = () => {
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchTrackingInfo();
    } else {
      // If no orderId, redirect to orders page or show list
      navigate('/account/orders');
    }
  }, [orderId]);

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      const tracking = await orderService.getOrderTracking(orderId);
      const orderDetails = await orderService.getOrder(orderId);
      setTrackingInfo(tracking);
      setOrder(orderDetails);
    } catch (error) {
      console.error('Error fetching tracking info:', error);
      setError('Failed to load tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <FiPackage className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <FiTruck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FiPackage className="w-6 h-6 text-gray-500" />;
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

  if (loading) {
    return <Loader className="py-16" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Tracking
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/account/orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </Card>
      </div>
    );
  }

  if (!trackingInfo || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </Card>
      </div>
    );
  }

  const statusSteps = getStatusSteps(trackingInfo.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/account/orders')}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Track Order #{trackingInfo.orderId}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time tracking for your order
            </p>
          </div>

          {/* Tracking Status */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {getStatusIcon(trackingInfo.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Current Status: {trackingInfo.status?.charAt(0).toUpperCase() + trackingInfo.status?.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order placed on {new Date(trackingInfo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {trackingInfo.trackingNumber && (
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tracking Number</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-mono">
                    {trackingInfo.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : step.current
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <FiCheckCircle className="w-5 h-5" />
                    ) : step.current ? (
                      getStatusIcon(step.key)
                    ) : (
                      <FiClock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${
                      step.completed
                        ? 'text-green-600 dark:text-green-400'
                        : step.current
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500'
                    }`}>
                      {step.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Details */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Order ID:</span> {trackingInfo.orderId}</p>
                  <p><span className="font-medium">Total Amount:</span> ${order.total?.toFixed(2) || '0.00'}</p>
                  <p><span className="font-medium">Items:</span> {order.orderitems?.length || 0}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shipping Information
                </h4>
                <div className="space-y-2 text-sm">
                  {trackingInfo.trackingNumber ? (
                    <p><span className="font-medium">Tracking Number:</span> {trackingInfo.trackingNumber}</p>
                  ) : (
                    <p className="text-gray-500">Tracking number will be available once shipped</p>
                  )}
                  <p><span className="font-medium">Status:</span> {trackingInfo.status?.charAt(0).toUpperCase() + trackingInfo.status?.slice(1)}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Items in this order
              </h4>
              <OrderItemsList items={order.orderitems || []} showTotal={true} />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;
