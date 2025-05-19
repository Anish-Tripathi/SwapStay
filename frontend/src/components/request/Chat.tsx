import { useState, useCallback, useMemo } from "react";
import { ChatList } from "./ChatList";
import { ChatContent } from "./ChatContent";

const Chat = ({
  theme,
  chatSearchQuery,
  setChatSearchQuery,
  chatContacts,
  activeChatId,
  handleChatSelect,
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
  unreadCounts,
  onMarkAsRead,
  retryMessage,
  connectionStatus,
}) => {
  const [hasScrolledToUnread, setHasScrolledToUnread] = useState({});

  // When selecting a chat, mark messages as read if there are unread messages
  const handleChatSelectWithReadMarking = useCallback(
    (chatId) => {
      handleChatSelect(chatId);

      // Only mark as read if there are unread messages and we're actively viewing the chat
      if (unreadCounts[chatId] > 0) {
        setHasScrolledToUnread((prev) => ({ ...prev, [chatId]: false }));
      }
    },
    [handleChatSelect, unreadCounts]
  );

  // Sort contacts to show unread messages first, then by most recent
  const sortedContacts = useMemo(() => {
    return [...chatContacts].sort((a, b) => {
      // First priority: contacts with unread messages
      const unreadA = unreadCounts[a.id] || 0;
      const unreadB = unreadCounts[b.id] || 0;

      if (unreadA > 0 && unreadB === 0) return -1;
      if (unreadA === 0 && unreadB > 0) return 1;

      // Second priority: sort by most recent message
      if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
        return (
          b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime()
        );
      }

      // Fallback to string time comparison
      return b.lastMessageTime?.localeCompare(a.lastMessageTime || "") || 0;
    });
  }, [chatContacts, unreadCounts]);

  return (
    <div className="flex h-full">
      <ChatList
        theme={theme}
        chatSearchQuery={chatSearchQuery}
        setChatSearchQuery={setChatSearchQuery}
        chatContacts={sortedContacts}
        activeChatId={activeChatId}
        handleChatSelect={handleChatSelectWithReadMarking}
        unreadCounts={unreadCounts}
      />
      <ChatContent
        activeChatId={activeChatId}
        activeChat={activeChat}
        isLoadingMessages={isLoadingMessages}
        chatMessagesMap={chatMessagesMap}
        newChatMessage={newChatMessage}
        setNewChatMessage={setNewChatMessage}
        sendChatMessage={sendChatMessage}
        setShowChatPanel={setShowChatPanel}
        messagesEndRef={messagesEndRef}
        notifications={notifications}
        setSelectedRequest={setSelectedRequest}
        onMarkAsRead={onMarkAsRead}
        retryMessage={retryMessage}
        connectionStatus={connectionStatus}
        hasScrolledToUnread={hasScrolledToUnread}
        setHasScrolledToUnread={setHasScrolledToUnread}
      />
    </div>
  );
};

export default Chat;
