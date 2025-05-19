import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl group transition-all duration-300 transform hover:-translate-y-2 p-8 relative overflow-hidden border border-purple-100 dark:border-purple-800"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900 rounded-bl-full -z-10 group-hover:bg-purple-100 dark:group-hover:bg-purple-800 transition-colors duration-300"></div>

      <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500 dark:from-purple-600 dark:to-purple-400 rounded-2xl shadow-lg mb-6 transform group-hover:rotate-3 transition-transform duration-300">
        {service.icon}
      </div>

      <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-4 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">
        {service.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-6 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
        {service.description}
      </p>

      <Link
        to="/about"
        onClick={() => window.scrollTo(0, 0)}
        className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-800 dark:group-hover:text-purple-300 transition-colors duration-300 cursor-pointer"
      >
        <span>Learn more</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Link>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </motion.div>
  );
};
