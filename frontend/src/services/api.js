import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/auth
  headers: {
    'Content-Type': 'application/json'
  }
});

// Notifications API
export const notificationsAPI = {
  // Get all notifications for the logged-in user
  getMyNotifications: async () => {
    try {
      const response = await api.get('/api/notifications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      return response.data.data.count;
    } catch (error) {
      throw error;
    }
  },
  
  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Room Swap API
export const roomSwapAPI = {
  createSwapRequest: async (roomId, reason, priority = "normal") => {
    try {
      const response = await api.post('/api/rooms/swap-request', {
        roomId,
        reason,
        priority
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update the getMySwapRequests API function
  getMySwapRequests: async (status = '') => {
    try {
   
      let url = '/api/rooms/swap-requests/me';
      if (status && status !== 'all') {
        // For approved status, we need to fetch all and filter client-side
        if (status !== 'approved') {
          url += `?status=${status}`;
        }
      }
      
      const response = await api.get(url);
      
      let sentRequests = response.data?.sent || response.data?.data?.sent || [];
      let receivedRequests = response.data?.received || response.data?.data?.received || [];
      
      // If filtering for approved status, include approved, accepted, and completed
      if (status === 'approved') {
        sentRequests = sentRequests.filter(req => 
          req.status === "approved" || req.status === "accepted" || req.status === "completed"
        );
        
        receivedRequests = receivedRequests.filter(req => 
          req.status === "approved" || req.status === "accepted" || req.status === "completed"
        );
      }
      
      return {
        success: response.data?.success || true,
        data: {
          sent: sentRequests,
          received: receivedRequests
        }
      };
    } catch (error) {
      console.error('API error in getMySwapRequests:', error);
      return {
        success: false,
        data: { sent: [], received: [] },
        error: error.message || 'Unknown error'
      };
    }
  },
  
  // Get all swap requests (for admins/wardens)
  getAllSwapRequests: async (status = 'all') => {
    try {
      const response = await api.get(`/api/rooms/swap-requests?status=${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Accept a swap request as the recipient (room owner)
  acceptReceivedSwapRequest: async (swapRequestId) => {
    try {
      const response = await api.put(`/api/rooms/swap-requests/${swapRequestId}/recipient-accept`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Cancel a swap request (for the original requester)
  cancelSwapRequest: async (swapRequestId) => {
    try {
      const response = await api.put(`/api/rooms/swap-requests/${swapRequestId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('API error in cancelSwapRequest:', error);
      throw error;
    }
  },
  
  acceptSwapRequest: async (swapRequestId) => {
    try {
      const response = await api.put(`/api/rooms/swap-requests/${swapRequestId}/accept`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  rejectSwapRequest: async (swapRequestId, reason = '') => {
    try {
      const response = await api.put(`/api/rooms/swap-requests/${swapRequestId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get details of a specific swap request
  getSwapRequestDetails: async (swapRequestId) => {
    try {
      const response = await api.get(`/api/rooms/swap-requests/${swapRequestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  completeSwap: async (swapRequestId) => {
    try {
      const response = await api.post('/api/rooms/swap-requests/complete', { swapRequestId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  markRequestAsViewed: async (swapRequestId) => {
    try {
      const response = await api.put(`/api/rooms/swap-requests/${swapRequestId}/viewed`);
      return response.data;
    } catch (error) {
      console.error('API error in markRequestAsViewed:', error);
      throw error;
    }
  },
  
  // Mark all swap requests as viewed
  markAllRequestsAsViewed: async () => {
    try {
      const response = await api.put('/api/rooms/swap-requests/view-all');
      return response.data;
    } catch (error) {
      console.error('API error in markAllRequestsAsViewed:', error);
      throw error;
    }
  }
};

export default api;