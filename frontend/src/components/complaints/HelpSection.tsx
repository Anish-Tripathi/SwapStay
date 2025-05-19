import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How long will it take to get a response?",
    answer:
      "We aim to acknowledge all complaints within 1-2 business days. Complex issues may require further investigation, but we'll keep you updated on the progress of your complaint.",
  },
  {
    question: "Can I submit anonymous complaints?",
    answer:
      "Yes, you can submit complaints anonymously. However, we may not be able to provide you with updates or request additional information if needed. For best results, we recommend providing contact information.",
  },
  {
    question: "What information should I include in my complaint?",
    answer:
      "Please provide as much detail as possible, including dates, times, locations, names of involved parties, and any supporting documentation. The more information you provide, the better we can address your concerns.",
  },
  {
    question: "Can I update my complaint after submission?",
    answer:
      "No, once a complaint is submitted, it cannot be updated. If you need to provide additional information, please submit a new complaint with the updated details.",
  },

  {
    question: "How do I check the status of my complaint?",
    answer:
      "You can check the status of your complaint by logging into your account and viewing your complaint history. Each complaint will display its current status and any updates provided by our team.",
  },
];

const HelpSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mt-5">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Help & Resources
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-900 dark:text-gray-100"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            Additional Resources
          </h3>

          <div className="space-y-3">
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              <Phone className="h-4 w-4" />
              <span>Contact Support: +919867469877</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              <Mail className="h-4 w-4" />
              <span>Email: tripathiarun780@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
