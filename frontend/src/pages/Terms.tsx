import { useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import { sections } from "../utils/terms";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const [activeSection, setActiveSection] = useState(1);
  const navigate = useNavigate();

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
        <main className="flex-1 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-300 mb-3">
                Terms and Conditions
              </h1>
              <div className="w-24 h-1 bg-purple-600 dark:bg-purple-400 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Please review our platform's terms and conditions to ensure a
                smooth and secure experience for all users.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-12">
              <div className="bg-purple-800 dark:bg-purple-900 text-white p-6">
                <h2 className="text-xl font-semibold">Important Notice</h2>
                <p className="text-purple-100 mt-2">
                  These terms were last updated on March 1, 2025. By using
                  SwapStay, you acknowledge that you have read and understood
                  these terms.
                </p>
              </div>

              <div className="p-6">
                {sections.map((section) => (
                  <div key={section.id} className="mb-4">
                    <div
                      className={`flex items-center justify-between p-4 cursor-pointer rounded-lg transition-colors duration-200 ${
                        activeSection === section.id
                          ? "bg-purple-100 dark:bg-purple-900/30"
                          : "hover:bg-purple-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`mr-4 p-2 rounded-full ${
                            activeSection === section.id
                              ? "bg-purple-600 text-white dark:bg-purple-500"
                              : "bg-purple-100 text-purple-600 dark:bg-gray-700 dark:text-purple-300"
                          }`}
                        >
                          {section.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200">
                          {section.id}. {section.title}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-purple-600 dark:text-purple-300 transition-transform duration-200 ${
                          activeSection === section.id
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>

                    {activeSection === section.id && (
                      <div className="mt-2 p-5 pl-16 text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-gray-700/50 rounded-lg">
                        {section.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                Need Help or Have Questions?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any queries or have faced any issues, feel free to
                contact us through feedback or report a complaint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200 flex-1 text-center"
                  onClick={() => {
                    navigate("/feedback");
                    window.scrollTo(0, 0);
                  }}
                >
                  Contact Us
                </button>
                <button
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200 flex-1 text-center"
                  onClick={() => {
                    navigate("/complain");
                    window.scrollTo(0, 0);
                  }}
                >
                  Report Complain
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
