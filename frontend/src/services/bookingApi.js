import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const bookingApi = {
 
  createBooking: async (bookingData) => {
    try {
      console.log('Sending booking data:', bookingData);
      
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Booking error details:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      
      // More specific error handling
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw error;
      }
    }
  },

processPayment: async (bookingId, paymentDetails) => {
  try {
    let endpoint, data;

    if (paymentDetails.method === 'card') {
      endpoint = '/payment/confirm-payment';
      data = {
        bookingId,
        paymentIntentId: paymentDetails.paymentIntentId,
        amount: paymentDetails.amount
      };
    } else {
     endpoint = `/bookings/${bookingId}/payment`; 
      data = {
        bookingId,
        method: paymentDetails.method,
        ...(paymentDetails.method === 'upi' && { upiId: paymentDetails.upiId })
      };
    }

    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Payment error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
},
  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${bookingId}:`, error);
      throw error;
    }
  },
  
  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Get user's booking history
  getUserBookings: async (status = '') => {
    try {
      const response = await api.get('/bookings/user/history', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get all guest houses with available rooms based on dates
  getAllGuestHouses: async (checkIn, checkOut) => {
    try {
      const response = await api.get('/guesthouses', {
        params: { 
          checkIn: new Date(checkIn).toISOString(),
          checkOut: new Date(checkOut).toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching guest houses:', error);
      throw error;
    }
  },

  // Get specific guest house with available rooms
  getGuestHouseById: async (id, checkIn, checkOut) => {
    try {
      const response = await api.get(`/guesthouses/${id}`, {
        params: { 
          checkIn: new Date(checkIn).toISOString(),
          checkOut: new Date(checkOut).toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching guest house ${id}:`, error);
      throw error;
    }
  }
};

export default bookingApi;