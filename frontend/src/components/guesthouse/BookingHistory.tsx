import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingList from "./BookingList";
import { Booking, Pagination, BookingResponse } from "./types/booking";
import { ConfirmationDialog } from "./ConfirmationDialog";
import Receipt from "../payment/Receipt";
import BookingDetailsModal from "./BookingDetailsModal";

const BookingHistory = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const fetchBookings = async (status: string, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Special case for pending approvals
      const params =
        status === "pending"
          ? {
              status: "pending",
              page,
              limit: pagination.limit,
              sortBy: "createdAt",
              sortOrder: "desc",
            }
          : {
              status,
              page,
              limit: pagination.limit,
              sortBy: "checkInDate",
              sortOrder: status === "past" ? "desc" : "asc",
            };

      const response = await axios.get<BookingResponse>(
        `/api/bookings/user/${userId}`,
        { params }
      );

      setBookings(response.data.bookings);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch booking history. Please try again later.");
      setLoading(false);
      console.error("Error fetching booking history:", err);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
      fetchBookings(activeTab, newPage);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPagination({ ...pagination, page: 1 });
    fetchBookings(tab, 1);
  };

  const handleGenerateReceipt = (booking: Booking) => {
    setReceiptBooking(booking);
    setShowReceipt(true);

    // Determine payment method based on booking data
    if (booking.paymentMethod) {
      setPaymentMethod(booking.paymentMethod);
    } else {
      setPaymentMethod("card");
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    if (userId) {
      fetchBookings(activeTab);
    }
  }, [userId]);

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking);
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    try {
      await axios.post(`/api/bookings/${bookingToCancel._id}/cancel`);
      fetchBookings(activeTab, pagination.page);
      setShowCancelConfirm(false);
    } catch (err) {
      setError("Failed to cancel booking. Please try again.");
      setShowCancelConfirm(false);
    }
  };

  return (
    <div>
      <BookingList
        bookings={bookings}
        loading={loading}
        error={error}
        activeTab={activeTab}
        pagination={pagination}
        onTabChange={handleTabChange}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        onGenerateReceipt={handleGenerateReceipt}
        onCancelClick={handleCancelClick}
      />

      {isModalOpen && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={closeModal}
          onCancelClick={handleCancelClick}
        />
      )}

      {showReceipt && receiptBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Receipt
              bookingDetails={{
                roomNumber: receiptBooking.roomId?.number || "N/A",
                numberOfGuests: receiptBooking.numberOfGuests,
                numberOfDays: Math.ceil(
                  (new Date(receiptBooking.checkOutDate).getTime() -
                    new Date(receiptBooking.checkInDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ),
                totalCost: receiptBooking.totalPrice || 0,
                studentName: receiptBooking.studentName,
                guestNames: Array.isArray(receiptBooking.guestNames)
                  ? receiptBooking.guestNames.join(", ")
                  : receiptBooking.guestNames,
                guestHouseName: receiptBooking.guestHouseId?.name,
                roomPrice: receiptBooking.roomId?.price,
              }}
              paymentMethod={paymentMethod}
              navigate={() => setShowReceipt(false)}
            />
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showCancelConfirm}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
        paymentStatus={bookingToCancel?.paymentStatus}
      />
    </div>
  );
};

export default BookingHistory;
