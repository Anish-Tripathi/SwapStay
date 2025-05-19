import React, { useEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import socket from "../../utils/socketClient";
import Chat from "./Chat";
import axios from "axios";
import { debounce } from "lodash";
import {
  ApiMessage,
  ChatMessage,
  ChatContact,
  ChatPanelProps,
  MessageResponse,
} from "./types/chat";

const createDebouncedMarkAsRead = () => {
  const markAsReadRequests = new Map();

  const makeMarkAsReadRequest = async (chatId) => {
    if (markAsReadRequests.has(chatId)) {
      return markAsReadRequests.get(chatId);
    }

    try {
      const requestPromise = axios.put(`/api/messages/${chatId}/read`);
      markAsReadRequests.set(chatId, requestPromise);

      // Await the result
      const result = await requestPromise;
      return result;
    } catch (error) {
      console.error(
        `Error marking messages as read for chat ${chatId}:`,
        error
      );

      return { success: false, error };
    } finally {
      setTimeout(() => {
        markAsReadRequests.delete(chatId);
      }, 1000);
    }
  };

  return debounce(makeMarkAsReadRequest, 500, {
    leading: true,
    trailing: false,
  });
};

const ChatPanel: React.FC<ChatPanelProps> = ({
  showChatPanel,
  setShowChatPanel,
  notifications,
  setSelectedRequest,
  theme = "light",
  initialUnreadCount,
}) => {
  const [chatContacts, setChatContacts] = useState<ChatContact[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessagesMap, setChatMessagesMap] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [newChatMessage, setNewChatMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [totalUnreadCount, setTotalUnreadCount] = useState(initialUnreadCount);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [sentMessageIds, setSentMessageIds] = useState<Set<string>>(new Set());
  const [unreadMessagesMap, setUnreadMessagesMap] = useState<
    Record<string, number>
  >({});
  const [lastSeenTimestamps, setLastSeenTimestamps] = useState<
    Record<string, Date>
  >({});
  const [networkStatus, setNetworkStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connected");

  const debouncedMarkAsRead = useRef(createDebouncedMarkAsRead()).current;
  const pendingMarkAsReadOps = useRef({}).current;

  useEffect(() => {
    const handleOnline = () => setNetworkStatus("connected");
    const handleOffline = () => setNetworkStatus("disconnected");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const updateParentUnreadCount = useCallback((count: number) => {
    const event = new CustomEvent("unreadCountUpdated", {
      detail: { count },
      bubbles: true,
    });
    document.dispatchEvent(event);

    // Also update local state
    setTotalUnreadCount(count);
  }, []);

  // Generate chat contacts from notifications
  const generateChatContacts = useCallback(() => {
    if (!notifications || notifications.length === 0) return [];

    // Include both sent and received requests
    return notifications.map((request) => {
      const timestamp = new Date(request.timestamp);
      const now = new Date();
      const isToday = timestamp.toDateString() === now.toDateString();
      const timeString = isToday
        ? timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : timestamp.toLocaleDateString([], { weekday: "long" });

      // Determine the contact name based on request type
      const contactName =
        request.requestType === "sent" ? request.to : request.from;
      const contactAvatar =
        request.requestType === "sent" ? request.avatar : request.avatar;

      return {
        id: request.id,
        name: contactName,
        avatar:
          contactAvatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            contactName
          )}&background=6d28d9&color=fff`,
        lastMessage:
          request.reason ||
          (request.requestType === "sent"
            ? "You sent a room swap request"
            : "Sent you a room swap request"),
        lastMessageTime: timeString,
        unread: request.isNew ? 1 : 0,
        roomNumber: request.roomDetails,
        swapStatus: request.status,
        requestId: request.id,
        requestType: request.requestType,
        isSwapRequest: true,
      };
    });
  }, [notifications]);

  useEffect(() => {
    const newTotalUnread = Object.values(unreadMessagesMap).reduce(
      (sum, count) => sum + count,
      0
    );
    updateParentUnreadCount(newTotalUnread);
  }, [unreadMessagesMap, updateParentUnreadCount]);

  useEffect(() => {
    if (notifications.length > 0) {
      setChatContacts(generateChatContacts());
    }
  }, [notifications, generateChatContacts]);

  // Setup socket listeners
  useEffect(() => {
    const messageHandler = (message) => {
      try {
      } catch (error) {
        console.error("Error handling incoming message:", error);
      }
    };

    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
    };
  }, [activeChatId, sentMessageIds, showChatPanel, lastSeenTimestamps]);

  // Join room when active chat changes
  useEffect(() => {
    if (activeChatId) {
      socket.emit("join-room", activeChatId);

      // Get previous unread count for this contact
      const prevUnread =
        chatContacts.find((c) => c.id === activeChatId)?.unread || 0;

      if (prevUnread > 0) {
        axios
          .put(`/api/messages/${activeChatId}/read`)
          .catch((err) =>
            console.error("Error marking messages as read:", err)
          );

        setChatContacts((prev) => {
          const updatedContacts = prev.map((contact) =>
            contact.id === activeChatId ? { ...contact, unread: 0 } : contact
          );
          return updatedContacts;
        });

        // Calculate new total unread count in a separate effect
        setUnreadMessagesMap((prev) => ({
          ...prev,
          [activeChatId]: 0,
        }));
      }
    }
  }, [activeChatId, chatContacts]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessagesMap, activeChatId]);

  // Helper function to format message times
  const formatMessageTime = (date, offsetMinutes = 0) => {
    const adjustedDate = new Date(date.getTime() + offsetMinutes * 60000);
    const now = new Date();
    const isToday = adjustedDate.toDateString() === now.toDateString();

    if (isToday) {
      return adjustedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return `${adjustedDate.toLocaleDateString([], {
        weekday: "short",
      })}, ${adjustedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const loadChatMessages = useCallback(
    async (contactId: string) => {
      setIsLoadingMessages(true);
      try {
        const response = await axios.get<ApiMessage[]>(
          `/api/messages/${contactId}`
        );

        const currentUserId = localStorage.getItem("userId");
        const lastSeen = lastSeenTimestamps[contactId] || new Date(0);

        // Find the most recent message to update contact info
        let mostRecentMessage = null;
        let mostRecentTimestamp = null;

        const messagesArray = Array.isArray(response.data)
          ? response.data
          : (response.data as MessageResponse).messages || [];
        const formattedMessages: ChatMessage[] = messagesArray.map((msg) => {
          const isFromOther = msg.sender._id !== currentUserId;
          const messageDate = new Date(msg.timestamp);
          const isUnread = isFromOther && messageDate > lastSeen;

          // Track most recent message for updating contact
          if (!mostRecentTimestamp || messageDate > mostRecentTimestamp) {
            mostRecentMessage = msg;
            mostRecentTimestamp = messageDate;
          }

          return {
            sender: isFromOther ? "other" : "you",
            text: msg.text,
            time: formatMessageTime(messageDate),
            messageId: msg._id,
            isUnread,
            timestamp: messageDate,
          };
        });

        setChatMessagesMap((prev) => ({
          ...prev,
          [contactId]: formattedMessages,
        }));

        // Update contact with most recent message info if available
        if (mostRecentMessage) {
          setChatContacts((prevContacts) => {
            return prevContacts.map((contact) => {
              if (contact.id === contactId) {
                return {
                  ...contact,
                  lastMessage: mostRecentMessage.text,
                  lastMessageTime: formatMessageTime(mostRecentTimestamp),
                  lastMessageTimestamp: mostRecentTimestamp,
                };
              }
              return contact;
            });
          });
        }

        // Update unread count
        const unreadCount = formattedMessages.filter((m) => m.isUnread).length;
        setUnreadMessagesMap((prev) => ({ ...prev, [contactId]: unreadCount }));
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [toast, lastSeenTimestamps]
  );

  const handleChatSelect = async (contactId) => {
    setActiveChatId(contactId);
    const now = new Date();

    try {
      setLastSeenTimestamps((prev) => ({ ...prev, [contactId]: now }));
      setUnreadMessagesMap((prev) => ({ ...prev, [contactId]: 0 }));

      await axios.put(`/api/messages/${contactId}/read`);

      setChatMessagesMap((prev) => ({
        ...prev,
        [contactId]: (prev[contactId] || []).map((msg) => ({
          ...msg,
          isUnread: false,
        })),
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
      setUnreadMessagesMap((prev) => ({
        ...prev,
        [contactId]: prev[contactId] || 0,
      }));
    }

    if (!chatMessagesMap[contactId]) {
      loadChatMessages(contactId);
    }
  };

  const sendChatMessage = async (chatId) => {
    if (!newChatMessage.trim()) return;

    try {
      // Send message to API first
      const response = await axios.post<MessageResponse>("/api/messages", {
        roomSwapId: chatId,
        text: newChatMessage,
      });

      // Add to tracking set to avoid duplicate messages
      if (response.data._id) {
        setSentMessageIds((prev) => new Set(prev).add(response.data._id));
      }

      const now = new Date();
      socket.emit("send-message", {
        ...response.data,
        timestamp: now.toISOString(),
      });

      const newMessage = {
        sender: "you",
        text: newChatMessage,
        time: formatMessageTime(now),
        messageId: response.data._id,
        timestamp: now,
      };

      setChatMessagesMap((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));

      setChatContacts((prevContacts) => {
        return prevContacts.map((contact) => {
          if (contact.id === chatId) {
            return {
              ...contact,
              lastMessage: newChatMessage,
              lastMessageTime: formatMessageTime(now),
              lastMessageTimestamp: now,
            };
          }
          return contact;
        });
      });

      // Clear the input
      setNewChatMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = useCallback(
    async (chatId) => {
      if (!chatId) return;

      try {
        setUnreadMessagesMap((prev) => ({ ...prev, [chatId]: 0 }));
        setLastSeenTimestamps((prev) => ({ ...prev, [chatId]: new Date() }));

        setChatMessagesMap((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || []).map((msg) => ({
            ...msg,
            isUnread: false,
          })),
        }));

        pendingMarkAsReadOps[chatId] = true;

        // Clear tracking
        delete pendingMarkAsReadOps[chatId];
      } catch (error) {
        console.error("Error in handleMarkAsRead:", error);
      }
    },
    [debouncedMarkAsRead, pendingMarkAsReadOps]
  );

  // Add retry logic for failed network operations
  const retryOperation = useCallback(
    async (operation, chatId, message = null) => {
      try {
        if (operation === "markAsRead" && !pendingMarkAsReadOps[chatId]) {
          await handleMarkAsRead(chatId);
        } else if (operation === "sendMessage" && message) {
        }
      } catch (error) {
        console.error(`Failed to retry ${operation}:`, error);
      }
    },
    [handleMarkAsRead, pendingMarkAsReadOps]
  );

  // Check for and retry pending operations when coming back online
  useEffect(() => {
    if (networkStatus === "connected") {
      // Retry any pending mark-as-read operations
      Object.keys(pendingMarkAsReadOps).forEach((chatId) => {
        retryOperation("markAsRead", chatId);
      });
    }
  }, [networkStatus, pendingMarkAsReadOps, retryOperation]);

  const activeChat = activeChatId
    ? chatContacts.find((contact) => contact.id === activeChatId)
    : null;

  return (
    <Dialog open={showChatPanel} onOpenChange={setShowChatPanel}>
      <DialogTitle className="sr-only">Chat Panel</DialogTitle>
      <DialogContent
        className={`sm:max-w-[850px] h-[80vh] flex flex-col p-0 ${
          theme === "dark" ? "bg-slate-800 text-white border-slate-700" : ""
        }`}
      >
        <Chat
          theme={theme}
          chatSearchQuery={chatSearchQuery}
          setChatSearchQuery={setChatSearchQuery}
          chatContacts={chatContacts.map((contact) => ({
            ...contact,
            unread: unreadMessagesMap[contact.id] || 0,
          }))}
          activeChatId={activeChatId}
          handleChatSelect={handleChatSelect}
          activeChat={
            activeChat
              ? {
                  ...activeChat,
                  unread: unreadMessagesMap[activeChat.id] || 0,
                  isSwapRequest: activeChat.isSwapRequest, // Pass through the flag
                }
              : null
          }
          isLoadingMessages={isLoadingMessages}
          chatMessagesMap={chatMessagesMap}
          newChatMessage={newChatMessage}
          setNewChatMessage={setNewChatMessage}
          sendChatMessage={sendChatMessage}
          setShowChatPanel={setShowChatPanel}
          messagesEndRef={messagesEndRef}
          notifications={notifications}
          setSelectedRequest={setSelectedRequest}
          unreadCounts={unreadMessagesMap}
          onMarkAsRead={handleMarkAsRead}
          retryMessage={retryOperation}
          connectionStatus={networkStatus}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChatPanel;
