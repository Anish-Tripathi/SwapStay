import { Home, ArrowRight, AlertTriangle } from "lucide-react";

const RoomListingCard = () => {
  return (
    <div className="max-w-3xl mx-auto shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[470px] transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 relative">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Home size={128} />
        </div>
        <h2 className="text-2xl sm:text-2xl font-bold text-white mb-3 flex items-center">
          <Home className="mr-3 h-6 w-6" />
          List Your Room First
        </h2>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 px-6 py-6 flex flex-col items-center justify-center gap-8">
        {/* Alert Box */}
        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-lg w-full">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 " />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-200">
                Room Required
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                Before exploring available room swap opportunities, you'll need
                to add your current room to our system.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="w-full">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
              1
            </div>
            <div className="ml-3 text-gray-700 dark:text-gray-300">
              List your room details
            </div>
          </div>
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
              2
            </div>
            <div className="ml-3 text-gray-700 dark:text-gray-300">
              Browse available rooms
            </div>
          </div>
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
              3
            </div>
            <div className="ml-3 text-gray-700 dark:text-gray-300">
              Request a swap
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => (window.location.href = "/list-room")}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          List Your Room
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default RoomListingCard;
