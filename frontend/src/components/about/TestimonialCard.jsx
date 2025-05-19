import { motion } from "framer-motion";

export const TestimonialCard = ({ testimonial, index }) => {
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
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="bg-purple-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700"
    >
      <div className="flex items-center mb-6">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-16 h-15 rounded-full mr-4"
        />
        <div>
          <h4 className="text-lg font-bold text-purple-900 dark:text-purple-300">
            {testimonial.name}
          </h4>
          <p className="text-purple-600 dark:text-purple-400">
            {testimonial.position}
          </p>
        </div>
      </div>
      <p className="text-gray-700 italic mb-4 dark:text-gray-300">
        "{testimonial.quote}"
      </p>
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </motion.div>
  );
};
