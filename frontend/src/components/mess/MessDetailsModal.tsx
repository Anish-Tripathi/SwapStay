import React from "react";
import {
  X,
  MapPin,
  Clock,
  Check,
  Phone,
  Mail,
  Clock3,
  Info,
  MessageCircle,
  Star,
} from "lucide-react";

type MessDetailsModalProps = {
  selectedMess: Mess | null;
  currentMess: Mess | null;
  weeklyMenu: Record<number, WeeklyMenu>;
  activeTab: "details" | "menu" | "reviews";
  setActiveTab: (tab: "details" | "menu" | "reviews") => void;
  closeModal: () => void;
  setRegistrationForm: (form: { messId: string }) => void;
  setSwapRequest: (request: {
    preferredMess: string;
    reason: string;
    comments: string;
  }) => void;
};

// Type for meal items
type MealItem = string | string[] | Record<string, string>;
type DailyMeals = Record<string, MealItem>;
type WeeklyMenu = Record<string, DailyMeals>;

// Type for the Mess object
type Mess = {
  id: number;
  name: string;
  type: string;
  location: string;
  weeklyMenu?: Record<string, any>;
  vacancyCount: number;
  timings?: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  rating?: number;
  reviewCount?: number;
  facilities?: string[];
  reviews?: Array<{
    user: string;
    rating: number;
    comment: string;
    date?: string;
  }>;
  hygiene?: {
    score: number;
    details: string[];
  };
  contact?: {
    manager: string;
    phone: string;
    email: string;
    hours: string;
  };
};

const MessDetailsModal: React.FC<MessDetailsModalProps> = ({
  selectedMess,
  currentMess,
  weeklyMenu,
  activeTab,
  setActiveTab,
  closeModal,
  setRegistrationForm,
  setSwapRequest,
}) => {
  const renderMealItems = (items: any): React.ReactNode => {
    if (items == null) {
      return "N/A";
    }

    if (Array.isArray(items)) {
      return items.join(", ");
    }

    if (typeof items === "object") {
      return Object.entries(items)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(", ");
    }

    return String(items);
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "text-yellow-500 dark:text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  if (!selectedMess) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-1">
              {selectedMess.name}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  selectedMess.type === "Veg"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                }`}
              >
                {selectedMess.type}
              </span>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <StarRating rating={selectedMess.rating || 0} />
                <span className="ml-1">
                  {selectedMess.rating || 0}/5 ({selectedMess.reviewCount || 0})
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === "details"
                ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === "menu"
                ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Weekly Menu
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === "reviews"
                ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-4">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800">
                <h4 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">
                  Location & Timing
                </h4>
                <div className="space-y-4 text-gray-800 dark:text-gray-300">
                  <div className="flex items-start">
                    <MapPin
                      className="mr-3 text-purple-600 dark:text-purple-400 mt-1"
                      size={20}
                    />
                    <span>{selectedMess.location}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock
                      className="mr-3 text-purple-600 dark:text-purple-400 mt-1"
                      size={20}
                    />
                    <div>
                      <p>
                        <span className="font-semibold">Breakfast:</span>{" "}
                        {selectedMess.timings?.breakfast || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Lunch:</span>{" "}
                        {selectedMess.timings?.lunch || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Dinner:</span>{" "}
                        {selectedMess.timings?.dinner || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hygiene Info */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                    Hygiene & Cleanliness
                  </h4>
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-sm text-green-800 dark:text-green-300 font-medium">
                    {selectedMess.hygiene?.score || 0}/5
                  </div>
                </div>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {selectedMess.hygiene?.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check
                        size={18}
                        className="mr-3 text-green-600 dark:text-green-400 mt-0.5"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Facilities */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800">
                <h4 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">
                  Facilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMess.facilities?.map((facility, idx) => (
                    <span
                      key={idx}
                      className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800">
                <h4 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">
                  Contact Information
                </h4>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-semibold">Manager:</span>{" "}
                    {selectedMess.contact?.manager || "N/A"}
                  </p>
                  <div className="flex items-center">
                    <Phone
                      className="mr-3 text-purple-600 dark:text-purple-400"
                      size={18}
                    />
                    <span>{selectedMess.contact?.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail
                      className="mr-3 text-purple-600 dark:text-purple-400"
                      size={18}
                    />
                    <span>{selectedMess.contact?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock3
                      className="mr-3 text-purple-600 dark:text-purple-400"
                      size={18}
                    />
                    <span>
                      Office hours: {selectedMess.contact?.hours || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === "menu" && (
            <div className="overflow-x-auto">
              {weeklyMenu[selectedMess.id] ? (
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Day</th>
                      <th className="px-4 py-3 font-semibold">Breakfast</th>
                      <th className="px-4 py-3 font-semibold">Lunch</th>
                      <th className="px-4 py-3 font-semibold">Dinner</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-100">
                    {Object.entries(weeklyMenu[selectedMess.id]).map(
                      ([day, meals], i) => (
                        <tr
                          key={day}
                          className={
                            i % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-purple-50 dark:bg-purple-950"
                          }
                        >
                          <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                            {day}
                          </td>
                          <td className="px-4 py-4">
                            {renderMealItems(meals.breakfast)}
                          </td>
                          <td className="px-4 py-4">
                            {renderMealItems(meals.lunch)}
                          </td>
                          <td className="px-4 py-4">
                            {renderMealItems(meals.dinner)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Info size={40} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Weekly menu information is not available for this mess.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              {selectedMess.reviews && selectedMess.reviews.length > 0 ? (
                <div className="space-y-4">
                  {selectedMess.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-800 shadow-sm rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {review.user}
                          </h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {review.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block p-4 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                    <MessageCircle
                      size={32}
                      className="text-purple-500 dark:text-purple-300"
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-base font-medium">
                    No reviews available for this mess yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {selectedMess.vacancyCount > 0 &&
            (!currentMess || currentMess.id !== selectedMess.id) && (
              <button
                onClick={() => {
                  if (!currentMess) {
                    setRegistrationForm({
                      messId: String(selectedMess.id),
                    });
                  } else {
                    setSwapRequest({
                      preferredMess: String(selectedMess.id),
                      reason: "",
                      comments: "",
                    });
                  }
                  closeModal();
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded py-2 transition-colors"
              >
                {!currentMess
                  ? "Select This Mess"
                  : "You can request swap to this mess"}
              </button>
            )}

          {currentMess && currentMess.id === selectedMess.id && (
            <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded text-center text-purple-800 dark:text-purple-300">
              You are currently assigned to this mess
            </div>
          )}

          {selectedMess.vacancyCount === 0 &&
            (!currentMess || currentMess.id !== selectedMess.id) && (
              <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded text-center text-red-800 dark:text-red-300">
                No vacancies available in this mess
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessDetailsModal;
