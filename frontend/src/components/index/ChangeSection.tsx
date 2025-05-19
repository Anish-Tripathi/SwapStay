import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ProblemCard } from "./ProblemCard";
import { SolutionCard } from "./SolutionCard";

export const ChangeSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-500 via-purple-100 to-purple-300 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 dark:bg-purple-700 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-700 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-purple-900 dark:text-purple-300 mb-4">
            Ready for a{" "}
            <span className="relative">
              change
              <span className="absolute bottom-0 left-0 w-full h-2 bg-purple-400 dark:bg-purple-500 opacity-50"></span>
            </span>
            ?
          </h2>
          <p className="text-xl text-purple-700 dark:text-purple-300 mb-12 max-w-2xl mx-auto">
            Experience a revolutionary approach to student accommodation swaps
            and guest house bookings.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ProblemCard />
          <SolutionCard />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <h2 className="mt-10 text-3xl font-bold text-purple-800 dark:text-purple-300 mb-4">
          Curious about how SwapStay makes room swapping effortless?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Discover our mission, how it works, and why thousands trust us!
        </p>
        <Button className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 dark:from-purple-700 dark:to-purple-500 dark:hover:from-purple-600 dark:hover:to-purple-400 text-white py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center mx-auto">
          <Link
            to="/about"
            className="text-white flex items-center"
            onClick={() => window.scrollTo(0, 0)}
          >
            <span>About SwapStay</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </Button>
      </motion.div>
    </section>
  );
};
