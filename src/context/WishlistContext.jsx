import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../api/wishlistService';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load wishlist on mount if needed
    // Assuming user is authenticated, load wishlist
    getWishlist();
  }, []);

  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      await wishlistService.addToWishlist(productId);
      // Refresh wishlist after adding
      await getWishlist();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      await wishlistService.removeFromWishlist(productId);
      // Refresh wishlist after removing
      await getWishlist();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data); // data is array of wishlist items with product details
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product.id === productId);
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
