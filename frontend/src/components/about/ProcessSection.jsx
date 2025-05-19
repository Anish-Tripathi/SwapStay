import { motion } from "framer-motion";
import { ProcessStep } from "./ProcessStep";

export const ProcessSection = ({ 
  title, 
  description, 
  steps, 
  color = "purple", 
  titleColor = "text-purple-900 dark:text-purple-300",
  dividerColor = "bg-purple-500" 
}) => {
  return (
    <section className="py-16 bg-purple-200 py-8 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4"
      id="how-it-works">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl font-bold ${titleColor} mb-4`}>
            {title}
          </h2>
          <div className={`w-20 h-1 ${dividerColor} mx-auto mb-6`}></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto dark:text-gray-300">
            {description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ProcessStep 
              key={index} 
              step={step} 
              index={index} 
              total={steps.length} 
              color={color} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
