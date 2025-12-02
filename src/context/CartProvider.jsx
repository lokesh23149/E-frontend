import { useState } from 'react';
import { CartContext } from './CartContext';

// CartProvider component that manages the cart state
// Provides cart functions to all child components
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Array of cart items

  // Add a product to the cart
  // If product exists, increase quantity; otherwise, add new item
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove an item from the cart by id
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCart([]);
  };

  // Update the quantity of an item in the cart
  // If quantity <= 0, remove the item
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
