import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  PlusSquare,
  Search,
  MessageSquare,
  Info,
  ChevronDown,
  Bell,
  Utensils,
  Settings,
  FileText,
  Shield,
  Flag,
  HelpCircle,
  LogOut,
  LogIn,
  UserPlus,
  Key,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationPanel from "./NotificationPanel";
import DeactivateAccountModal from "./DeactivateAccountModal";

const NavbarDesktopMenu = ({
  isResetPasswordPage,
  isAuthenticated,
  authMode,
  switchAuthMode,
  userName,
  notificationsOpen,
  setNotificationsOpen,
  notificationCount,
  notificationDetails,
  isNotificationsLoading,
  formatTimeAgo,
  markAllAsRead,
  handleNotificationAction,
  handleLogout,
  setIsAuthenticated,
}) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {isResetPasswordPage || !isAuthenticated ? (
        // Only show login/signup buttons on reset password page or if not authenticated
        <div className="flex items-center space-x-2">
          <Link
            to="/auth?mode=login"
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
              authMode === "login"
                ? "bg-purple-700 dark:bg-purple-600"
                : "hover:bg-purple-800 dark:hover:bg-gray-700"
            }`}
            onClick={() => switchAuthMode("login")}
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Link>

          <Link
            to="/auth?mode=signup"
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
              authMode === "signup"
                ? "bg-purple-700 dark:bg-purple-600"
                : "hover:bg-purple-800 dark:hover:bg-gray-700"
            }`}
            onClick={() => switchAuthMode("signup")}
          >
            <UserPlus className="h-4 w-4" />
            <span>Signup</span>
          </Link>

          <Link
            to="/auth?mode=activate"
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
              authMode === "activate"
                ? "bg-purple-700 dark:bg-purple-600"
                : "hover:bg-purple-800 dark:hover:bg-gray-700"
            }`}
            onClick={() => switchAuthMode("activate")}
          >
            <Key className="h-4 w-4" />
            <span>Activate</span>
          </Link>
        </div>
      ) : (
        // Authenticated user navigation for non-reset pages
        <>
          <Link
            to="/"
            className="hover:bg-purple-800 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors duration-200"
            style={{ fontSize: "16px" }}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/list-room"
            className="hover:bg-purple-800 dark:hover:bg-gray-700 px-3 py-2 rounded-md font-medium flex items-center gap-3 transition-colors duration-200"
            style={{ fontSize: "16px" }}
          >
            <PlusSquare className="h-4 w-4" />
            <span>List Room</span>
          </Link>

          <Link
            to="/browse-rooms"
            className="hover:bg-purple-800 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors duration-200"
            style={{ fontSize: "16px" }}
          >
            <Search className="h-4 w-4" />
            <span>Browse Rooms</span>
          </Link>

          <Link
            to="/notifications"
            className="hover:bg-purple-800 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors duration-200"
            style={{ fontSize: "16px" }}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Requests</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="hover:bg-purple-800 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors duration-200"
              style={{ fontSize: "16px" }}
            >
              <Info className="h-4 w-4" />
              <span>Explore</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 min-w-[200px] dark:border-gray-700">
              <DropdownMenuItem>
                <Link
                  to="/guest-house"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <Home className="h-4 w-4" />
                  Book Guest House
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/mess"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <Utensils className="h-4 w-4" />
                  Mess Change
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <Info className="h-4 w-4" />
                  About Us
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/terms"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <FileText className="h-4 w-4" />
                  Terms & Conditions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/feedback"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <Shield className="h-4 w-4" />
                  Feedback
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/complain"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <Flag className="h-4 w-4" />
                  Report Complaint
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/faq"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                >
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative group mr-4">
                <Bell className="h-6 w-6 group-hover:text-primary transition-colors" />
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
                  window.location.href = "/notifications";
                }}
              />
            </SheetContent>
          </Sheet>

          {/* User Profile Dropdown */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-800 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="h-10 w-10 rounded-full bg-purple-700 dark:bg-purple-700 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {userName ? userName.charAt(0) : "U"}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 min-w-[200px] dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Welcome, {userName || "User"}
                  </p>
                </div>
                <DropdownMenuItem>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 w-full px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </DropdownMenuItem>
                <DeactivateAccountModal
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}
    </div>
  );
};

export default NavbarDesktopMenu;
