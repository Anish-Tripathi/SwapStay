import React, { useState, useEffect } from "react";
import { GuestHouseProvider } from "./GuestHouseContext";
import GuestHouseOverview from "./GuestHouseOverview";
import RoomDetails from "./RoomDetails";
import BookingDialog from "./BookingDialog";
import BookingHistory from "./BookingHistory";
import { useGuestHouse } from "./GuestHouseContext";
import { CalendarCheck } from "lucide-react";

const GuestHouseContent = () => {
  const { selectedGuestHouse, isDialogOpen } = useGuestHouse();
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch user ID from localStorage or context
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(user._id || null);
  }, []);

  return (
    <div className="py-6 bg-purple-200 rounded-lg dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
      <div className="flex justify-between items-center mb-6 px-6 pt-4">
        <h2 className="text-2xl font-bold text-purple-900 dark:text-white">
          {showBookingHistory ? "My Bookings" : "Book a Guest House"}
        </h2>

        {userId && (
          <button
            onClick={() => setShowBookingHistory(!showBookingHistory)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow transition-colors duration-200 flex items-center"
          >
            {showBookingHistory ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Booking
              </>
            ) : (
              <>
                <CalendarCheck className="h-5 w-5 mr-2" />
                My Bookings
              </>
            )}
          </button>
        )}
      </div>

      {/* Conditional rendering based on the selected view */}
      {showBookingHistory ? (
        <div className="bg-white rounded-lg shadow-md p-6 mx-4 mb-4 dark:bg-gray-800">
          <BookingHistory userId={userId} />
        </div>
      ) : (
        <>
          {/* Display either guest house list or room details based on selection */}
          {!selectedGuestHouse ? <GuestHouseOverview /> : <RoomDetails />}

          {/* BookingDialog will render itself conditionally based on isDialogOpen state */}
          <BookingDialog />
        </>
      )}
    </div>
  );
};

export default function WrappedGuestHouseContent() {
  return (
    <GuestHouseProvider>
      <GuestHouseContent />
    </GuestHouseProvider>
  );
}
