import React, { useEffect, useState } from "react";
import axios from "axios";

interface UnreadCountResponse {
  counts: { [key: string]: number };
}

const ChatButton = ({ onClick }: { onClick: () => void }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get<UnreadCountResponse>(
          "/api/messages/unread-count"
        );
        const { counts } = response.data;

        const totalUnread = Object.values(counts).reduce(
          (sum, count) => sum + count,
          0
        );

        setUnreadCount(totalUnread);
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = () => {
    setUnreadCount(0);
    onClick();
  };

  return (
    <div className="relative">
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-700 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 shadow z-10">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      <button
        className="flex items-center justify-center gap-2 rounded-full bg-purple-900 hover:bg-purple-700 text-white py-2 px-4 transition-all shadow-md"
        onClick={handleClick}
        aria-label={`Chat ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.383c-1.978-.292-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">Chat</span>
      </button>
    </div>
  );
};

export default ChatButton;
