import { Navbar } from "@/components/navigation/Navbar";
import ChatPanel from "@/components/request/ChatPanel";
import { Footer } from "@/components/navigation/Footer";
import SwapRequestsMain from "@/components/request/SwapRequestsMain";
import SwapReceiptDialog from "@/components/request/SwapReceiptDialog";
import { useTheme } from "@/components/context/ThemeContext";
import { NotificationList } from "@/components/request/NotificationList";
import { RejectionDialog } from "@/components/request/RejectionDialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";
import { roomSwapAPI } from "@/services/api";
import RoomSwapDetailsDialog from "@/components/request/RoomSwapDetailsDialog";
import {
  getStatusBadge,
  fetchRoomSwapRequests,
  filterNotifications,
  sortNotifications,
  fetchUserProfile,
} from "@/utils/roomSwapUtils";

const Request = () => {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDetails, setNotificationDetails] = useState([]);

  const [unreadMessagesMap, setUnreadMessagesMap] = useState<
    Record<string, number>
  >({});

  const [userDetails, setUserDetails] = useState({
    name: "Current User",
    avatar: `https://ui-avatars.com/api/?name=User&background=6d28d9&color=fff`,
  });

  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const { theme } = useTheme();

  // Get filtered notifications based on active tab and search query
  const filteredNotifications = useMemo(() => {
    return filterNotifications(notifications, activeTab, searchQuery);
  }, [notifications, activeTab, searchQuery]);

  // Sort filtered notifications
  const sortedNotifications = useMemo(() => {
    return sortNotifications(filteredNotifications);
  }, [filteredNotifications]);

  // Fetch user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserDetails(profile);
      } catch (error) {
        setUserDetails({ name: "Unknown User", avatar: "" }); // Fallback
      }
    };

    const handleAllRequestsRead = () => {
      // Update all notifications to mark as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isNew: false,
        }))
      );

      // Reset all unread counts
      setUnreadMessagesMap((prev) => {
        const newMap = {};
        Object.keys(prev).forEach((key) => {
          newMap[key] = 0;
        });
        return newMap;
      });

      setTotalUnreadCount(0);
    };

    window.addEventListener("roomSwapAllRequestsRead", handleAllRequestsRead);
    loadUserProfile();
    return () => {
      window.removeEventListener(
        "roomSwapAllRequestsRead",
        handleAllRequestsRead
      );
    };
  }, []);

  useEffect(() => {
    const handleUnreadCountUpdate = (event) => {
      const { detail } = event;
      if (detail && typeof detail.count === "number") {
        setTotalUnreadCount(detail.count);
      }
    };

    document.addEventListener("unreadCountUpdated", handleUnreadCountUpdate);

    return () => {
      document.removeEventListener(
        "unreadCountUpdated",
        handleUnreadCountUpdate
      );
    };
  }, []);

  useEffect(() => {
    const initialUnreads: Record<string, number> = {};
    notifications.forEach((notif) => {
      initialUnreads[notif.id] = notif.isNew ? 1 : 0;
    });
    setUnreadMessagesMap(initialUnreads);
  }, [notifications]);

  // Update total unread count
  useEffect(() => {
    const total = Object.values(unreadMessagesMap).reduce(
      (sum, count) => sum + count,
      0
    );
    setTotalUnreadCount(total);
  }, [unreadMessagesMap]);

  // Fetch room swap requests
  useEffect(() => {
    const loadRoomSwapRequests = async () => {
      setIsLoading(true);
      try {
        const result = await fetchRoomSwapRequests(activeTab);
        setNotifications(result.notifications);
        setNotificationCount(result.notificationCount);
        setNotificationDetails(result.notificationItems);
      } catch (error) {
        toast({
          title: "Error fetching requests",
          description:
            error.response?.data?.message ||
            "Failed to load room swap requests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomSwapRequests();
  }, [toast, activeTab, searchQuery, userDetails]);

  useEffect(() => {
    const handleRequestUpdate = () => {
      refreshData();
    };

    const handleShowRejectDialog = (event) => {
      const requestId = event.detail.requestId;
      const request = notifications.find((n) => n.id === requestId);
      setSelectedRequest(request);
      setRejectionReason("");
      setShowRejectionDialog(true);
    };

    window.addEventListener("roomSwapRequestUpdated", handleRequestUpdate);
    window.addEventListener("showRejectSwapRequest", handleShowRejectDialog);

    return () => {
      window.removeEventListener("roomSwapRequestUpdated", handleRequestUpdate);
      window.removeEventListener(
        "showRejectSwapRequest",
        handleShowRejectDialog
      );
    };
  }, [notifications]);

  // Refresh data function
  const refreshData = async () => {
    try {
      // Get fresh data from the server
      const response = await roomSwapAPI.getMySwapRequests();

      // Ensure we have both sent and received arrays with proper error handling
      if (!response.data) {
        throw new Error("Invalid response data");
      }

      const sentRequests = response.data.sent || [];
      const receivedRequests = response.data.received || [];

      // Process the data with read/unread status and preserve existing state information
      const processedRequests = [...sentRequests, ...receivedRequests]
        .map((req) => {
          if (!req || !req._id) {
            console.error("Invalid request object:", req);
            return null;
          }

          const isViewed = localStorage.getItem(`viewed_${req._id}`);

          let normalizedStatus = req.status;
          if (
            normalizedStatus === "accepted" ||
            normalizedStatus === "completed"
          ) {
            normalizedStatus = "approved";
          }

          // Find existing notification to preserve any additional state
          const existingNotification = notifications.find(
            (n) => n._id === req._id || n.id === req._id
          );

          return {
            ...req,

            ...(existingNotification || {}),

            isNew: !isViewed,
            status: normalizedStatus,
            originalStatus: req.status, // Storing the original for reference
          };
        })
        .filter((req) => req !== null);

      // Update the notification count
      const newCount = processedRequests.filter(
        (req) => req.status === "pending" && req.isNew
      ).length;

      setNotificationCount(newCount);
      localStorage.setItem("roomSwapNotificationCount", newCount.toString());

      // Update notifications state with the processed data
      setNotifications(processedRequests);

      return processedRequests;
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh room swap requests",
        variant: "destructive",
      });
      return notifications;
    }
  };

  const markAllRequestsAsRead = async (notifications) => {
    try {
      // Mark all as read in local storage first
      notifications.forEach((notification) => {
        localStorage.setItem(
          `viewed_${notification.id || notification._id}`,
          "true"
        );
      });

      // Batch API call to mark all as read
      await roomSwapAPI.markAllRequestsAsViewed();

      return true;
    } catch (error) {
      console.error("Error marking all as read:", error);
      return false;
    }
  };

  const markRequestAsRead = async (id, notifications, setNotifications) => {
    try {
      const notification = notifications.find(
        (n) => n.id === id || n._id === id
      );

      localStorage.setItem(`viewed_${id}`, "true");

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id || n._id === id ? { ...n, isNew: false } : n
        )
      );

      // Send to server
      await roomSwapAPI.markRequestAsViewed(id);

      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return null;
    }
  };

  // Handle clicking on a notification
  const handleNotificationClick = async (notification) => {
    setSelectedRequest(notification);

    // If the notification is new, mark it as read
    if (notification.isNew) {
      const updatedNotification = await markRequestAsRead(
        notification.id || notification._id,
        notifications,
        setNotifications
      );

      // If we successfully marked it as read, update state
      if (updatedNotification) {
        // Update the notification in state
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notification.id || n._id === notification._id
              ? { ...n, isNew: false }
              : n
          )
        );

        // Update unread messages count
        setUnreadMessagesMap((prev) => ({
          ...prev,
          [notification.id || notification._id]: 0,
        }));

        // Also update the selected request to show it's no longer new
        setSelectedRequest({ ...notification, isNew: false });
      }
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // Update local notification state to mark them as not new first
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isNew: false,
        }))
      );

      // Reset unread counts in the UI
      const resetUnreads = {};
      notifications.forEach((notif) => {
        resetUnreads[notif.id] = 0;
      });
      setUnreadMessagesMap(resetUnreads);
      setTotalUnreadCount(0);

      // Now mark all requests as read on the server
      await markAllRequestsAsRead(notifications);

      await refreshData();

      // Show success message to the user
      toast({
        title: "Success",
        description: "All requests marked as read",
        variant: "default",
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all requests as read",
        variant: "destructive",
      });
    }
  };

  // Handle rejecting a swap request
  const handleReject = async (id) => {
    setIsProcessing(true);
    try {
      await roomSwapAPI.rejectSwapRequest(id, rejectionReason);

      // Update the local state
      const updatedNotifications = notifications.map((n) =>
        n.id === id ? { ...n, status: "rejected" } : n
      );
      setNotifications(updatedNotifications);

      toast({
        title: "Request Rejected",
        description: "You have rejected the room exchange request.",
        variant: "destructive",
      });

      setRejectionReason("");
      setShowRejectionDialog(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle viewing notification details
  const handleViewDetails = (notification) => {
    handleNotificationClick(notification);
  };

  // Render notifications list
  const renderNotificationsList = (notifications) => {
    return (
      <NotificationList
        isLoading={isLoading}
        notifications={notifications}
        markAllAsRead={handleMarkAllAsRead}
        handleViewDetails={handleViewDetails}
      />
    );
  };

  const safeTheme = theme === "dark" ? "dark" : "light";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <SwapRequestsMain
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        sortedNotifications={sortedNotifications}
        renderNotificationsList={renderNotificationsList}
        totalUnreadCount={totalUnreadCount}
        setShowChatPanel={setShowChatPanel}
        setSelectedRequest={setSelectedRequest}
      />

      <RoomSwapDetailsDialog
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        notifications={notifications}
        setNotifications={setNotifications}
        userDetails={userDetails}
        refreshData={refreshData}
        setShowRejectionDialog={setShowRejectionDialog}
        setRejectionReason={setRejectionReason}
        setReceiptData={setReceiptData}
        setShowReceiptDialog={setShowReceiptDialog}
        getStatusBadge={getStatusBadge}
      />

      <RejectionDialog
        open={showRejectionDialog}
        onOpenChange={setShowRejectionDialog}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
        onReject={() => handleReject(selectedRequest?.id)}
        isProcessing={isProcessing}
      />

      <SwapReceiptDialog
        showReceiptDialog={showReceiptDialog}
        setShowReceiptDialog={setShowReceiptDialog}
        receiptData={receiptData}
      />

      <ChatPanel
        showChatPanel={showChatPanel}
        setShowChatPanel={setShowChatPanel}
        notifications={notifications}
        setSelectedRequest={setSelectedRequest}
        theme={safeTheme}
        initialUnreadCount={totalUnreadCount}
      />
      <Footer />
    </div>
  );
};

export default Request;
