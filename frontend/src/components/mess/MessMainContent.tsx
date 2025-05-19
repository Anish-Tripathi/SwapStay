import React from "react";
import { AlertTriangle, MapPin, Clock } from "lucide-react";
import StarRating from "./StarRating";
import CurrentMessDetails from "./CurrentMessDetails";
import { Timing, MessMainContentProps } from "./types/mess";

const renderTimings = (timings: Timing) => {
  return `B: ${timings.breakfast} | L: ${timings.lunch} | D: ${timings.dinner}`;
};

const MessMainContent: React.FC<MessMainContentProps> = ({
  messes,
  currentMess,
  error,
  registrationForm,
  swapRequest,
  handleRegistrationFormChange,
  handleSwapFormChange,
  registerCurrentMess,
  submitSwapRequest,
  openModal,
}) => {
  return (
    <main className="flex-grow container mx-auto p-6 py-8 dark:bg-gray-900 transition-colors duration-200">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 dark:bg-red-900 dark:text-red-300">
          <div className="flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
          Available Messes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {messes.map((mess) => (
            <div
              key={mess.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-purple-100 dark:border-purple-900 hover:shadow-lg transition-all duration-200"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">
                    {mess.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      mess.type === "Veg"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                    }`}
                  >
                    {mess.type}
                  </span>
                </div>

                <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <MapPin
                      size={16}
                      className="mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0"
                    />
                    <span>{mess.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock
                      size={16}
                      className="mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0"
                    />
                    <span className="text-sm">
                      {renderTimings(mess.timings)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <StarRating rating={mess.rating || 0} />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {mess.rating || 0}/5 ({mess.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      mess.vacancyCount > 5
                        ? "text-green-600 dark:text-green-400"
                        : mess.vacancyCount > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {mess.vacancyCount}{" "}
                    {mess.vacancyCount === 1 ? "spot" : "spots"} left
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {mess.facilities &&
                    mess.facilities.slice(0, 3).map((facility, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                </div>

                <button
                  onClick={() => openModal(mess.id)}
                  className="w-full mt-2 bg-purple-600 hover:bg-purple-500 dark:bg-purple-900 dark:hover:bg-purple-800 text-white dark:text-white py-2 rounded transition-all duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Registration or Swap Form */}
        <div className="lg:col-span-1">
          {!currentMess ? (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-100 dark:border-purple-900">
              <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
                Register Mess
              </h2>
              <form onSubmit={registerCurrentMess}>
                <div className="mb-4">
                  <label
                    htmlFor="messId"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Select a Mess
                  </label>
                  <select
                    id="messId"
                    name="messId"
                    value={String(registrationForm.messId)}
                    onChange={handleRegistrationFormChange}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 dark:focus:ring-purple-600 dark:focus:border-purple-600"
                  >
                    <option value="">-- Select Mess --</option>
                    {messes
                      .filter((mess) => mess.vacancyCount > 0)
                      .map((mess) => (
                        <option key={mess.id} value={String(mess.id)}>
                          {mess.name} ({mess.type}) - {mess.location}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 dark:bg-purple-600 dark:hover:bg-purple-700 w-full"
                >
                  Register
                </button>
              </form>
            </section>
          ) : (
            <>
              {/* Swap Request Form */}
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-100 dark:border-purple-900 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
                  Submit New Request
                </h2>

                <form onSubmit={submitSwapRequest}>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Current Mess
                    </label>
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
                      {currentMess.name} ({currentMess.type})
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="preferredMess"
                      className="block text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Select Preferred Mess
                    </label>
                    <select
                      id="preferredMess"
                      name="preferredMess"
                      value={String(swapRequest.preferredMess)}
                      onChange={handleSwapFormChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 dark:focus:ring-purple-600 dark:focus:border-purple-600"
                    >
                      <option value="">-- Select Mess --</option>
                      {messes
                        .filter(
                          (mess) =>
                            mess.vacancyCount > 0 && mess.id !== currentMess.id
                        )
                        .map((mess) => (
                          <option key={mess.id} value={String(mess.id)}>
                            {mess.name} ({mess.type}) - {mess.location}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="reason"
                      className="block text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Reason for Swap
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      value={swapRequest.reason}
                      onChange={handleSwapFormChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 dark:focus:ring-purple-600 dark:focus:border-purple-600"
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="Food Preference">Food Preference</option>
                      <option value="Location Convenience">
                        Location Convenience
                      </option>
                      <option value="Timing Convenience">
                        Timing Convenience
                      </option>
                      <option value="Friends in Other Mess">
                        Friends in Other Mess
                      </option>
                      <option value="Health Reasons">Health Reasons</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="comments"
                      className="block text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={swapRequest.comments}
                      onChange={handleSwapFormChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 dark:focus:ring-purple-600 dark:focus:border-purple-600"
                      placeholder="Any additional information about your swap request..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={!swapRequest.preferredMess || !swapRequest.reason}
                    className={`w-full ${
                      !swapRequest.preferredMess || !swapRequest.reason
                        ? "px-4 py-3 rounded bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "px-4 py-3 rounded bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700"
                    }`}
                  >
                    Request Change
                  </button>
                </form>
              </section>
            </>
          )}
        </div>

        {/* Right Column - CurrentMessDetails component */}
        {currentMess && (
          <CurrentMessDetails currentMess={currentMess} openModal={openModal} />
        )}
      </div>
    </main>
  );
};

export default MessMainContent;
