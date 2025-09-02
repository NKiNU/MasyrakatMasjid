// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../api/cartApi';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?._id) {
      console.log("Fetching cart for user:", currentUser._id);
      fetchCart();
    }
  }, [currentUser]);

  useEffect(() => {
    const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(newCount);
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const cartData = await getCart(currentUser._id, token);
      setCart(cartData.items || []);
      console.log("Cart fetched:", cartData.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const cartData = await addToCart(currentUser._id, {
        productId: product._id,
        quantity: 1,
        price: product.price
      }, token);
      setCart(cartData.items);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!currentUser?._id) {
        throw new Error('User not authenticated');
      }

      const cartData = await updateCartItem(
        currentUser._id,
        productId,
        quantity,
        token
      );

      if (cartData) {
        setCart(cartData.items || []);
      }
    } catch (error) {
      console.error('Error updating quantity 2:', error);
      throw error; // Rethrow to handle in component
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await removeFromCart(currentUser._id, productId, token);
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await clearCart(currentUser._id, token);
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      loading,
      addToCart: handleAddToCart,
      removeFromCart: handleRemoveFromCart,
      updateQuantity: handleUpdateQuantity,
      clearCart: handleClearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);