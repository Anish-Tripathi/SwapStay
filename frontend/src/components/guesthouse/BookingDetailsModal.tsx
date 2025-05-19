import React from "react";
import { format } from "date-fns";
import { Booking } from "./types/booking";
import { useNavigate } from "react-router-dom";

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
  onCancelClick: (booking: Booking) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsProps> = ({
  booking,
  onClose,
  onCancelClick,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a");
  };

  const getNights = () => {
    return Math.ceil(
      (new Date(booking.checkOutDate).getTime() -
        new Date(booking.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const handlePayNow = () => {
    const paymentBookingDetails = {
      roomNumber: booking.roomId?.number || "N/A",
      numberOfGuests: booking.numberOfGuests,
      numberOfDays: getNights(),
      totalCost: booking.totalPrice || 0,
      studentName: booking.studentName,
      guestNames: Array.isArray(booking.guestNames)
        ? booking.guestNames.join(", ")
        : booking.guestNames,
      guestHouseName: booking.guestHouseId?.name,
      roomPrice: booking.roomId?.price,
      bookingId: booking._id,
    };

    navigate("/payment", {
      state: {
        bookingDetails: paymentBookingDetails,
      },
    });
  };

  const isFutureBooking = new Date(booking.checkInDate) > new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white rounded-t-xl dark:from-purple-800 dark:to-indigo-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold dark:text-gray-100">
                Booking Details
              </h3>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs dark:bg-gray-700 dark:bg-opacity-30">
                  #{booking._id.slice(-8).toUpperCase()}
                </span>
                <div
                  className={`h-2 w-2 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400 dark:bg-green-500"
                      : booking.status === "cancelled"
                      ? "bg-red-400 dark:bg-red-500"
                      : "bg-yellow-400 dark:bg-yellow-500"
                  }`}
                />
                <span className="text-sm capitalize dark:text-gray-200">
                  {booking.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 dark:bg-gray-800">
          {/* Show alert if check-in date has passed */}
          {!isFutureBooking && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 dark:bg-yellow-900/30 dark:border-yellow-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400 dark:text-yellow-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    {booking.status === "pending"
                      ? "You can no longer complete this booking as the check-in date has passed."
                      : "This booking's check-in date has already passed."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Summary Card */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Check-in
                </p>
                <p className="font-semibold dark:text-gray-200">
                  {formatDate(booking.checkInDate)}
                </p>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-500"></div>
                <div className="mx-3 text-center">
                  <span className="block text-xl font-bold text-purple-600 dark:text-purple-400">
                    {getNights()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    NIGHTS
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-500"></div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Check-out
                </p>
                <p className="font-semibold dark:text-gray-200">
                  {formatDate(booking.checkOutDate)}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  ₹{booking.totalPrice?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div className="bg-white px-3 py-1 rounded-md border border-gray-200 dark:bg-gray-600 dark:border-gray-500">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Payment
                </p>
                <p
                  className={`font-medium capitalize ${
                    booking.paymentStatus === "completed"
                      ? "text-green-600 dark:text-green-400"
                      : booking.paymentStatus === "failed"
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {booking.paymentStatus || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Accommodation Details */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 dark:bg-purple-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold dark:text-gray-200">
                    Accommodation
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Guest House
                    </p>
                    <p className="font-medium dark:text-gray-200">
                      {booking.guestHouseId?.name || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Room
                    </p>
                    <p className="font-medium dark:text-gray-200">
                      {booking.roomId?.number || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Type
                    </p>
                    <p className="font-medium dark:text-gray-200">
                      {booking.roomId?.type || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Capacity
                    </p>
                    <p className="font-medium dark:text-gray-200">
                      {booking.roomId?.capacity || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 dark:bg-blue-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold dark:text-gray-200">
                    Timeline
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Created
                    </p>
                    <p className="font-medium dark:text-gray-200">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Updated
                    </p>
                    <p className="font-medium dark:text-gray-200">
                      {formatDateTime(booking.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Guest Information */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 dark:bg-green-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold dark:text-gray-200">
                    Guest Info
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Primary Guest
                    </p>
                    <p className="font-medium dark:text-gray-200">
                      {booking.studentName || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Guests
                    </p>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-300">
                      {booking.numberOfGuests || "N/A"}
                    </span>
                  </div>
                  {booking.guestNames && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1 dark:text-gray-300">
                        Guest Names
                      </p>
                      <div className="space-y-1">
                        {Array.isArray(booking.guestNames) ? (
                          booking.guestNames.map((name, index) => (
                            <div key={index} className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 dark:bg-purple-400"></span>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {name || "N/A"}
                              </p>
                            </div>
                          ))
                        ) : typeof booking.guestNames === "string" ? (
                          booking.guestNames.split(",").map((name, index) => (
                            <div key={index} className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 dark:bg-purple-400"></span>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {name.trim() || "N/A"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            N/A
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              {booking.paymentStatus === "completed" && (
                <div className="bg-white p-5 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 dark:bg-amber-900/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-600 dark:text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold dark:text-gray-200">
                      Payment
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Transaction ID
                      </p>
                      <p className="font-medium text-sm dark:text-gray-200">
                        {booking.paymentId}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Amount
                      </p>
                      <p className="font-medium dark:text-gray-200">
                        ₹{booking.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Method
                      </p>
                      <p className="font-medium capitalize dark:text-gray-200">
                        {booking.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Close
            </button>

            {booking.status === "pending" && isFutureBooking && (
              <button
                onClick={handlePayNow}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-800"
              >
                Pay Now
              </button>
            )}

            {["pending", "confirmed"].includes(booking.status) &&
              isFutureBooking && (
                <button
                  onClick={() => onCancelClick(booking)}
                  className={`px-5 py-2.5 rounded-lg transition-colors duration-200 ${
                    booking.status === "pending"
                      ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                      : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  }`}
                >
                  {booking.status === "pending"
                    ? "Cancel Request"
                    : "Cancel Booking"}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
