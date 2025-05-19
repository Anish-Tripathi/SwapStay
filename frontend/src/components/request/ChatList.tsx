import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UnreadCountsResponse {
  counts?: Record<string, number>;
  newCounts?: Record<string, number>;
}

export const ChatList = ({
  theme,
  chatSearchQuery,
  setChatSearchQuery,
  chatContacts,
  activeChatId,
  handleChatSelect,
  unreadCounts,
}) => {
  const [localUnreadCounts, setLocalUnreadCounts] = useState(
    unreadCounts || {}
  );
  const [newMessageCounts, setNewMessageCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optimisticallyCleared, setOptimisticallyCleared] = useState<
    Set<string>
  >(new Set());
  const fetchIntervalRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(false);

  const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // This sends cookies with requests
  });

  // Function to fetch unread counts from the backend
  const fetchUnreadCounts = async () => {
    if (!isMountedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<UnreadCountsResponse>(
        "/messages/unread-count"
      );

      if (response.data) {
        setLocalUnreadCounts((prev) => {
          const newCounts = { ...prev };
          if (response.data.counts) {
            optimisticallyCleared.forEach((chatId) => {
              if (newCounts[chatId] === 0) {
                delete response.data.counts?.[chatId];
              }
            });
            Object.assign(newCounts, response.data.counts);
          }
          return newCounts;
        });

        if (response.data.newCounts) {
          setNewMessageCounts((prev) => {
            const newNewCounts = { ...prev };
            optimisticallyCleared.forEach((chatId) => {
              if (newNewCounts[chatId] === 0) {
                delete response.data.newCounts?.[chatId];
              }
            });
            Object.assign(newNewCounts, response.data.newCounts);
            return newNewCounts;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(
          `Failed to fetch message counts: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unread counts when component mounts or active chat changes
  useEffect(() => {
    isMountedRef.current = true;

    if (!Object.keys(unreadCounts || {}).length) {
      fetchUnreadCounts();
    } else {
      setLocalUnreadCounts(unreadCounts);
    }

    // Set up interval to refresh unread counts every 30 seconds
    fetchIntervalRef.current = setInterval(fetchUnreadCounts, 30000);

    // Clean up interval on component unmount
    return () => {
      isMountedRef.current = false;
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, [unreadCounts]);

  // Update local counts when a chat is selected
  useEffect(() => {
    if (activeChatId) {
      // Add to optimistically cleared set
      setOptimisticallyCleared((prev) => new Set(prev).add(activeChatId));

      // Optimistically update counts
      setLocalUnreadCounts((prev) => ({
        ...prev,
        [activeChatId]: 0,
      }));

      setNewMessageCounts((prev) => ({
        ...prev,
        [activeChatId]: 0,
      }));

      // Clear from optimistically cleared set after 5 seconds
      // (enough time for the backend to confirm)
      const timer = setTimeout(() => {
        setOptimisticallyCleared((prev) => {
          const newSet = new Set(prev);
          newSet.delete(activeChatId);
          return newSet;
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [activeChatId]);

  const displayCounts =
    Object.keys(unreadCounts || {}).length > 0
      ? unreadCounts
      : localUnreadCounts;

  // Filter and sort contacts based on search, new messages first, unread messages second, and recency
  const filteredContacts = chatContacts
    .filter(
      (contact) =>
        contact.name?.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        contact.roomNumber
          ?.toLowerCase()
          .includes(chatSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // First priority: contacts with new messages
      const newA = newMessageCounts[a.id] || 0;
      const newB = newMessageCounts[b.id] || 0;

      if (newA > 0 && newB === 0) return -1;
      if (newA === 0 && newB > 0) return 1;

      // Second priority: contacts with unread messages
      const unreadA = displayCounts[a.id] || 0;
      const unreadB = displayCounts[b.id] || 0;

      if (unreadA > 0 && unreadB === 0) return -1;
      if (unreadA === 0 && unreadB > 0) return 1;

      // Third priority: sort by most recent message timestamp
      if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
        return (
          b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime()
        );
      }

      // Fallback to string time comparison
      return b.lastMessageTime?.localeCompare(a.lastMessageTime || "") || 0;
    });

  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-slate-700">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <h3
          className={`text-lg font-medium mb-2 ${
            theme === "dark" ? "text-purple-300" : "text-purple-900"
          }`}
        >
          Swap Request Conversations
        </h3>
        <Input
          placeholder="Search users..."
          className="mt-2"
          value={chatSearchQuery}
          onChange={(e) => setChatSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(80vh-150px)]">
        {isLoading && filteredContacts.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700 mr-2"></div>
            Loading conversations...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-500">
            {error}
            <button
              onClick={fetchUnreadCounts}
              className="ml-2 text-purple-600 hover:text-purple-800 underline text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {filteredContacts.map((contact) => {
          const unreadCount = displayCounts[contact.id] || 0;
          const newCount = newMessageCounts[contact.id] || 0;
          const hasUnread = unreadCount > 0;
          const hasNewMessages = newCount > 0;
          const isActive = activeChatId === contact.id;

          return (
            <div
              key={contact.id}
              onClick={() => handleChatSelect(contact.id)}
              className={`flex items-center gap-4 p-4 cursor-pointer relative
                ${
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900/30"
                    : hasNewMessages
                    ? "bg-green-100 dark:bg-green-900/20"
                    : hasUnread
                    ? "bg-green-50 dark:bg-green-900/10"
                    : "hover:bg-gray-100 dark:hover:bg-slate-700"
                }
                ${
                  (hasNewMessages || hasUnread) && !isActive
                    ? "border-l-4 border-green-600 dark:border-green-400"
                    : ""
                }
                border-b border-gray-100 dark:border-slate-700`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage
                    src={contact.avatar}
                    onError={(e) => {
                      // Force fallback if the image fails to load
                      e.currentTarget.src = "";
                    }}
                  />
                  <AvatarFallback className="bg-purple-700 text-white">
                    {contact.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Display new message count if available, otherwise show unread count */}
                {!isActive && (
                  <>
                    {hasNewMessages ? (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white hover:bg-green-600 h-6 min-w-6 flex items-center justify-center rounded-full p-1.5">
                        {newCount}
                      </Badge>
                    ) : hasUnread ? (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white hover:bg-green-600 h-6 min-w-6 flex items-center justify-center rounded-full p-1.5 opacity-80">
                        {unreadCount}
                      </Badge>
                    ) : null}
                  </>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p
                    className={`font-medium text-base truncate ${
                      hasNewMessages
                        ? "font-bold"
                        : hasUnread
                        ? "font-semibold"
                        : ""
                    }`}
                  >
                    {contact.name}
                  </p>
                  <span className="text-xs text-gray-500">
                    {contact.lastMessageTime}
                  </span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Room {contact.roomNumber}
                </div>

                {contact.lastMessageText && (
                  <p
                    className={`text-sm truncate ${
                      hasNewMessages
                        ? "text-black font-bold dark:text-white"
                        : hasUnread
                        ? "text-black font-medium dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {contact.requestType === "sent"
                      ? "You: "
                      : `${contact.name}: `}
                    {contact.lastMessageText}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge
                    className={`px-2 py-1 text-xs font-medium ${
                      contact.requestType === "sent"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    }`}
                  >
                    {contact.requestType === "sent" ? "SENT" : "RECEIVED"}
                  </Badge>

                  <Badge
                    className={`px-2 py-1 text-xs font-medium ${
                      contact.swapStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : contact.swapStatus === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {contact.swapStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && filteredContacts.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            {chatContacts.length === 0
              ? "No room swap requests received yet"
              : "No conversations match your search"}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
