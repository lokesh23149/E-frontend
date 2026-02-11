import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPercent, FiTag, FiCalendar, FiCheck } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { offerService } from '../api/offerService';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingOffer, setApplyingOffer] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await offerService.getAllOffers();
        setOffers(response);
        setError(null);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setError('Unable to load offers. Please check if the backend is running.');
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleApplyOffer = async (offerId) => {
    setApplyingOffer(offerId);
    try {
      const response = await offerService.applyOffer(offerId);
      toast.success(`Offer applied successfully! ${response.discountPercentage}% discount added.`);
    } catch (error) {
      console.error('Error applying offer:', error);
      toast.error('Failed to apply offer. Please try again.');
    } finally {
      setApplyingOffer(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-pink-600 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <FiPercent className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exclusive Offers & Deals
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
              Unlock amazing savings with our limited-time offers. Don't miss out on these incredible deals!
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />
      </section>

      {/* Offers Grid */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Current Offers
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse through our active offers and apply them to your next purchase.
            </p>
          </motion.div>

          {loading ? (
            <Loader className="py-16" />
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <p className="text-gray-600 dark:text-gray-400">
                Please ensure the backend server is running on localhost:8080
              </p>
            </div>
          ) : offers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FiPercent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No offers available right now
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back later for amazing deals!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={offer.imageUrl || '/placeholder-offer.jpg'}
                        alt={offer.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-offer.jpg';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {offer.discountPercentage}% OFF
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {offer.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <FiCalendar className="w-4 h-4" />
                        <span>Valid till: {formatDate(offer.validTill)}</span>
                      </div>

                      <button
                        onClick={() => handleApplyOffer(offer.id)}
                        disabled={applyingOffer === offer.id}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {applyingOffer === offer.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            <FiCheck className="w-5 h-5" />
                            Apply Offer
                          </>
                        )}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Offers;
  
