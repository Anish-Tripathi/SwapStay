export interface Booking {
  _id: string;
  guestHouseId: {
    _id: string;
    name: string;
    
  };
  roomId: {
    _id: string;
    name: string;
    type: string;
    capacity: number;
    number: string;
    price: number; 
  };
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  studentName: string;
  numberOfGuests: number;
  guestNames?: string;
  paymentId?: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
   
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface BookingResponse {
  bookings: Booking[];
  pagination: Pagination;
}

export interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  activeTab: string;
  pagination: Pagination;
  onTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onViewDetails: (booking: Booking) => void;
  onGenerateReceipt: (booking: Booking) => void;
  onCancelClick: (booking: Booking) => void;
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
}