import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../api/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      setWishlist([]);
      if (error.response?.status !== 401) {
        console.error('Error loading wishlist:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      getWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, user?.id, getWishlist]);

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add to wishlist');
    }
    try {
      setLoading(true);
      await wishlistService.addToWishlist(productId);
      await getWishlist();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      await wishlistService.removeFromWishlist(productId);
      await getWishlist();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some((item) => item.product?.id === productId || item.product?.id == productId);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    isInWishlist,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
