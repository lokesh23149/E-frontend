import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const Settings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching additional profile data
    const fetchProfileData = async () => {
      try {
        // In a real app, you would fetch from API
        // For now, use the user data from context
        setProfileData({
          ...user,
          joinDate: '2023-01-15',
          lastLogin: new Date().toISOString().split('T')[0],
          role: 'Admin',
          phone: '+91 9361719237',
          address: 'ma nagar redhills ch -52',
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Settings
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your admin profile and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo and Basic Info */}
            <div className="lg:col-span-1">
              <Card className="text-center">
                <div className="relative inline-block">
                  <img
                    src={profileData.avatar || '/default-avatar.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100 dark:border-blue-900"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <FiEdit className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {profileData.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {profileData.role}
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    Joined {new Date(profileData.joinDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {profileData.name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {profileData.gmail || profileData.email}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {profileData.phone}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {profileData.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        {profileData.address}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Join Date
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {new Date(profileData.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Login
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {new Date(profileData.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                    Edit Profile
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
