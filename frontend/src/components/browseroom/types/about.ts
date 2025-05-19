import { ReactNode } from 'react';
export interface User {
  _id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  hasRoom?: boolean;
  profilePicture?: string;
  phone?: string;
  year?: string;
  degree?: string;
  gender?: string;
  theme?: string;
  notificationSettings?: {
    emailNotifications: boolean;
    swapRequests: boolean;
    systemMessages: boolean;
    marketingMessages: boolean;
  };
  createdAt?: string;
}

export interface RoomOwner {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}


export interface UserRoomResponse {
  hasListing: boolean;
  roomDetails?: Room;
}

export interface RoomsResponse {
  success: boolean;
  count: number;
  data: Room[];
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface Room {
  _id: string;
  blockType: string;
  blockName: string;
  floor: string;
  wing: string;
  roomNumber: string;
  sharing: string;
  description: string;
  availableForSwap: boolean;
  amenities: string[];
  images: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  datePosted: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomDetailDialogProps {
  selectedRoom: Room | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  theme: string;
  API_URL: string;
  currentImageIndex: Record<string, number>;
  setCurrentImageIndex?: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  handleSwapRequest: (roomId: string) => void;
  handleChat: (roomId: string) => void;
  pendingSwapRequests: string[];
  incomingSwapRequests: string[];
}

export interface RoomGridProps {
  filteredRooms: Room[];
  theme: string;
  API_URL: string;
  currentImageIndex: Record<string, number>;
  pendingSwapRequests: string[];
  incomingSwapRequests: string[];
  setSelectedRoom: (room: Room) => void;
  prevImage: (roomId: string, imagesLength: number) => void;
  nextImage: (roomId: string, imagesLength: number) => void;
}

export interface RoomDetailsProps {
  selectedRoom: Room;
  theme: string;
  currentImageIndex: Record<string, number>;
  activeIndex: number;
  prevImage: () => void;
  nextImage: () => void;
  API_URL: string;
  getAmenityLabel: (amenity: string) => string;
  children?: ReactNode;
}


export interface SwapRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roomDetails: Room | null;
  swapReason: string;
  setSwapReason: (reason: string) => void;
  isLoading: boolean;
  priority: string;
  setPriority: (priority: string) => void;
}

export  const getAmenityLabel = (code: string) => {
    const amenityMap: Record<string, string> = {
      "0": "WiFi",
      "1": "AC",
      "2": "Attached Bathroom",
      "3": "Balcony",
      "4": "Study Table",
      "5": "Wardrobe",
      "6": "Hot Water",
      "7": "Refrigerator",
      "8": "TV",
    };
    return amenityMap[code] || code;
  };