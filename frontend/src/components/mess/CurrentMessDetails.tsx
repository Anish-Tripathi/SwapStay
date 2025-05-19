import {
  MapPin,
  Clock,
  Star,
  Calendar,
  Mail,
  MessageCircle,
} from "lucide-react";

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <Star
            size={16}
            className="absolute top-0 left-0 text-yellow-500"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    } else {
      stars.push(<Star key={i} size={16} className="text-gray-300" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

const CurrentMessDetails = ({ currentMess, openModal }) => {
  if (!currentMess) return null;

  return (
    <div className="lg:col-span-1 mb-5">
      {/* Current Mess Details Card */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-100 dark:border-purple-900">
        <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300">
          Current Mess Details
        </h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
              <MapPin
                size={20}
                className="text-purple-700 dark:text-purple-300"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {currentMess.location}
              </p>
            </div>
          </div>

          {currentMess.timings && (
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                <Clock
                  size={20}
                  className="text-purple-700 dark:text-purple-300"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Meal Timings
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  B: {currentMess.timings.breakfast} | L:{" "}
                  {currentMess.timings.lunch} | D: {currentMess.timings.dinner}
                </p>
              </div>
            </div>
          )}

          {currentMess.rating !== undefined && (
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                <Star
                  size={20}
                  className="text-purple-700 dark:text-purple-300"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Rating
                </p>
                <div className="flex items-center">
                  <StarRating rating={currentMess.rating} />
                  <span className="ml-2 text-gray-800 dark:text-gray-200">
                    {currentMess.rating}/5 ({currentMess.reviewCount || 0}{" "}
                    reviews)
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => openModal(currentMess.id)}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded transition-all duration-200"
          >
            View Full Details
          </button>
        </div>
      </section>

      <section className="bg-purple-50 dark:bg-purple-900/30 rounded-lg shadow-md p-6 border border-purple-100 dark:border-purple-800 mt-6">
        <h2 className="text-xl font-bold mb-3 text-purple-800 dark:text-purple-300">
          Important Notes:
        </h2>

        <ul className="space-y-3">
          <li className="flex items-start">
            <Calendar
              size={18}
              className="text-purple-700 dark:text-purple-400 mr-2 mt-1 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Approved swaps take effect from the 1st day of the next month.
            </span>
          </li>
          <li className="flex items-start">
            <Mail
              size={18}
              className="text-purple-700 dark:text-purple-400 mr-2 mt-1 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Submit this receipt at the Block 7 hostel office for record
              verification.
            </span>
          </li>
          <li className="flex items-start">
            <MessageCircle
              size={18}
              className="text-purple-700 dark:text-purple-400 mr-2 mt-1 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Inform your previous mess office about the change and clear any
              dues.
            </span>
          </li>
          <li className="flex items-start">
            <Clock
              size={18}
              className="text-purple-700 dark:text-purple-400 mr-2 mt-1 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Submit the receipt to the new mess manager to activate your meal
              plan.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default CurrentMessDetails;
