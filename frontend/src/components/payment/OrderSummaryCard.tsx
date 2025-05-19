import { ChevronRight } from "lucide-react";

const OrderSummaryCard = ({ bookingDetails }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-8 shadow-sm dark:from-indigo-900/30 dark:to-purple-900/30 dark:border dark:border-gray-700">
      <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center dark:text-indigo-200">
        <svg
          className="w-5 h-5 mr-2 dark:text-indigo-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          ></path>
        </svg>
        Order Summary
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg dark:bg-gray-700">
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Room Number
          </p>
          <p className="font-semibold text-indigo-800 text-lg dark:text-indigo-200">
            {bookingDetails.roomNumber}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg dark:bg-gray-700">
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Guest House
          </p>
          <p className="font-semibold text-indigo-800 text-lg dark:text-indigo-200">
            {bookingDetails.guestHouseName}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg dark:bg-gray-700">
          <p className="text-gray-500 text-sm dark:text-gray-400">Guests</p>
          <p className="font-semibold text-indigo-800 text-lg dark:text-indigo-200">
            {bookingDetails.numberOfGuests}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg dark:bg-gray-700">
          <p className="text-gray-500 text-sm dark:text-gray-400">Duration</p>
          <p className="font-semibold text-indigo-800 text-lg dark:text-indigo-200">
            {bookingDetails.numberOfDays} days
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg dark:bg-gray-700">
        <div>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Rate per day
          </p>
          <p className="font-medium dark:text-gray-200">
            ₹{bookingDetails.roomPrice}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <div>
          <p className="text-gray-500 text-sm dark:text-gray-400">Total days</p>
          <p className="font-medium dark:text-gray-200">
            {bookingDetails.numberOfDays}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <div>
          <p className="text-gray-500 text-sm dark:text-gray-400">Amount</p>
          <p className="font-bold text-xl text-indigo-700 dark:text-indigo-300">
            ₹{bookingDetails.totalCost}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
