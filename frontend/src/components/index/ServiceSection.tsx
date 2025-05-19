import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import { servicesList } from "./ServiceList";

export const ServicesSection = ({ handleProtectedNavigation }) => {
  return (
    <section className="py-24 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 md:mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-300 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Let SwapStay handle the complexities so you can focus on what really
            matters – <strong>your college life</strong>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicesList.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mb-3"
      >
        <h2 className="text-3xl font-bold text-purple-800 mt-10 dark:text-purple-300 mb-4">
          Still waiting? Your perfect room swap is just a click away!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Explore available rooms and make the swap that fits your needs best.
        </p>
        <Button
          className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-700 dark:from-purple-700 dark:to-purple-500 dark:hover:from-purple-600 dark:hover:to-purple-400 text-white py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center mx-auto"
          onClick={() => {
            handleProtectedNavigation("/browse-rooms");
            window.scrollTo(0, 0);
          }}
        >
          <span>Explore & Swap Now!</span>
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
        </Button>
      </motion.div>
    </section>
  );
};
