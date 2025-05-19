import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { Users, Repeat, Building2, Star } from "lucide-react";

const stats = [
  { value: "5,000+", label: "Active Users", icon: Users },
  { value: "3,500+", label: "Successful Swaps", icon: Repeat },
  { value: "30+", label: "Campus Partners", icon: Building2 },
  { value: "4.7/5", label: "User Rating", icon: Star },
];

export const HeroSection = () => {
 
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 text-white py-16 h-screen dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
    
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 text-white rounded-2xl p-6 "
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About SwapStay
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Streamlining student hostel, guest house, and mess swaps with a secure, student-first platform.
          </p>

          <div className="mt-8 inline-flex flex-wrap justify-center gap-2 p-1 bg-purple-200 rounded-full">
            <button
              className="px-4 py-2 text-sm font-medium rounded-full text-purple-800 hover:bg-purple-900 hover:text-white transition-colors duration-200"
              onClick={() =>
                document
                  .getElementById("our-story")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Our Mission
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-full text-purple-800 hover:bg-purple-800 hover:text-white transition-colors duration-200"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How It Works
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-full text-purple-800 hover:bg-purple-800 hover:text-white transition-colors duration-200"
              onClick={() =>
                document
                  .getElementById("benefits")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Benefits
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-full text-purple-800 hover:bg-purple-800 hover:text-white transition-colors duration-200"
              onClick={() =>
                document
                  .getElementById("why-choose")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Why Choose Us
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-full text-purple-800 hover:bg-purple-800 hover:text-white transition-colors duration-200"
              onClick={() =>
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Testimonials
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className=" grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="p-4 rounded-lg bg-purple-200 text-white shadow-lg 
                       hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Icon className="mx-auto mb-4 h-6 w-6 text-purple-800" />
                <p className="text-4xl font-bold text-purple-800">
                  {stat.value}
                </p>
                <p className="text-purple-800 mt-2">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};