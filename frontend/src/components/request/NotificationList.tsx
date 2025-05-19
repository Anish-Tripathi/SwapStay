import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, Calendar, Clock, CheckCircle } from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusBadge,
  getPriorityBadge,
} from "@/utils/roomSwapUtils";
import { NotificationListProps } from "./types/request";

export const NotificationList = ({
  isLoading,
  notifications,
  markAllAsRead,
  handleViewDetails,
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-500">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        <>
          {notifications.some((notification) => notification.isNew) && (
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark all as read
              </Button>
            </div>
          )}

          {notifications.map((notification) => (
            <Card
              key={
                notification.uniqueId ||
                `${notification.id}-${notification.requestType}`
              }
              id={`request-${notification._id}`}
              className={`cursor-pointer hover:shadow-md transition-shadow overflow-hidden border-l-4 dark:bg-gray-800/95 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-gray-800/50 bg-white/90 backdrop-blur-sm ${
                notification.isNew
                  ? "ring-2 ring-purple-300 dark:ring-purple-600/40"
                  : ""
              }`}
              style={{
                borderLeftColor:
                  notification.status === "pending"
                    ? "#EAB308"
                    : notification.status === "approved" ||
                      notification.status === "accepted"
                    ? "#10B981"
                    : notification.status === "completed"
                    ? "#3B82F6"
                    : "#EF4444",
              }}
              onClick={() => handleViewDetails(notification)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="  dark:ring-offset-gray-800"
                      style={{
                        borderLeftColor:
                          notification.status === "pending"
                            ? "#EAB308"
                            : notification.status === "approved" ||
                              notification.status === "accepted"
                            ? "#10B981"
                            : notification.status === "completed"
                            ? "#3B82F6"
                            : "#EF4444",
                      }}
                    >
                      <AvatarImage
                        src={notification.avatar}
                        alt={notification.from || "User"}
                      />
                      <AvatarFallback className="bg-purple-800 text-white font-semibold">
                        {(notification.to || "U")
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <CardTitle className="text-lg font-semibold dark:text-white flex items-center gap-2">
                        {notification.status === "approved" ||
                        notification.originalStatus === "accepted" ||
                        notification.originalStatus === "completed" ? (
                          <span>Room Swap Successful</span>
                        ) : notification.requestType === "sent" ? (
                          `Request to swap with ${notification.to}`
                        ) : (
                          `${notification.from} requested to swap rooms`
                        )}

                        {notification.isNew && (
                          <span className="ml-2 mt-2 text-xs font-medium bg-green-100 text-green-700 px-3 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </CardTitle>

                      <CardDescription className="flex items-center gap-2 mt-1 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(notification.timestamp)}
                        <Clock className="h-3 w-3 ml-2" />
                        {formatTime(notification.timestamp)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(notification.status)}
                    {getPriorityBadge(notification.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4 mt-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 p-4 shadow-sm">
                    {notification.requestType === "sent" ? (
                      <>
                        <div className="mb-3">
                          <p className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                            Your Room
                          </p>
                          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                            {notification.yourRoom}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                            Requesting
                          </p>
                          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                            {notification.roomDetails}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <p className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                            Their Room
                          </p>
                          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                            {notification.roomDetails}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                            They Want
                          </p>
                          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                            {notification.yourRoom}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 text-sm border-t dark:border-gray-700 mt-2 flex justify-between items-center">
                <p className="text-gray-600 dark:text-white line-clamp-1 flex-1 italic dark:bg-gray-700/40 px-2 py-1 rounded-md">
                  <strong>Swap reason:</strong> <span>"</span>
                  {notification.reason}
                  <span>"</span>
                </p>

                {(notification.status === "completed" ||
                  notification.status === "approved") &&
                  notification.recipientAccepted &&
                  notification.requesterAccepted && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 ml-4">
                      <CheckCircle className="h-4 w-4 mt-4" />
                      <span className="text-xs font-medium mr-3 mt-4">
                        Swap Approved
                      </span>
                    </div>
                  )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(notification);
                  }}
                  className="ml-2 mt-3 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-purple-800 rounded-full"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </>
      ) : (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              No matching requests found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Try adjusting your filters or search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
