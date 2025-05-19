import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const HeroSection = ({ handleProtectedNavigation }) => {
  const phrases = [
    "Seamless Room Exchange, Anytime",
    "Find the Perfect Stay, Instantly",
    "List Your Room, Swap with Ease",
    "Hassle-Free Guest House Booking",
    "Your Ideal Roommate Awaits",
    "Effortless Room Swaps for Students",
    "Stay, Swap, and Save Smartly",
    "Book, Swap, and Settle with Ease",
    "A Smarter Way to Find a Room",
    "Fast & Reliable Room Exchange",
    "Switch Your Mess, Your Way",
    "Find the Best Mess for You",
    "Hassle-Free Mess Swap",
    "Better Meals, Better Choices",
    "Swap Your Mess, Enjoy Your Meals",
  ];

  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 50;
  const deletingSpeed = 50;
  const delayBetweenPhrases = 1500;

  useEffect(() => {
    let timeoutId;

    const typeWriterEffect = () => {
      setText(phrases[phraseIndex].substring(0, currentCharIndex));

      if (!isDeleting) {
        if (currentCharIndex < phrases[phraseIndex].length) {
          timeoutId = setTimeout(
            () => setCurrentCharIndex((prev) => prev + 1),
            typingSpeed
          );
        } else {
          timeoutId = setTimeout(
            () => setIsDeleting(true),
            delayBetweenPhrases
          );
        }
      } else {
        if (currentCharIndex > 0) {
          timeoutId = setTimeout(
            () => setCurrentCharIndex((prev) => prev - 1),
            deletingSpeed
          );
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    timeoutId = setTimeout(
      typeWriterEffect,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeoutId);
  }, [phraseIndex, currentCharIndex, isDeleting]);

  return (
    <section className="py-40 min-h-screen bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-14 md:h-16 flex justify-center items-center">
            <h1 className="text-3xl md:text-5xl font-bold text-purple-900 dark:text-purple-300">
              {text}
              <span className="text-purple-500 dark:text-purple-400">|</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 mt-4 dark:text-gray-300">
            Looking for a room swap? List your room now and find the perfect
            match!
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="bg-purple-900 hover:bg-purple-800 dark:bg-purple-700 dark:hover:bg-purple-600"
              onClick={() => handleProtectedNavigation("/list-room")}
            >
              List Room
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-purple-900 hover:bg-purple-50 dark:text-purple-600 dark:hover:bg-purple-900 dark:hover:text-white"
              onClick={() => handleProtectedNavigation("/browse-rooms")}
            >
              Browse Rooms
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
