// api/cartApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/cart';

// Get user's cart
export const getCart = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (userId, productData, token) => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      userId,
      item: productData
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (userId, productId, quantity, token) => {
  try {
    const response = await axios.put(`${API_URL}/updateQuantity`, { // Changed from /update to /updateQuantity
      userId,
      productId,
      quantity
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};
// Remove item from cart
export const removeFromCart = async (userId, productId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/remove`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { userId, productId }
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};