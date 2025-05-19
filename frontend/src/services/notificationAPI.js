
const BASE_URL = "http://localhost:5000/api";

const notificationAPI = {
  // Get all notifications 
  getNotifications: async (type = null, limit = 20) => {
    try {
      let url = `${BASE_URL}/notifications?limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
  
  // Get unread notification count
  getUnreadCount: async (type = null) => {
    try {
      let url = `${BASE_URL}/notifications/unread-count`;
      if (type) {
        url += `?type=${type}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch notification count");
      }
      
      const result = await response.json();
      return result.data.count;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
  
  // Mark a notification as read
  markAsRead: async (notificationId) => {
    
    if (!notificationId) {
      console.error("Cannot mark notification as read: notification ID is undefined");
      throw new Error("Notification ID is required");
    }
    
    try {
      const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async (type = null) => {
    try {
      let url = `${BASE_URL}/notifications/read-all`;
      if (type) {
        url += `?type=${type}`;
      }
      
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
      
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
  
  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }
};

export default notificationAPI;