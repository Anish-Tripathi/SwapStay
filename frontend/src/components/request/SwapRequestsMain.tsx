import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Bell,
  InboxIcon,
  ArrowDownUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import ChatButton from "./ChatButton";
import { roomSwapAPI } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

const SwapRequestsMain = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  notifications,
  sortedNotifications,
  renderNotificationsList,
  totalUnreadCount,
  setShowChatPanel,
  setSelectedRequest,
}) => {
  const [prioritySort, setPrioritySort] = useState("none");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  // Define functions internally instead of receiving them as props
  const navigateToPendingRequest = (requestId) => {
    setActiveTab("pending");
    setSearchQuery("");

    // Find the request and set it as the selected request to open the dialog
    const requestToView = notifications.find((n) => n.id === requestId);
    if (requestToView) {
      setSelectedRequest(requestToView);
    }

    setTimeout(() => {
      const requestElement = document.getElementById(`request-${requestId}`);
      if (requestElement) {
        requestElement.classList.add("highlight-request");
        requestElement.scrollIntoView({ behavior: "smooth" });

        // Remove highlight class after animation completes
        setTimeout(() => {
          requestElement.classList.remove("highlight-request");
        }, 2000);
      }
    }, 100);
  };

  const handleCancelSent = async (id) => {
    try {
      await roomSwapAPI.cancelSwapRequest(id);
      toast({
        title: "Request Cancelled",
        description: "Your room swap request has been successfully cancelled.",
      });
      window.dispatchEvent(new CustomEvent("roomSwapRequestUpdated"));
    } catch (error) {
      console.error("Error canceling request:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to cancel request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptReceived = async (id) => {
    try {
      await roomSwapAPI.acceptReceivedSwapRequest(id);
      toast({
        title: "Room Swap Accepted",
        description:
          "You've accepted the swap request. Your room assignment has been updated.",
      });
      window.dispatchEvent(new CustomEvent("roomSwapRequestUpdated"));
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const showRejectDialog = (id) => {
    window.dispatchEvent(
      new CustomEvent("showRejectSwapRequest", {
        detail: { requestId: id },
      })
    );
  };

  // Function to sort notifications by priority
  const sortByPriority = (notifications) => {
    if (prioritySort === "none") return notifications;

    const priorityOrder = { high: 3, normal: 2, low: 1 };
    return [...notifications].sort((a, b) => {
      if (prioritySort === "high") {
        // Sort all by priority (high to low)
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        if (a.priority === prioritySort && b.priority !== prioritySort)
          return -1;
        if (a.priority !== prioritySort && b.priority === prioritySort)
          return 1;
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });
  };

  // Apply priority sorting to the notifications
  const prioritizedNotifications = sortByPriority(sortedNotifications);

  return (
    <main className="flex-1 py-8 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-400 mb-2 text-center">
            Room Swap Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            Manage your room swap requests. View sent and received requests,
            accept or decline swaps.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-9 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search by name or room..."
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              {/* Priority Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 border-2 border-purple-600 bg-white text-purple-700 hover:bg-purple-50 dark:bg-gray-900 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ArrowDownUp className="h-4 w-4" />
                    <span>Sort</span>
                    {prioritySort !== "none" && (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/80 dark:text-purple-200 dark:border-purple-700">
                        {prioritySort}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-44 border border-purple-200 dark:border-purple-700 dark:bg-gray-900"
                  align="end"
                >
                  <DropdownMenuLabel className="text-purple-600 dark:text-purple-300">
                    Sort by Priority
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-200 dark:bg-purple-700" />

                  {["none", "high", "normal", "low"].map((level) => (
                    <DropdownMenuItem
                      key={level}
                      className={`${
                        prioritySort === level
                          ? "bg-purple-100 text-purple-800 font-semibold dark:bg-purple-900/70 dark:text-purple-200"
                          : "hover:bg-purple-50 dark:hover:bg-gray-800 dark:text-white"
                      } transition-colors focus:bg-purple-50 dark:focus:bg-gray-800`}
                      onClick={() => setPrioritySort(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <ChatButton
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                  setShowChatPanel(true);
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-purple-900 hover:bg-purple-800 dark:bg-purple-800/90 dark:hover:bg-purple-700/90 gap-2 text-white dark:text-purple-100 transition-colors">
                    <Bell className="h-4 w-4" />
                    Pending (
                    {notifications.filter((n) => n.status === "pending").length}
                    )
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 dark:bg-gray-900 dark:border-gray-700"
                  align="end"
                >
                  <DropdownMenuLabel className="dark:text-gray-200">
                    Pending Requests
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <ScrollArea className="h-[300px]">
                    {notifications
                      .filter((n) => n.status === "pending")
                      .slice(0, 5)
                      .map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="p-0 focus:bg-transparent dark:focus:bg-transparent"
                        >
                          <div
                            className="flex flex-col w-full p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRequest(notification);
                              navigateToPendingRequest(notification.id);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={notification.avatar} />
                                <AvatarFallback className="bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                  {notification.requestType === "received"
                                    ? notification.from.charAt(0).toUpperCase()
                                    : "Y"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium dark:text-gray-200">
                                  {notification.requestType === "received"
                                    ? notification.from
                                    : "You"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {notification.requestType === "received"
                                    ? `Room ${
                                        notification.requesterRoomObj
                                          ?.roomNumber || "Unknown"
                                      }`
                                    : `Room ${
                                        notification.requestedRoomObj
                                          ?.roomNumber || "Unknown"
                                      }`}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mt-2 dark:text-gray-300">
                              {notification.requestType === "received"
                                ? "Wants to swap with your room."
                                : `Requested to swap with ${notification.to}'s room.`}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 dark:border-gray-600 dark:text-purple-800 dark:hover:bg-gray-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.requestType === "received"
                                    ? showRejectDialog(notification.id)
                                    : setCancelingId(notification.id);
                                }}
                              >
                                {notification.requestType === "received"
                                  ? "Decline"
                                  : "Cancel"}
                              </Button>
                              {notification.requestType === "received" && (
                                <Button
                                  size="sm"
                                  className="flex-1 bg-purple-700 hover:bg-purple-800 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAcceptingId(notification.id);
                                  }}
                                >
                                  Accept
                                </Button>
                              )}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}

                    {notifications.filter((n) => n.status === "pending")
                      .length === 0 && (
                      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                        <InboxIcon className="mx-auto h-12 w-12 opacity-30 mb-2 dark:text-gray-500" />
                        <p>No pending requests</p>
                      </div>
                    )}
                  </ScrollArea>

                  {notifications.filter((n) => n.status === "pending").length >
                    5 && (
                    <div className="p-2 text-center border-t dark:border-gray-700">
                      <Button
                        variant="link"
                        className="text-purple-700 dark:text-purple-400 w-full hover:text-purple-800 dark:hover:text-purple-300"
                        onClick={() => {
                          setActiveTab("pending");
                          setSearchQuery("");
                          document
                            .getElementById("pendingRequestsSection")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        View all{" "}
                        {
                          notifications.filter((n) => n.status === "pending")
                            .length
                        }{" "}
                        pending requests
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs
            value={activeTab}
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="mb-6 dark:bg-gray-700">
              <TabsTrigger
                value="all"
                className={`dark:data-[state=active]:bg-gray-800 ${
                  activeTab === "all"
                    ? "bg-purple-600 text-white dark:bg-purple-600 dark:text-white"
                    : "dark:text-gray-300"
                }`}
              >
                All Requests
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className={`dark:data-[state=active]:bg-gray-800 ${
                  activeTab === "pending"
                    ? "bg-purple-600 text-white dark:bg-purple-600 dark:text-white"
                    : "dark:text-gray-300"
                }`}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className={`dark:data-[state=active]:bg-gray-800 ${
                  activeTab === "approved"
                    ? "bg-purple-600 text-white dark:bg-purple-600 dark:text-white"
                    : "dark:text-gray-300"
                }`}
              >
                Approved
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className={`dark:data-[state=active]:bg-gray-800 ${
                  activeTab === "rejected"
                    ? "bg-purple-600 text-white dark:bg-purple-600 dark:text-white"
                    : "dark:text-gray-300"
                }`}
              >
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {renderNotificationsList(prioritizedNotifications)}
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              {renderNotificationsList(prioritizedNotifications)}
            </TabsContent>

            <TabsContent value="approved" className="mt-0">
              {renderNotificationsList(prioritizedNotifications)}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              {renderNotificationsList(prioritizedNotifications)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <AlertDialog
        open={acceptingId !== null}
        onOpenChange={() => setAcceptingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="text-yellow-500" size={22} />
              Accept Room Swap?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to accept this room request?
              <br />
              Please ensure to check the room details carefully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex items-center gap-1">
              <XCircle size={16} />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (acceptingId) handleAcceptReceived(acceptingId);
                setAcceptingId(null);
              }}
              className="flex items-center gap-1"
            >
              <CheckCircle size={16} />
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={cancelingId !== null}
        onOpenChange={() => setCancelingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="text-yellow-500" size={22} />
              Cancel Request?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to cancel this room swap request?
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex items-center gap-1">
              <XCircle size={16} />
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancelingId) handleCancelSent(cancelingId);
                setCancelingId(null);
              }}
              className="flex items-center gap-1"
            >
              <CheckCircle size={16} />
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default SwapRequestsMain;
