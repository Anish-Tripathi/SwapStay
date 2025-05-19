import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { ExternalLink } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  // Function to handle navigation with auth check and scroll to top
  const handleNavigation = (path, requiresAuth = false) => {
    if (requiresAuth && !isLoggedIn) {
      // Redirect to auth page if login is required but user is not logged in
      navigate("/auth", { state: { returnUrl: path } });
      // Scroll to top
      window.scrollTo(0, 0);
    } else {
      navigate(path);
      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  // Current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-white py-12 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-16 p-5 bg-purple-800 rounded-lg shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3 text-white">
              Discover Real-Time Coding with CodeCollab!
            </h3>
            <p className="text-purple-200 mb-4 max-w-2xl mx-auto">
              A real-time collaborative coding platform enhanced with AI
              copilots, voice/video collaboration, code search, and team project
              tools. Designed for students, devs, and hackathon teams.
            </p>
            <button
              onClick={() => (window.location.href = "www.codecollab.in")}
              className="bg-white text-purple-600 border border-purple-600 hover:bg-purple-100 px-4 py-4 rounded-md transition-colors duration-200 font-medium text-lg flex items-center gap-2 justify-center"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              Explore CodeCollab <ExternalLink className="h-5 w-5 inline" />
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mr-3">
                <span className="text-purple-900 font-bold text-xl">S</span>
              </div>

              <h3 className="text-2xl font-bold">SwapStay</h3>
            </div>
            <p className="text-purple-200 mb-6">
              SwapStay is a platform designed to help students easily exchange
              their hostel rooms within the campus. Our mission is to simplify
              the room exchange process and help students find the perfect
              accommodation that suits their needs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          <div className="ml-0 md:ml-16">
            <h3 className="text-xl font-semibold mb-4 border-b border-purple-700 pb-2">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation("/list-room", true)}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Add Room
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/browse-rooms", true)}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Browse Room
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/notifications", true)}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Manage Requests
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/guest-house", true)}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Book Guest House
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("/mess", true)}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Change Mess
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/complain", true)}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Report Complain
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-purple-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation("/about")}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/terms")}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Terms of Service
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("/terms")}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/feedback")}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/settings", true)}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/faq")}
                  className="text-purple-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">➤</span> FAQ
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-purple-700 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaEnvelope className="text-purple-400 mt-1 mr-3" />
                <a
                  href="mailto: tripathiarun780@gmail.com"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  tripathiarun780@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <FaPhone className="text-purple-400 mt-1 mr-3" />
                <a
                  href="tel:+919867469877"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  +91 9867 469 877
                </a>
              </li>
              <li
                className="flex items-start cursor-pointer group"
                onClick={() => {
                  window.open(
                    "https://www.google.co.in/maps/place/Balaji+Annexe,+Ramdev+Park,+Mira+Road+East,+Mira+Bhayandar,+Maharashtra+401107/@19.2949675,72.8655424,672m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3be7b0393b9cccc7:0xc0dfd5e33034d470!8m2!3d19.2949625!4d72.8681173!16s%2Fg%2F1pv0tbql8?entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D",
                    "_blank"
                  );
                }}
              >
                <FaMapMarkerAlt className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-purple-200 group-hover:text-white transition-colors">
                  B/303, Balaji Annex, Ramdev Park Road, Mira Road East, Thane
                  401107
                </span>
              </li>
            </ul>
            <div className=" bg-purple-900 rounded-lg mt-3 p-3 text-purple-200 hover:text-white transition-colors">
              <h4 className="text-lg font-bold mb-2 text-center">
                Downtime Notice
              </h4>
              <p className="text-sm">
                Our team is available from <strong>9 AM to 9 PM IST</strong>.
                Responses may be delayed during off-hours.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-purple-800 ">
          <p className="text-purple-300 mb-4 md:mb-0 text-center">
            &copy; {currentYear} SwapStay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
