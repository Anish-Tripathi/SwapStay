import { Link, useNavigate, useLocation } from "react-router-dom";
import notificationAPI from "../../services/notificationAPI";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/components/context/ThemeContext";
import NavbarDesktopMenu from "../navbar/NavbarDesktopMenu";
import NavbarMobileMenu from "../navbar/NavbarMobileMenu";
import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationPanel from "@/components/navbar/NotificationPanel";

export const Navbar = ({}) => {
  let theme = useTheme();
  const location = useLocation();
  const pathname = location.pathname;
  const isResetPasswordPage =
    location.pathname === "/reset-password" ||
    location.pathname.includes("/reset-password/");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDetails, setNotificationDetails] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const currentMode = queryParams.get("mode") || "login";
  const [authMode, setAuthMode] = useState(currentMode);

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(userLoggedIn);

    if (userLoggedIn) {
      // Get user data from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || user.username || "User");
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    setIsNotificationsLoading(true);
    try {
      const notifications = await notificationAPI.getNotifications();
      const transformedNotifications = notifications.map((notification) => {
        return {
          id: notification._id,
          from: notification.title,
          timestamp: notification.createdAt,
          roomDetails: notification.data.roomDetails || "Room swap request",
          message: notification.message,
          isNew: !notification.read,
        };
      });

      setNotificationDetails(transformedNotifications);
      const unreadCount = transformedNotifications.filter(
        (n) => n.isNew
      ).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notifications. Please try again later.",
      });
      setNotificationDetails([]);
      setNotificationCount(0);
    } finally {
      setIsNotificationsLoading(false);
    }
  };
  useEffect(() => {
    const handleNotificationViewed = (event) => {
      if (!event.detail || !event.detail.id) {
        console.error("Invalid notification event:", event);
        return;
      }

      const notificationId = event.detail.id;

      if (!notificationId || notificationId === "undefined") {
        console.error("Invalid notification ID in event:", notificationId);
        return;
      }

      markNotificationAsRead(notificationId);
    };

    const handleAllNotificationsRead = () => {
      markAllAsRead();
    };

    window.addEventListener("roomSwapRequestViewed", handleNotificationViewed);
    window.addEventListener(
      "roomSwapAllRequestsRead",
      handleAllNotificationsRead
    );

    return () => {
      window.removeEventListener(
        "roomSwapRequestViewed",
        handleNotificationViewed
      );
      window.removeEventListener(
        "roomSwapAllRequestsRead",
        handleAllNotificationsRead
      );
    };
  }, [notificationDetails]);

  // Refresh notification data periodically or on focus
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchNotifications();
      }
    };

    window.addEventListener("focus", handleFocus);

    // Refresh every 3 minutes
    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        fetchNotifications();
      }
    }, 180000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(refreshInterval);
    };
  }, [isAuthenticated]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown date";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hours ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7) return `${diffInDays} days ago`;

      // Format date as "Month Day, Year"
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  const markNotificationAsRead = (notificationId) => {
    // Add validation
    if (!notificationId) {
      console.error(
        "Cannot mark notification as read: notification ID is undefined"
      );
      return;
    }

    notificationAPI
      .markAsRead(notificationId)
      .then(() => {
        const updatedNotifications = notificationDetails.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isNew: false }
            : notification
        );

        setNotificationDetails(updatedNotifications);

        // Update count
        const newCount = updatedNotifications.filter((n) => n.isNew).length;
        setNotificationCount(newCount);
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  const markAllAsRead = () => {
    notificationAPI
      .markAllAsRead()
      .then(() => {
        const updatedNotifications = notificationDetails.map(
          (notification) => ({
            ...notification,
            isNew: false,
          })
        );

        // Update the state
        setNotificationDetails(updatedNotifications);
        setNotificationCount(0);

        // Dispatch event for other components
        const markAllReadEvent = new CustomEvent("roomSwapAllRequestsRead");
        window.dispatchEvent(markAllReadEvent);

        // Close dropdown if open
        if (setNotificationsOpen) {
          setNotificationsOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error marking all notifications as read:", error);
      });
  };

  // Handle notification action with API
  const handleNotificationAction = (notificationId, action) => {
    // Mark as read when clicked
    markNotificationAsRead(notificationId);

    // Navigate to requests page with query parameters
    navigate("/notifications");

    // Close dropdown
    setNotificationsOpen(false);
  };
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode") || "login";
    setAuthMode(mode);
  }, [location.search]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("roomSwapNotificationCount");
      localStorage.removeItem("roomSwapNotifications");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      navigate("/auth?mode=login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    if (mode === "login" || mode === "signup" || mode === "activate") {
      navigate(`/auth?mode=${mode}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 dark:from-black dark:via-purple-950 dark:to-gray-950 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/Logo.png"
                alt="SwapStay Logo"
                className="h-11 w-auto transition-transform duration-300 hover:scale-110"
                style={{ height: "60px", width: "70px" }}
              />
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 dark:from-white dark:to-gray-300 ml-8">
                SwapStay
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            {isAuthenticated && (
              <Sheet
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative group">
                    <Bell className="h-4 w-4 group-hover:text-primary transition-colors" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-96 p-0 overflow-hidden dark:bg-gray-900 dark:border-gray-700"
                >
                  <NotificationPanel
                    notificationDetails={notificationDetails}
                    notificationCount={notificationCount}
                    isLoading={isNotificationsLoading}
                    formatTimeAgo={formatTimeAgo}
                    markAllAsRead={markAllAsRead}
                    handleNotificationAction={handleNotificationAction}
                    isMobile={false}
                    viewAllRequests={() => {
                      markAllAsRead();
                      navigate("/notifications");
                    }}
                  />
                </SheetContent>
              </Sheet>
            )}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <NavbarDesktopMenu
            isResetPasswordPage={isResetPasswordPage}
            isAuthenticated={isAuthenticated}
            authMode={authMode}
            switchAuthMode={switchAuthMode}
            userName={userName}
            notificationsOpen={notificationsOpen}
            setNotificationsOpen={setNotificationsOpen}
            notificationCount={notificationCount}
            notificationDetails={notificationDetails}
            isNotificationsLoading={isNotificationsLoading}
            formatTimeAgo={formatTimeAgo}
            markAllAsRead={markAllAsRead}
            handleNotificationAction={handleNotificationAction}
            handleLogout={handleLogout}
            setIsAuthenticated={setIsAuthenticated}
          />
        </div>
      </div>

      <NavbarMobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        handleLogout={handleLogout}
      />
    </nav>
  );
};
