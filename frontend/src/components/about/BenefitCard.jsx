import { motion } from "framer-motion";

export const BenefitCard = ({ benefit, index }) => {
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
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center dark:bg-gray-800"
    >
      <div className="bg-purple-100 p-4 rounded-full mb-6 dark:bg-purple-900">
        {benefit.icon}
      </div>
      <h3 className="text-xl font-bold text-purple-900 mb-3 dark:text-purple-300">
        {benefit.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {benefit.description}
      </p>
    </motion.div>
  );
};
