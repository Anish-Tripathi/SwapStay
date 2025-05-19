import { motion } from "framer-motion";
import { BenefitCard } from "./BenefitCard";
import { Users, Check, MessageCircle, Shield, Award, Clock } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      title: "Convenient and Quick",
      description:
        "Find and exchange rooms in days, not weeks, with our streamlined process.",
      icon: (
        <Clock className="h-10 w-10 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "Wide Variety of Options",
      description:
        "Access to thousands of rooms across multiple campuses to find your perfect match.",
      icon: (
        <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "Secure Transactions",
      description:
        "Our platform ensures safe and transparent exchanges with verification systems.",
      icon: (
        <Shield className="h-10 w-10 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "Direct Communication",
      description:
        "Connect directly with potential room partners through our messaging system.",
      icon: (
        <MessageCircle className="h-10 w-10 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "User-Friendly Interface",
      description:
        "Easy-to-use platform with detailed filters and preference settings.",
      icon: (
        <Check className="h-10 w-10 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "Premium Support",
      description:
        "Dedicated customer support team to help you with any questions or concerns.",
      icon: (
        <Award className="h-10 w-10 text-purple-600 dark:text-purple-400" />
      ),
    },
  ];

  return (
    <section
      className="py-16 bg-purple-200 bg-gradient-to-br from-purple-200 to-white py-8 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200"
      id="benefits"
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-purple-900 mb-4 dark:text-purple-300">
            Benefits of Using SwapStay
          </h2>
          <div className="w-20 h-1 bg-purple-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto dark:text-gray-300">
            Experience a superior way to manage your accommodation needs
            with our feature-rich platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

