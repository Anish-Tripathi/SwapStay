import { motion } from "framer-motion";

export const SolutionCard = () => {
  const solutions = [
    "Extensive network of available rooms",
    "Streamlined, user-friendly process",
    "Real-time availability updates",
    "Smart matching algorithm for perfect fits",
    "Instant guest house booking with availability tracking",
    "A centralized platform for all student accommodation needs",
    "View mess details, real-time menu updates, hygiene ratings, and easy swaps.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      viewport={{ once: true }}
      className="text-left bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-l-4 border-green-500"
    >
      <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-6 flex items-center">
        <span className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 p-2 rounded-full mr-3">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        The SwapStay Solution
      </h3>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Join SwapStay today for seamless room swaps and hassle-free guest house
        bookings.
      </p>

      <div className="space-y-4 mb-8">
        {solutions.map((solution, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start"
          >
            <div className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {solution}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
