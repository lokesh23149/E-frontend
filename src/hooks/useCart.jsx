import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

// Custom hook to access the cart context
// This hook provides access to cart state and functions
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
