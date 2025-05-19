
export interface SwapRequest {
  id: string;
  from: string;
  to: string;
  avatar?: string;
  status: string;
  originalStatus?: string;
  requestType: "sent" | "received";
  timestamp: string;
  reason: string;
  recipientAccepted: boolean;
  requesterAccepted: boolean;
  yourRoom: string;
  roomDetails: string;
  roomAmenities: string[];
  yourRoomAmenities: string[];
  userDetails: {
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    year?: string;
    studentId?: string;
    rollNo?: string;
  };
  originalRequest?: {
    rejectionReason?: string;
  };
  requesterRoomObj: {
    floor?: string;
    wing?: string;
    sharing?: string;
    description?: string;
    images?: string[];
  };
  requestedRoomObj: {
    floor?: string;
    wing?: string;
    sharing?: string;
    description?: string;
    images?: string[];
  };
  isRead?: boolean; 
}

export interface SwapRequestDialogProps {
  selectedRequest: SwapRequest | null;
  onOpenChange: (open: boolean) => void;
  onRequestUpdate: () => void;
  onShowRejectDialog: (requestId: string) => void;
  onShowReceipt?: (request: SwapRequest) => void;
}

export interface Notification {
  id: string;
  uniqueId?: string;
  _id: string;
  status: string;
  originalStatus?: string;
  isNew: boolean;
  requestType: string;
  to?: string;
  from?: string;
  timestamp: string;
  priority: string;
  yourRoom: string;
  roomDetails: string;
  reason: string;
  avatar: string;
  recipientAccepted?: boolean;
  requesterAccepted?: boolean;
}

export interface NotificationListProps {
  isLoading: boolean;
  notifications: Notification[];
  markAllAsRead: () => void;
  handleViewDetails: (notification: Notification) => void;
}

export interface RoomDetails {
  _id: string;
  owner: {
    _id: string;
    name: string;
    rollNo: string;
    department: string;
    email: string;
    phone: string;
    year: string;
    profilePicture: string;
  };
  blockType: string;
  blockName: string;
  floor: string;
  roomNumber: string;
  wing: string;
  sharing: string;
  description: string;
  images: string[];
  amenities: string[];
}

export interface RoomDetailsSectionProps {
  selectedRequest: {
    requestType: "sent" | "received";
    yourRoom: string;
    roomDetails: string;
    requesterRoomObj?: RoomDetails; 
    requestedRoomObj?: RoomDetails; 
    yourRoomAmenities?: string[]; 
    roomAmenities?: string[]; 
    reason: string; 
    status: string; 
    originalRequest?: {
      rejectionReason?: string;
      requester?: {
        _id: string;
        name: string;
        rollNo: string;
        department: string;
        email: string;
        phone: string;
        year: string;
        profilePicture: string;
      };
      recipient?: {
        _id: string;
        name: string;
        rollNo: string;
        department: string;
        email: string;
        phone: string;
        year: string;
        profilePicture: string;
      };
    };
    userDetails?: {
      name: string;
      department?: string;
      year?: string;
      studentId?: string;
      rollNo?: string;
      email?: string;
      phone?: string;
    };
    avatar: string;
    timestamp: string;
    to?: string;
    from?: string;
    id: string;
  };
}

