import React from "react";
import { Link } from "react-router-dom";
import DeactivateAccountModal from "./DeactivateAccountModal"; // Adjust the import path as needed

const NavbarMobileMenu = ({
  isOpen,
  setIsOpen,
  isAuthenticated,
  setIsAuthenticated,
  handleLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-purple-800 dark:bg-gray-800">
        {isAuthenticated ? (
          <>
            <Link
              to="/"
              className="text-white hover:bg-purple-700 dark:hover:bg-gradient-to-r dark:hover:from-purple-950 dark:hover:to-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:translate-x-1"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/list-room"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              List Room
            </Link>
            <Link
              to="/browse-rooms"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Browse Rooms
            </Link>
            <Link
              to="/room-swap/requests"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Manage Requests
            </Link>
            <Link
              to="/guest-house"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Book Guest House
            </Link>
            <Link
              to="/mess"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Change Mess
            </Link>

            <Link
              to="/about"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/settings"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <Link
              to="/faq"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to="/terms"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Terms & Conditions
            </Link>
            <Link
              to="/complain"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Report Complain
            </Link>
            <Link
              to="/feedback"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Feedback
            </Link>

            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Sign Out
            </button>
            <div onClick={() => setIsOpen(false)}>
              <DeactivateAccountModal
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            </div>
          </>
        ) : (
          <>
            <Link
              to="/auth?mode=login"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/auth?mode=signup"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Signup
            </Link>
            <Link
              to="/auth?mode=activate"
              className="text-white hover:bg-purple-700 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Activate
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
