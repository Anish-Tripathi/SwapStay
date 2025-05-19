import { motion } from "framer-motion";

export const ProcessStep = ({ step, index, total, color = "purple" }) => {
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

  const colorSchemes = {
    purple: {
      gradient: "from-purple-700 to-purple-500 dark:from-purple-900 dark:to-purple-700",
      icon: "bg-purple-800 dark:bg-purple-950",
      text: "text-purple-100 dark:text-purple-200",
      titleText: "text-purple-100 dark:text-purple-200", 
      subtitleText: "text-purple-200 dark:text-purple-300", 
      line: "bg-purple-200 dark:bg-purple-700"
    },
    blue: {
      gradient: "from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-700",
      icon: "bg-blue-800 dark:bg-blue-950",
      text: "text-blue-100 dark:text-blue-200",
      titleText: "text-blue-100 dark:text-blue-200", 
      subtitleText: "text-blue-200 dark:text-blue-300", 
      line: "bg-blue-200 dark:bg-blue-700"
    },
    dark: {
      gradient: "bg-[#3A2067] dark:bg-[#28154a]",
      icon: "bg-blue-600 dark:bg-blue-800",
      text: "text-blue-200 dark:text-blue-100",
      titleText: "text-[#D6C4F0] dark:text-[#c2a9eb]",
      subtitleText: "text-blue-300 dark:text-blue-200",
      line: "bg-purple-200 dark:bg-purple-700"
    }
  };
  

  const scheme = colorSchemes[color] || colorSchemes.purple;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="relative"
    >
      <div className={` bg-purple-800 rounded-2xl p-6 text-center shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300`}>
        <div className={`h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
          {step.icon}
        </div>
        <h3 className={`text-xl font-bold ${scheme.titleText} mb-2`}>
          Step {index + 1}
        </h3>
        <h4 className={`text-lg font-medium ${scheme.subtitleText} mb-3`}>
          {step.title}
        </h4>
        <p className={scheme.text}>
          {step.description}
        </p>
      </div>
      {index < total - 1 && (
        <div className={`hidden md:block absolute top-1/4 right-0 transform translate-x-1/2 w-12 h-2 ${scheme.line}`}>
          <div className="absolute right-0 transform translate-x-1/2 -translate-y-1/3"></div>
        </div>
      )}
    </motion.div>
  );
};