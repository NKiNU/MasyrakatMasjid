// services/bookingApi.js
import axios from 'axios';
const API_URL = 'http://localhost:3001/api';

const bookingApi = {
  addAvailability: async (availabilityData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/availability`, availabilityData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Modified to get availability for specific date
  getAvailability: async (serviceId, date) => {
    const response = await axios.get(`${API_URL}/availability`, {
      params: {
        serviceId,
        date: date.toISOString()
      }
    });
    return response.data;
  },

  // New method to get all availability for a service
  getServiceAvailability: async (serviceId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/availability/service/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // New method to update availability
  updateAvailability: async (availabilityData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/availability/${availabilityData.id}`,
      availabilityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  // Keep existing methods
  createBooking: async (bookingData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getUserBookings: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/bookings/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAllBookings: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateBookingStatus: async (bookingId, status, adminNotes = '') => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/bookings/${bookingId}/status`,
      { bookingId,status, adminNotes },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },
  sendBookingNotification: async (notificationData) => {
    try {
      const response = await axios.post('/api/bookings/notify', {
        ...notificationData,
        status: notificationData.status // Add status to the notification data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  confirmBooking: async (orderId) => {
    const response = await axios.patch(`/api/bookings/confirm/${orderId}`);
    return response.data;
  },
  updateDonationAmount: async (orderId) => {
    const response = await axios.patch(`/api/donations/update/${orderId}`);
    return response.data;
  }
};

export default bookingApi;