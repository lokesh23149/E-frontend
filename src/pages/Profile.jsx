import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiUser,
  FiMail,
  FiHeart,
  FiShoppingBag,
  FiLogOut,
  FiEdit2,
  FiSave,
  FiX,
  FiMapPin,
  FiPhone,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/authService";
import { orderService } from "../api/orderService";
import { useWishlist } from "../context/WishlistContext";
import Card from "../components/Card";
import LazyImage from "../components/LazyImage";
import Loader from "../components/Loader";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    if (user) {
      // Derive firstName/lastName from name if not present (backward compat)
      let firstName = user.firstName || "";
      let lastName = user.lastName || "";
      if (!firstName && !lastName && user.name) {
        const parts = String(user.name).trim().split(/\s+/);
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }
      setFormData({
        firstName,
        lastName,
        email: user.email || user.gmail || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.firstName?.trim()) errors.firstName = "First name is required";
    if (!formData.lastName?.trim()) errors.lastName = "Last name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    if (!formData.phone?.trim()) errors.phone = "Phone is required";
    if (!formData.address?.trim()) errors.address = "Address is required";
    if (!formData.city?.trim()) errors.city = "City is required";
    if (!formData.state?.trim()) errors.state = "State is required";
    if (!formData.zipCode?.trim()) errors.zipCode = "Zip code is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Zip code validation (5 digits)
    const zipRegex = /^\d{6}$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      errors.zipCode = "Zip code must be exactly 6 digits";
    }

    return errors;
  };

  const handleSave = async () => {
    setSaveError("");
    setSaveSuccess("");
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setSaveError(Object.values(errors).join(". "));
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      setSaveSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setSaveError(error.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSaveError("");
    setSaveSuccess("");
    if (user) {
      let firstName = user.firstName || "";
      let lastName = user.lastName || "";
      if (!firstName && !lastName && user.name) {
        const parts = String(user.name).trim().split(/\s+/);
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }
      setFormData({
        firstName,
        lastName,
        email: user.email || user.gmail || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      });
    }
    setIsEditing(false);
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
    // Clear messages when user starts typing
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      // Client-side validation
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        setPasswordError("All fields are required");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError("New password and confirmation do not match");
        return;
      }

      if (passwordForm.newPassword === passwordForm.currentPassword) {
        setPasswordError(
          "New password must be different from current password",
        );
        return;
      }

      // Call API
      await authService.changePassword(passwordForm);
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <FiPackage className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <FiTruck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (!user) {
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Account Settings
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              <FiLogOut className="w-4 h-4 mr-2" />
              Logout
            </motion.button>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {[
                { id: "personal", label: "Personal Info", icon: FiUser },
                { id: "security", label: "Security", icon: FiMail },
                { id: "orders", label: "My Orders", icon: FiPackage },
                { id: "liked", label: "Liked", icon: FiHeart },
                { id: "account", label: "Account", icon: FiShoppingBag },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "orders") {
                      navigate("/account/orders");
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Role Display */}
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              Role: {user?.role === "ROLE_ADMIN" ? "Administrator" : "User"}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "personal" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-6">
                  {/* Personal Info Content */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FiMail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FiPhone className="w-4 h-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FiMapPin className="w-4 h-4 inline mr-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                  {saveError && (
                    <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                      {saveError}
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                      {saveSuccess}
                    </div>
                  )}
                  <div className="mt-6 flex gap-3">
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
                      >
                        <FiEdit2 className="w-4 h-4 mr-2" />
                        Edit
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSave}
                          disabled={loading}
                          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          <FiSave className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : "Save"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="inline-flex items-center px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-medium rounded-lg transition-all duration-200"
                        >
                          <FiX className="w-4 h-4 mr-2" />
                          Cancel
                        </motion.button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Change Password
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your new password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>

                    {passwordError && (
                      <div className="text-red-600 dark:text-red-400 text-sm">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="text-green-600 dark:text-green-400 text-sm">
                        {passwordSuccess}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading
                        ? "Changing Password..."
                        : "Change Password"}
                    </motion.button>
                  </form>
                </Card>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          My Orders
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Your order history ({orders.length})
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <FiPackage className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {orders.length} orders
                        </span>
                      </div>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="p-12 text-center">
                      <Loader className="py-8" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiPackage className="w-12 h-12 text-gray-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Orders Yet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                        You haven't placed any orders yet. Start shopping to see your orders here!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/products")}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FiShoppingBag className="w-5 h-5 mr-2" />
                        Start Shopping
                      </motion.button>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="space-y-4">
                        {orders.map((order, index) => (
                          <motion.div
                            key={order.referenceId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <Card className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                      Order #{order.referenceId}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available'}
                                    </p>
                                  </div>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-2 capitalize">{order.status}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    ${order.total?.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.orderitems?.length || 0} items
                                  </p>
                                </div>
                              </div>

                              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      Items:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {order.orderitems?.slice(0, 3).map((item, itemIndex) => (
                                        <span
                                          key={itemIndex}
                                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        >
                                          {item.name} (x{item.quantity})
                                        </span>
                                      ))}
                                      {order.orderitems?.length > 3 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                          +{order.orderitems.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 ml-4">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => navigate(`/account/orders/track/${order.referenceId}`)}
                                      className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                    >
                                      <FiTruck className="w-4 h-4 mr-1" />
                                      Track
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => navigate(`/account/orders`)}
                                      className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                      <FiPackage className="w-4 h-4 mr-1" />
                                      Details
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "liked" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Liked Items
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Your saved products ({wishlist.length})
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <FiHeart className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {wishlist.length} items
                        </span>
                      </div>
                    </div>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiHeart className="w-12 h-12 text-gray-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Liked Items Yet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                        Start exploring our products and save your favorites for
                        later!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/products")}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FiShoppingBag className="w-5 h-5 mr-2" />
                        Start Shopping
                      </motion.button>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group"
                          >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                              {/* Product Image */}
                              <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
                                <LazyImage
                                  src={
                                    item.product?.images?.[0]?.url ||
                                    item.product?.image ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={item.product?.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Remove from wishlist button */}
                                <button
                                  onClick={() =>
                                    removeFromWishlist(item.product.id)
                                  }
                                  className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                                  title="Remove from wishlist"
                                >
                                  <FiHeart className="w-4 h-4 text-red-500 fill-current" />
                                </button>
                              </div>

                              {/* Product Info */}
                              <div className="p-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-tight">
                                  {item.product?.name}
                                </h4>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                  {item.product?.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    INR {item.product?.price}
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() =>
                                      navigate(`/products/${item.product.id}`)
                                    }
                                    className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-sm"
                                  >
                                    View Details
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/cart")}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                                  >
                                    Add to Cart
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Account Information
                  </h3>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div> 
  );
};

export default Profile;
