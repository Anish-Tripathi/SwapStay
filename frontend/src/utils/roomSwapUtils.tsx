import { roomSwapAPI } from "@/services/api";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

export const getAmenityName = (code) => {
  const codeStr = String(code).toLowerCase();

  const amenityMap = {
    bath: "Attached Bathroom",
    study: "Study Table",
    bal: "Balcony",
    wifi: "Wi-Fi",
    hot: "Hot Water",
    ac: "Air Conditioning",

    "0": "Wi-Fi",
    "1": "Attached Bathroom",
    "2": "Study Table",
    "3": "Balcony",
    "4": "Air Conditioning",
    "5": "Hot Water",
  };

  return amenityMap[codeStr] || `Amenity ${code}`;
};

export const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
        >
          Pending
        </Badge>
      );
    case "approved":
    case "accepted":
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
        >
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        >
          Rejected
        </Badge>
      );
    default:
      return null;
  }
};

export const getPriorityBadge = (priority) => {
  switch (priority) {
    case "high":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
          High Priority
        </Badge>
      );
    case "normal":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30">
          Normal
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30">
          Low
        </Badge>
      );
    default:
      return null;
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const transformRoomSwapRequests = (responseData) => {
  const transformedSent = Array.isArray(responseData.sent)
    ? responseData.sent.map((req) => {
        const requestedRoom = req.requestedRoom || {};
        const requesterRoom = req.requesterRoom || {};
        const roomOwner = requestedRoom.owner || {};

        let normalizedStatus = req.status;
        const isApprovedOrCompleted =
          normalizedStatus === "accepted" ||
          normalizedStatus === "completed" ||
          normalizedStatus === "approved";

        if (isApprovedOrCompleted) {
          normalizedStatus = "approved";
        }

        return {
          id: req._id,
          uniqueId: req._id,
          from: "You",
          to: roomOwner.name || "Unoccupied Room",

          avatar:
            roomOwner.profilePicture && roomOwner.profilePicture !== ""
              ? `http://localhost:5000${roomOwner.profilePicture}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  roomOwner.name || "User"
                )}&background=6d28d9&color=fff`,

          roomDetails: `${requestedRoom.blockName || ""} ${
            requestedRoom.roomNumber || ""
          } ${requestedRoom.floor ? `(Floor ${requestedRoom.floor})` : ""} ${
            requestedRoom.wing ? `Wing ${requestedRoom.wing}` : ""
          }`.trim(),
          timestamp: req.createdAt,
          status: normalizedStatus,
          originalStatus: req.status,
          priority: req.priority || "medium",
          reason: req.reason,
          requestType: "sent",
          recipientAccepted: req.recipientAccepted || false,
          requesterAccepted: req.requesterAccepted || true,
          swapPartner: roomOwner.name || "Unoccupied Room", // Add this for clarity
          userDetails: {
            name: roomOwner.name || "Unoccupied Room",
            email: roomOwner.email || "",
            phone: roomOwner.phone || "",
            currentRoom: `${requestedRoom.blockName || ""} ${
              requestedRoom.roomNumber || ""
            }`.trim(),
            department: roomOwner.department || "",
            year: roomOwner.year || "",
            studentId: roomOwner.rollNo || "",
          },
          yourRoom: `${requesterRoom.blockName || ""} ${
            requesterRoom.roomNumber || ""
          }`.trim(),
          roomImage:
            requestedRoom.images && requestedRoom.images.length > 0
              ? `http://localhost:5000${requestedRoom.images[0]}`
              : "/api/placeholder/400/320",
          roomAmenities:
            requestedRoom.amenities && requestedRoom.amenities.length > 0
              ? requestedRoom.amenities.map((code) => getAmenityName(code))
              : ["Study Desk", "Window View", "Wi-Fi"],
          yourRoomAmenities:
            requesterRoom.amenities && requesterRoom.amenities.length > 0
              ? requesterRoom.amenities.map((code) => getAmenityName(code))
              : ["Study Desk", "Window View", "Wi-Fi"],
          requestedRoomObj: requestedRoom,
          requesterRoomObj: requesterRoom,
          originalRequest: req,
          isNew: !req.viewed,
        };
      })
    : [];

  // Transform received requests
  const transformedReceived = Array.isArray(responseData.received)
    ? responseData.received.map((req) => {
        const requesterRoom = req.requesterRoom || {};
        const requestedRoom = req.requestedRoom || {};
        const requesterDetails = req.requesterDetails || req.requester || {};

        // Check if this request has been viewed before
        const isRequestNew = !req.viewed;

        let normalizedStatus = req.status;
        const isApprovedOrCompleted =
          normalizedStatus === "accepted" ||
          normalizedStatus === "completed" ||
          normalizedStatus === "approved";

        if (isApprovedOrCompleted) {
          normalizedStatus = "approved";
        }

        return {
          id: req._id,
          uniqueId: req._id,
          from: requesterDetails.name || "Unknown User",
          to: "You",
          avatar: requesterDetails.profilePicture
            ? `http://localhost:5000${requesterDetails.profilePicture}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                requesterDetails.name || "User"
              )}&background=6d28d9&color=fff`,
          roomDetails: `${requesterRoom.blockName || ""} ${
            requesterRoom.roomNumber || ""
          } ${requesterRoom.floor ? `(Floor ${requesterRoom.floor})` : ""} ${
            requesterRoom.wing ? `Wing ${requesterRoom.wing}` : ""
          }`.trim(),
          timestamp: req.createdAt,
          swapPartner: requesterDetails.name || "Unknown User",
          status: normalizedStatus,
          originalStatus: req.status,
          priority: req.priority || "medium",
          reason: req.reason,
          requestType: "received",
          recipientAccepted: req.recipientAccepted || false,
          requesterAccepted: req.requesterAccepted || true,
          userDetails: {
            name: requesterDetails.name || "Unknown User",
            email: requesterDetails.email || "",
            phone: requesterDetails.phone || "",
            currentRoom: `${requesterRoom.blockName || ""} ${
              requesterRoom.roomNumber || ""
            }`.trim(),
            department: requesterDetails.department || "",
            year: requesterDetails.year || "",
            studentId:
              requesterDetails.rollNo || requesterDetails.studentId || "",
          },
          yourRoom: `${requestedRoom.blockName || ""} ${
            requestedRoom.roomNumber || ""
          }`.trim(),
          roomImage:
            requesterRoom.images && requesterRoom.images.length > 0
              ? `http://localhost:5000${requesterRoom.images[0]}`
              : "/api/placeholder/400/320",
          roomAmenities:
            requesterRoom.amenities && requesterRoom.amenities.length > 0
              ? requesterRoom.amenities.map((code) => getAmenityName(code))
              : ["Study Desk", "Window View", "Wi-Fi"],
          yourRoomAmenities:
            requestedRoom.amenities && requestedRoom.amenities.length > 0
              ? requestedRoom.amenities.map((code) => getAmenityName(code))
              : ["Study Desk", "Window View", "Wi-Fi"],
          requestedRoomObj: requestedRoom,
          requesterRoomObj: requesterRoom,
          originalRequest: req,
          isNew: isRequestNew,
        };
      })
    : [];

  return { transformedSent, transformedReceived };
};

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get("/api/users/me");

    if (response && response.data && (response.data as any).data) {
      const userData = (response.data as any).data;
      return {
        name: userData.name || "Current User",
        avatar: userData.profilePicture
          ? `http://localhost:5000${userData.profilePicture}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              userData.name || "Current User"
            )}&background=6d28d9&color=fff`,
      };
    }
    return {
      name: "Current User",
      avatar: `https://ui-avatars.com/api/?name=User&background=6d28d9&color=fff`,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return {
      name: "Current User",
      avatar: `https://ui-avatars.com/api/?name=User&background=6d28d9&color=fff`,
    };
  }
};

export const fetchRoomSwapRequests = async (activeTab) => {
  try {
    const filterParam = activeTab !== "all" ? activeTab : "";
    const response = await roomSwapAPI.getMySwapRequests(filterParam);

    if (!response || !response.data) {
      throw new Error("Invalid response from API");
    }

    const { transformedSent, transformedReceived } = transformRoomSwapRequests(
      response.data
    );

    // Create notification details with requester names
    const pendingReceivedRequests = transformedReceived.filter(
      (req) => req.status === "pending" && req.isNew === true
    );

    // Update notification count with only new/unread requests
    const notificationCount = pendingReceivedRequests.length;

    // Create notification details with requester names
    const notificationItems = pendingReceivedRequests.map((req) => ({
      id: req.id,
      from: req.from,
      roomDetails: req.roomDetails,
      timestamp: req.timestamp,
      isNew: true, // Flag to mark as new/unread
    }));

    const combinedNotifications = [...transformedSent, ...transformedReceived];

    const uniqueMap = new Map();
    combinedNotifications.forEach((item) => {
      // If we already have this request and current one is newer OR
      // current one is "received" (higher precedence), replace it
      const existing = uniqueMap.get(item.id);
      if (
        !existing ||
        new Date(item.timestamp) > new Date(existing.timestamp) ||
        (item.requestType === "received" && existing.requestType === "sent")
      ) {
        uniqueMap.set(item.id, item);
      }
    });

    const uniqueNotifications = Array.from(uniqueMap.values());

    return {
      notifications: uniqueNotifications,
      notificationCount,
      notificationItems,
    };
  } catch (error) {
    console.error("Error fetching room swap requests:", error);
    throw error;
  }
};

export const filterNotifications = (notifications, activeTab, searchQuery) => {
  return notifications.filter((notification) => {
    // First filter by tab if not "all"
    if (activeTab !== "all") {
      if (activeTab === "approved") {
        const isApproved =
          notification.status === "approved" ||
          notification.originalStatus === "completed" ||
          notification.originalStatus === "accepted";

        if (!isApproved) {
          return false;
        }
      } else if (activeTab === "pending") {
        // Only pending status
        if (notification.status !== "pending") {
          return false;
        }
      } else if (activeTab === "rejected") {
        // Only rejected status
        if (notification.status !== "rejected") {
          return false;
        }
      }
    }

    // Then filter by search query if present
    if (!searchQuery) return true;

    // Search logic
    if (notification.requestType === "sent") {
      return (
        notification.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.roomDetails
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    } else {
      return (
        notification.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.roomDetails
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
  });
};

export const sortNotifications = (notifications) => {
  return [...notifications].sort((a, b) => {
    // First sort by isNew status
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    // Then sort by timestamp (most recent first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const markRequestAsRead = async (
  id,
  setNotifications,
  notificationCount,
  setNotificationCount,
  setNotificationDetails,
  toast
) => {
  try {
    await roomSwapAPI.markRequestAsViewed(id);

    // Update local state to mark this notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === id ? { ...n, isNew: false } : n))
    );

    // Update notification count
    const updatedCount = Math.max(0, notificationCount - 1);
    setNotificationCount(updatedCount);

    // Update notification details
    setNotificationDetails((prevDetails) =>
      prevDetails.filter((item) => item.id !== id)
    );

    // Dispatch custom event for Navbar to update
    const requestViewedEvent = new CustomEvent("roomSwapRequestViewed", {
      detail: { notificationId: id, updatedCount },
    });
    window.dispatchEvent(requestViewedEvent);
    localStorage.setItem(`viewed_${id}`, "true");
  } catch (error) {
    console.error("Error marking notification as read:", error);
    toast({
      title: "Error",
      description: "Failed to mark notification as read",
      variant: "destructive",
    });
  }
};

export const markAllRequestsAsRead = async (
  notifications,
  setNotifications,
  toast,
  userDetails,
  refreshData
) => {
  try {
    await axios.put("/api/rooms/swap-requests/view-all");

    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isNew: false,
    }));

    setNotifications(updatedNotifications);

    window.dispatchEvent(new CustomEvent("roomSwapAllRequestsRead"));

    toast({
      title: "Success",
      description: "All requests marked as read",
      variant: "default",
    });

    await refreshData();
  } catch (error) {
    console.error("Error marking all as read:", error);
    toast({
      title: "Error",
      description: "Failed to mark all requests as read",
      variant: "destructive",
    });
  }
};

export const rejectSwapRequest = async (
  id,
  rejectionReason,
  setNotifications,
  setRejectionReason,
  setShowRejectionDialog,
  setSelectedRequest,
  setIsProcessing,
  toast
) => {
  setIsProcessing(true);
  try {
    await roomSwapAPI.rejectSwapRequest(id, rejectionReason);

    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === id ? { ...n, status: "rejected" } : n
      )
    );

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
      description: error.response?.data?.message || "Failed to reject request",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};

export const fetchUnreadMessageCount = async () => {
  try {
    const response = await axios.get("/api/messages/unread/count");
    return (response.data as { count: number }).count;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};
