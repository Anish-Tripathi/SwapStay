import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  ArrowDownCircle,
  Info,
} from "lucide-react";

export const ChatContent = ({
  activeChatId,
  activeChat,
  isLoadingMessages,
  chatMessagesMap,
  newChatMessage,
  setNewChatMessage,
  sendChatMessage,
  setShowChatPanel,
  messagesEndRef,
  notifications,
  setSelectedRequest,
  onMarkAsRead,
  retryMessage,
  connectionStatus,
  hasScrolledToUnread,
  setHasScrolledToUnread,
}) => {
  const unreadDividerRef = useRef(null);
  const inputRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollAreaRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(null);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [firstUnreadIndex, setFirstUnreadIndex] = useState(-1);
  const [showHint, setShowHint] = useState(false);

  // Fetch unread messages count and status from backend
  const fetchUnreadStatus = async () => {
    if (!activeChatId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/messages/${activeChatId}/read`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUnreadMessages(data.unreadMessages || []);
        setUnreadCount(data.unreadCount || 0);
        setLastReadTimestamp(data.lastReadTimestamp || null);
      }
    } catch (error) {
      console.error("Error fetching unread status:", error);
    }
  };

  const isMessageUnread = (msg) => {
    if (!msg || msg.sender === "you") return false; // Your own messages are never unread

    // First message in a conversation should be marked as unread by default
    const isFirstMessage =
      currentMessages.length === 1 &&
      msg === currentMessages[0] &&
      msg.sender !== "you";

    // If we have a lastReadTimestamp, use that to determine unread status
    if (lastReadTimestamp) {
      const msgTime = new Date(msg.timestamp || msg.time).getTime();
      const lastRead = new Date(lastReadTimestamp).getTime();
      return msgTime > lastRead;
    }

    // For the first message or if isRead is explicitly false
    return isFirstMessage || msg.isRead === false;
  };

  // Auto-fetch unread status when entering a chat
  useEffect(() => {
    if (activeChatId) {
      fetchUnreadStatus();
      setHasMarkedAsRead(false);

      // Add this block to correctly handle new conversation initialization
      const currentMessages = chatMessagesMap[activeChatId] || [];
      if (currentMessages.length === 1 && currentMessages[0].sender !== "you") {
        // If this is a new conversation with just one message from the other person
        setFirstUnreadIndex(0);
        setUnreadCount(1);
      }

      // Focus input when chat changes
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) return;

    const hintKey = `swapHintShown_${activeChatId}`;
    const isNewRequest = !localStorage.getItem(hintKey);

    if (isNewRequest && activeChat?.isSwapRequest) {
      setShowHint(true);
      localStorage.setItem(hintKey, "true");

      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [activeChatId, activeChat?.isSwapRequest]);

  // Get current messages for the active chat
  const currentMessages = chatMessagesMap[activeChatId] || [];

  // Process messages to add unread flag
  const processedMessages = currentMessages.map((msg) => {
    // Ensure timestamp is available by using time field as fallback
    if (!msg.timestamp && msg.time) {
      try {
        const today = new Date();
        const [time, period] = msg.time.split(" ");
        const [hours, minutes] = time.split(":");

        let hour = parseInt(hours);
        if (period && period.toLowerCase() === "pm" && hour < 12) hour += 12;
        if (period && period.toLowerCase() === "am" && hour === 12) hour = 0;

        today.setHours(hour, parseInt(minutes), 0);
        msg.timestamp = today;
      } catch (e) {
        console.warn("Couldn't parse time string:", msg.time);
      }
    }

    return {
      ...msg,
      isUnread: isMessageUnread(msg),
    };
  });

  useEffect(() => {
    const findFirstUnreadIndex = () => {
      if (!processedMessages || !processedMessages.length) return -1;

      const index = processedMessages.findIndex((msg) => msg.isUnread);

      return index;
    };

    const unreadIndex = findFirstUnreadIndex();
    setFirstUnreadIndex(unreadIndex);
  }, [processedMessages, lastReadTimestamp]);

  // Count unread messages
  const countUnreadMessages = () => {
    if (unreadCount > 0) return unreadCount;
    return processedMessages.filter((msg) => msg.isUnread).length;
  };

  // Mark messages as read in the backend
  const markMessagesAsRead = async () => {
    if (!activeChatId || hasMarkedAsRead) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/messages/${activeChatId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setLastReadTimestamp(data.lastReadTimestamp);
        setHasMarkedAsRead(true);
        setUnreadMessages([]);
        setUnreadCount(0);
        setFirstUnreadIndex(-1);

        if (onMarkAsRead) {
          onMarkAsRead(activeChatId, data.lastReadTimestamp);
        }
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Handle scroll events
  const handleScroll = (e) => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceFromBottom < 10;
    setIsAtBottom(atBottom);
    setShowScrollToBottom(distanceFromBottom > 200);

    // Mark messages as read when scrolling through unread messages
    if (activeChatId && !hasMarkedAsRead && countUnreadMessages() > 0) {
      const unreadMessagesCount = countUnreadMessages();
      if (unreadMessagesCount > 0 && unreadDividerRef.current) {
        const rect = unreadDividerRef.current.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isVisible) {
          markMessagesAsRead();
        }
      }
    }
  };

  // Keep scroll at bottom when new messages arrive if already at bottom
  useEffect(() => {
    if (activeChatId && isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [processedMessages, activeChatId, isAtBottom]);

  // Scroll to first unread message or bottom
  useEffect(() => {
    if (
      !activeChatId ||
      !processedMessages.length ||
      hasScrolledToUnread[activeChatId]
    )
      return;

    const timeoutId = setTimeout(() => {
      if (firstUnreadIndex >= 0 && unreadDividerRef.current) {
        unreadDividerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }

      setHasScrolledToUnread((prev) => ({ ...prev, [activeChatId]: true }));
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [
    activeChatId,
    firstUnreadIndex,
    processedMessages,
    hasScrolledToUnread,
    setHasScrolledToUnread,
  ]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = () => {
    if (newChatMessage.trim()) {
      sendChatMessage(activeChatId);
      setNewChatMessage("");
      inputRef.current?.focus();

      // Mark as read when sending a message
      if (!hasMarkedAsRead) {
        markMessagesAsRead();
      }

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  if (!activeChatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center ml-20">
          <MessageSquare size={64} className="mx-auto mb-6 opacity-30" />
          <p className="text-lg">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  const unreadMessagesCount = countUnreadMessages();

  return (
    <div className="w-2/3 flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={activeChat?.avatar} />
            <AvatarFallback className="bg-purple-700 text-white">
              {activeChat?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-lg">{activeChat?.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Room {activeChat?.roomNumber}
              </span>
              <Badge
                className={`px-2 py-0.5 text-xs font-medium ${
                  activeChat?.swapStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : activeChat?.swapStatus === "approved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {activeChat?.swapStatus?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {activeChat?.swapStatus === "pending" && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white mr-7"
              onClick={() => {
                setShowChatPanel(false);
                const request = notifications.find(
                  (n) => n.id === activeChat.id
                );
                if (request) setSelectedRequest(request);
              }}
            >
              {activeChat?.requestType === "received"
                ? "Review Request"
                : "View Request"}
            </Button>
          )}
        </div>
      </div>

      {/* Chat message area */}
      <ScrollArea
        className="flex-1 p-4 relative"
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {processedMessages.map((msg, i) => {
              const isYourMessage = msg.sender === "you";
              const isUnread = msg.isUnread;
              const messageId =
                msg.messageId || `${msg.time}-${msg.text?.substring(0, 10)}`;

              // Only show divider before the first unread message
              const showUnreadDivider =
                (i === firstUnreadIndex &&
                  !isYourMessage &&
                  firstUnreadIndex >= 0 &&
                  unreadMessagesCount > 0) ||
                // Show for first message in conversation that's not from you
                (processedMessages.length === 1 && i === 0 && !isYourMessage);

              return (
                <React.Fragment key={messageId}>
                  {showUnreadDivider && (
                    <div
                      ref={unreadDividerRef}
                      className="flex items-center justify-center my-4 sticky top-0 z-10"
                      data-testid="unread-divider"
                    >
                      <div className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full shadow-sm animate-pulse">
                        {unreadMessagesCount} new message
                        {unreadMessagesCount > 1 ? "s" : ""}
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg max-w-[80%] relative ${
                      isYourMessage
                        ? "ml-auto bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
                    } ${isUnread ? "border-l-2 border-green-500" : ""}`}
                    data-unread={isUnread ? "true" : "false"} // Debug attribute
                  >
                    <div className="text-base">{msg.text}</div>
                    <div
                      className={`text-xs mt-2 flex items-center ${
                        isYourMessage
                          ? "text-purple-200"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {msg.time}
                      {isYourMessage && msg.status === "failed" && (
                        <button
                          onClick={() => retryMessage(msg, activeChatId)}
                          className="ml-2 text-red-300 hover:text-red-100"
                          title="Retry sending"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                      {isUnread && !isYourMessage && (
                        <span className="ml-2 text-green-400 font-medium animate-pulse">
                          • New
                        </span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}

        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-purple-100 dark:bg-purple-900 p-2 rounded-full shadow-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-all"
            aria-label="Scroll to bottom"
          >
            <ArrowDownCircle
              size={20}
              className="text-purple-600 dark:text-purple-300"
            />
          </button>
        )}
      </ScrollArea>

      {showHint && (
        <div className="px-4 pt-2 animate-fade-in">
          <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded-xl p-4 text-sm flex items-start border border-purple-200 dark:border-purple-700 shadow-md">
            <Info
              className="flex-shrink-0 mr-3 mt-1 text-purple-500 dark:text-purple-300"
              size={18}
            />
            <div className="flex-1">
              <p className="font-semibold mb-1">
                Helpful Tip for Swap Requests
              </p>
              <p>
                To improve the chances of your request being accepted, please
                mention your current room number, along with a brief reason for
                the swap.
                <br />
                <em>
                  Example: "Hi! I’d like to swap my Room A111, Himalaya with
                  your room because it's closer to my department."
                </em>
              </p>
            </div>
            <button
              onClick={() => setShowHint(false)}
              className="ml-3 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
              aria-label="Dismiss hint"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message input area */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex space-x-2 dark:text-purple-800">
          <Input
            ref={inputRef}
            type="text"
            value={newChatMessage}
            onChange={(e) => setNewChatMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-purple-700 hover:bg-purple-800"
            disabled={connectionStatus !== "connected"}
          >
            <Send size={18} />
          </Button>
        </div>
        {connectionStatus !== "connected" && (
          <div className="mt-2 text-sm text-red-500 flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            Connection lost. Trying to reconnect...
          </div>
        )}
      </div>
    </div>
  );
};
