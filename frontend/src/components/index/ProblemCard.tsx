import { motion } from "framer-motion";

export const ProblemCard = () => {
  const problems = [
    "Limited room swap options available",
    "Complicated and time-consuming processes",
    "Long wait times for room availability",
    "Difficulty finding the perfect match for room swaps",
    "Unavailability of guest houses during peak seasons",
    "Lack of a centralized platform for guest house bookings",
    "Rigid menu, timing issues, hygiene concerns, and no easy swaps.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      viewport={{ once: true }}
      className="text-left bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-l-4 border-purple-600"
    >
      <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-6 flex items-center">
        <span className="bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-300 p-2 rounded-full mr-3">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </span>
        Common Challenges Students Face
      </h3>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Students often struggle with finding the right accommodation swaps and
        guest house bookings. Issues include:
      </p>

      <div className="space-y-4 mb-6">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start"
          >
            <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {problem}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
