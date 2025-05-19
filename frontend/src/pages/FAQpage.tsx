import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaRegLightbulb,
} from "react-icons/fa";

import { faqData, categories } from "../utils/faq";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

interface FAQItem {
  question: string;
  answer: string;
  id?: string;
  category?: string;
}

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openFaqs, setOpenFaqs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  // Calculate all FAQs for search functionality
  const allFaqs = Object.values(faqData).flat();

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = (allFaqs as FAQItem[]).filter(
      (faq) =>
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFaqs(results);
  }, [searchQuery]);

  // Toggle FAQ item open/closed
  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white py-16 bg-purple-50 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Find answers to common questions about using SwapStay for your
              hostel room exchange needs
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="w-full px-5 py-3 pr-12 rounded-full text-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-3 text-gray-500 dark:text-gray-400">
                  <FaSearch />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12  bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
          {/* Search Results */}
          {searchQuery.trim() !== "" && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Search Results
              </h2>
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-50 dark:hover:bg-gray-700"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {faq.question}
                        </span>
                        {openFaqs[faq.id] ? (
                          <FaChevronUp className="text-purple-600 dark:text-purple-400" />
                        ) : (
                          <FaChevronDown className="text-purple-600 dark:text-purple-400" />
                        )}
                      </button>
                      {openFaqs[faq.id] && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                          <p className="text-gray-700 dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200 rounded-lg shadow-md p-6 text-center">
                  <FaRegLightbulb className="text-yellow-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We couldn't find any FAQs matching "{searchQuery}". Try
                    different keywords or browse the categories below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Category Navigation */}
          <div className="mb-8 overflow-x-auto ">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQs for Selected Category */}
          {searchQuery.trim() === "" && (
            <div className="space-y-6 ">
              <h2 className="text-2xl font-bold mb-6 text-purple-800 dark:text-gray-100">
                {categories.find((cat) => cat.id === activeCategory)?.label}{" "}
                Questions
              </h2>

              {faqData[activeCategory].map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-50 dark:hover:bg-gray-700"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {faq.question}
                    </span>
                    {openFaqs[faq.id] ? (
                      <FaChevronUp className="text-purple-600 dark:text-purple-400" />
                    ) : (
                      <FaChevronDown className="text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                  {openFaqs[faq.id] && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Still Need Help Section */}
          <div className="mt-16 bg-purple-100 py-12  dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-purple-800 dark:text-purple-200 mb-6 max-w-2xl mx-auto">
              If you couldn't find the answer you were looking for, our support
              team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => handleNavigation("/feedback")}
                className="bg-purple-700 text-white hover:bg-purple-800 font-medium py-3 px-6 rounded-md shadow-sm transition-colors"
              >
                Submit Request
              </button>
              <button
                onClick={() => handleNavigation("/complain")}
                className="bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 font-medium py-3 px-6 rounded-md shadow-sm transition-colors"
              >
                Report Complain
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default FAQPage;
