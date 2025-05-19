import React from "react";
import { Bell, RefreshCw, BellOff, Archive } from "lucide-react";

import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NotificationPanel = ({
  notificationDetails,
  notificationCount,
  isLoading,
  formatTimeAgo,
  markAllAsRead,
  handleNotificationAction,
  isMobile,
  viewAllRequests,
}) => {
  return (
    <>
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200 p-6">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {notificationCount > 0 && (
              <Badge className="bg-white dark:bg-gray-200 text-purple-600 dark:text-gray-800 ml-2">
                {notificationCount} new
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
      </div>

      <div className="px-6 pt-4 bg-purple-200 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
            Recent
          </p>
          {notificationCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-purple-800 hover:text-blue-700 dark:text-purple-300 dark:hover:text-purple-800"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="pb-6 bg-purple-200 space-y-3 max-h-[70vh] overflow-y-auto dark:bg-gray-900">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-700"></div>
            </div>
          ) : notificationDetails.length > 0 ? (
            notificationDetails.map((notification) => (
              <div
                key={notification.id}
                className={`${
                  notification.isNew
                    ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
                    : "bg-white dark:bg-gray-800/50 border-l-4 border-slate-300 dark:border-slate-700"
                } p-4 rounded-lg shadow-sm transform transition-all hover:translate-x-1 hover:shadow-md cursor-pointer`}
                onClick={() =>
                  handleNotificationAction(notification.id, "view")
                }
              >
                <div className="flex items-start">
                  <div
                    className={`${
                      notification.isNew
                        ? "bg-blue-100 dark:bg-blue-800"
                        : "bg-slate-100 dark:bg-slate-700"
                    } p-2 rounded-full mr-3`}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        notification.isNew
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {notification.message || "New swap request"}
                        {/* {notification.from &&
                          notification.from.trim() !== "" && (
                            <span>
                              {" "}
                              from{" "}
                              <span className="font-semibold">
                                {notification.from}
                              </span>
                            </span>
                          )} */}
                      </p>
                      {notification.isNew && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-800/50 dark:text-blue-300 dark:border-blue-700"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatTimeAgo(notification.timestamp)}
                    </p>
                    {notification.roomDetails &&
                      notification.roomDetails.trim() !== "" && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Room: {notification.roomDetails}
                        </p>
                      )}
                    <div className="flex mt-3 gap-2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-l-4 border-slate-300 dark:border-slate-600 p-4 rounded-lg shadow-sm opacity-75 text-center flex flex-col items-center space-y-2">
              <BellOff className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No new notifications
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t dark:border-gray-700 px-6 py-4 bg-slate-50 dark:bg-gray-800">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 w-full justify-center"
          onClick={viewAllRequests}
        >
          <Archive className="h-4 w-4 mr-2" />
          View All Requests
        </Button>
      </div>
    </>
  );
};

export default NotificationPanel;
