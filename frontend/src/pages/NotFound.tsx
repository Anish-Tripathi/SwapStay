import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

const NotFound = () => {
  const [funnyMessage, setFunnyMessage] = useState("");
  const [bounceEffect, setBounceEffect] = useState(false);
  const navigate = useNavigate();

  const funnyMessages = [
    "Looks like this page took a spontaneous vacation to the digital Bahamas!",
    "Error 404: Page playing hide and seek. (It's really good at hiding.)",
    "This page has ghosted you harder than your last Tinder match.",
    "Oops! Our hamsters powering the server fell asleep on the job.",
    "Congrats! You've discovered our secret page that doesn't exist!",
    "Plot twist: You're actually in the wrong universe. This page exists in Earth-616.",
    "This page was last seen running away with the website's CSS.",
    "Breaking news: Page missing! $500 reward for information leading to its return.",
    "You've reached the end of the internet. Please turn around.",
    "This page is in another castle. Sorry, adventurer!",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funnyMessages.length);
    setFunnyMessage(funnyMessages[randomIndex]);

    // Add initial bounce effect
    setBounceEffect(true);
    const timer = setTimeout(() => setBounceEffect(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="h-3/4 flex items-center justify-center bg-purple-200 dark:from-gray-900 dark:to-purple-950 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-5xl w-full border-2 border-purple-200 dark:border-purple-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side - Error message */}
            <div className="md:w-1/2 text-left">
              <div className="">
                <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-pink-300 animate-pulse ">
                  404
                </h1>

                <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mt-4 mb-2">
                  Oops... Page Not Found!
                </h2>

                <div className="h-1 w-32 bg-gradient-to-r from-purple-400 to-pink-400 my-4 rounded-full"></div>

                <p className="text-purple-700 dark:text-purple-300 text-lg font-medium mb-8 pr-4 p-3 bg-purple-50 dark:bg-purple-900 rounded-lg border-l-4 border-purple-400 dark:border-purple-500 shadow-sm">
                  {funnyMessage}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleGoHome}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition duration-300 transform hover:scale-105 hover:shadow-lg ml-13"
                  >
                    Take Me Home
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Robot illustration */}
            <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
              <div className="relative w-64 h-64 transform hover:rotate-3 transition-transform duration-500">
                {/* Main character - confused robot */}
                <div className="absolute inset-0">
                  {/* Robot body */}
                  <div className="w-40 h-48 bg-purple-500 dark:bg-purple-600 rounded-2xl mx-auto mt-8 relative overflow-hidden shadow-lg">
                    {/* Robot face */}
                    <div className="absolute top-4 left-0 right-0 flex justify-center">
                      {/* Eyes */}
                      <div className="flex space-x-8">
                        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center animate-pulse">
                          <div className="bg-black w-4 h-4 rounded-full relative">
                            <div className="absolute top-0 left-1 bg-white w-2 h-2 rounded-full"></div>
                          </div>
                        </div>
                        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center animate-pulse">
                          <div className="bg-black w-4 h-4 rounded-full relative">
                            <div className="absolute top-0 left-1 bg-white w-2 h-2 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mouth - confused expression */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                      <div className="w-16 h-6 border-4 border-white rounded-full border-t-0"></div>
                    </div>

                    {/* Robot decoration */}
                    <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="w-4 h-4 bg-purple-300 dark:bg-purple-200 rounded-full animate-ping animation-delay-100"></div>
                        <div className="w-4 h-4 bg-purple-300 dark:bg-purple-200 rounded-full animate-ping animation-delay-300"></div>
                        <div className="w-4 h-4 bg-purple-300 dark:bg-purple-200 rounded-full animate-ping animation-delay-500"></div>
                        <div className="w-4 h-4 bg-purple-300 dark:bg-purple-200 rounded-full animate-ping animation-delay-700"></div>
                      </div>
                    </div>
                  </div>

                  {/* Robot antennae */}
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className="w-2 h-10 bg-purple-600 dark:bg-purple-700 relative">
                      <div className="absolute -top-2 -left-1 w-4 h-4 bg-pink-400 dark:bg-pink-300 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Robot arms */}
                  <div className="absolute top-24 -left-2">
                    <div className="w-12 h-4 bg-purple-600 dark:bg-purple-700 rounded-full transform -rotate-45 animate-pulse"></div>
                  </div>
                  <div className="absolute top-24 -right-2">
                    <div className="w-12 h-4 bg-purple-600 dark:bg-purple-700 rounded-full transform rotate-45 animate-pulse"></div>
                  </div>

                  {/* Question marks floating around */}
                  <div className="absolute top-4 right-10 text-2xl text-purple-400 dark:text-purple-300 animate-pulse">
                    ?
                  </div>
                  <div className="absolute top-12 left-10 text-3xl text-purple-300 dark:text-purple-200 animate-pulse">
                    ?
                  </div>
                  <div className="absolute top-2 left-20 text-xl text-pink-400 dark:text-pink-300 animate-pulse delay-300">
                    ?
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer message - Bottom center */}
          <div className="text-center mt-10">
            <p className="text-purple-500 dark:text-purple-300 text-base font-medium py-2 px-6 bg-purple-50 dark:bg-purple-900 inline-block rounded-full shadow-sm border border-purple-200 dark:border-purple-700">
              Don't worry, even our developers get lost here sometimes!
            </p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default NotFound;
