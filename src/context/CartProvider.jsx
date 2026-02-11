import { useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { orderService } from '../api/orderService';
import { useAuth } from './AuthContext';


// CartProvider component that manages the cart state
// Provides cart functions to all child components
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }); // Array of cart items

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add a product to the cart with specified quantity
  // If product exists, increase quantity; otherwise, add new item
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id == product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id == product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
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

  // Decrement quantity of an item in the cart by 1
  // If quantity becomes 0, remove the item
  const decrementQuantity = (id) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Place an order using the backend API
  const placeOrder = async () => {
    try {
      // Validate user address before placing order
      if (!user) {
        throw new Error('User not authenticated. Please log in to place an order.');
      }

      // Check if required address fields are present
      const requiredFields = ['address', 'city', 'state', 'zipCode'];
      const missingFields = requiredFields.filter(field => !user[field] || user[field].trim() === '');

      if (missingFields.length > 0) {
        throw new Error(`Please complete your delivery address. Missing: ${missingFields.join(', ')}. Update your profile to continue.`);
      }

      const orderData = {
        orderdao: cart.map(item => ({
          productid: item.id,
          quantity: item.quantity,
          name: item.name,
          image: item.image,
          price: item.price
        }))
      };
      const response = await orderService.createOrder(orderData);
      clearCart(); // Clear cart after successful order
      return response;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};
