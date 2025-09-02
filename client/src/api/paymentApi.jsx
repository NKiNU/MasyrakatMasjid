import axios from 'axios';

const API_URL = 'http://localhost:3001/api/checkout';

// Function to get the token from local storage (or any storage mechanism you use)
const getToken = () => localStorage.getItem('token'); // Adjust this based on your storage mechanism

const paymentApi = {
  createOrder: async (orderData) => {
    const token = localStorage.getItem('token');
    console.log("payment api create order",orderData)
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
  processPayment: async (paymentData) => {
    console.log("payment data:", paymentData)
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/payments`, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
  updateOrderStatus: async (orderId, status) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/orders/${orderId}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default paymentApi;

