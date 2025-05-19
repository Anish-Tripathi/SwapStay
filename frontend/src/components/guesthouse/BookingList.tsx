import React from "react";
import { format } from "date-fns";
import { Booking, Pagination, BookingListProps } from "./types/booking";

const formatPrice = (price: number) => {
  return `₹${price.toFixed(2)}`;
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM dd, yyyy");
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "completed":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  loading,
  error,
  activeTab,
  pagination,
  onTabChange,
  onPageChange,
  onViewDetails,
  onGenerateReceipt,
  onCancelClick,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        {/* Tab navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex -mb-px space-x-8 overflow-x-auto">
            <button
              onClick={() => onTabChange("upcoming")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "upcoming"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => onTabChange("pending")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "pending"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => onTabChange("active")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "active"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500"
              }`}
            >
              Active Stays
            </button>
            <button
              onClick={() => onTabChange("past")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "past"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500"
              }`}
            >
              Past Stays
            </button>
            <button
              onClick={() => onTabChange("cancelled")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "cancelled"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500"
              }`}
            >
              Cancelled
            </button>
          </nav>
        </div>

        {/* Booking list */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              No bookings found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {activeTab === "upcoming"
                ? "You don't have any upcoming bookings."
                : activeTab === "pending"
                ? "You don't have any pending bookings."
                : activeTab === "past"
                ? "You don't have any past bookings."
                : "No bookings match this filter."}
            </p>
            {activeTab !== "upcoming" && (
              <button
                onClick={() => onTabChange("upcoming")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
              >
                Check upcoming bookings
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 ease-in-out bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  {/* Left column */}
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                      {booking.guestHouseId?.name || "Guest House"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {booking.roomId?.number || "Room"}
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Check-in
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {formatDate(booking.checkInDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Check-out
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {formatDate(booking.checkOutDate)}
                        </p>
                      </div>
                      {activeTab !== "pending" && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Nights
                          </p>
                          <p className="text-sm font-medium dark:text-gray-200">
                            {Math.ceil(
                              (new Date(booking.checkOutDate).getTime() -
                                new Date(booking.checkInDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                          </p>
                        </div>
                      )}
                      {activeTab === "pending" && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Requested on
                          </p>
                          <p className="text-sm font-medium dark:text-gray-200">
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                      {activeTab !== "pending" && (
                        <p className="font-medium text-lg text-gray-900 dark:text-gray-100">
                          {formatPrice(booking.totalPrice)}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2 md:items-end">
                      <button
                        onClick={() => onViewDetails(booking)}
                        className="w-full md:w-auto px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Details
                      </button>

                      <div className="flex flex-wrap w-full md:w-auto gap-2 justify-start md:justify-end">
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => onGenerateReceipt(booking)}
                            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 text-sm rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Receipt
                          </button>
                        )}

                        {["pending", "confirmed"].includes(booking.status) &&
                          new Date(booking.checkInDate) > new Date() && (
                            <button
                              onClick={() => onCancelClick(booking)}
                              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-1 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && bookings.length > 0 && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300 order-2 sm:order-1">
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span>{" "}
              bookings
            </div>
            <nav className="flex items-center space-x-1 order-1 sm:order-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-2 py-1 rounded-md flex items-center justify-center ${
                  pagination.page === 1
                    ? "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
                aria-label="Previous page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                      pageNum === pagination.page
                        ? "bg-purple-600 dark:bg-purple-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={
                      pageNum === pagination.page ? "page" : undefined
                    }
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-2 py-1 rounded-md flex items-center justify-center ${
                  pagination.page === pagination.pages
                    ? "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
                aria-label="Next page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;
