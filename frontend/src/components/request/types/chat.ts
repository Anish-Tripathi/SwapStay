export interface Notification {
  id: string;
  from: string;
  to: string;
  timestamp: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  requestType: "sent" | "received";
  roomDetails: string;
  avatar?: string;
  toAvatar?: string;
  isNew?: boolean;
}

export interface ApiMessage {
  sender: {
    _id: string;
  };
  text: string;
  timestamp: string;
  _id: string; 
}

export interface ChatMessage {
  sender: "you" | "other";
  text: string;
  time: string;
  messageId?: string;
  isUnread?: boolean;
  timestamp?: Date;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  roomNumber: string;
  swapStatus: string;
  requestId: string;
  requestType: "sent" | "received";
  lastMessageTimestamp?: Date;
  isSwapRequest?: boolean; 
}

export interface ChatPanelProps {
  showChatPanel: boolean;
  setShowChatPanel: (show: boolean) => void;
  notifications: Notification[];
  setSelectedRequest: (request: Notification | null) => void;
  theme?: "light" | "dark";
  initialUnreadCount: number;
  
}

export interface MessageResponse {
  _id: string;
  text: string;
  messages?: ApiMessage[];
}