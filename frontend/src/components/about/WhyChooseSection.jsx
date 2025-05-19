import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const WhyChooseSection = () => {
  const navigate = useNavigate();
  
  return (
    <section
      className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 text-white py-8 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200"
      id="why-choose"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold mb-6">
              Why Choose SwapStay?
            </h2>
            <div className="w-20 h-1 bg-purple-400 mb-6"></div>
            <p className="text-lg text-purple-100 mb-8 dark:text-purple-200">
              SwapStay simplifies room exchanges, guest house bookings, and
              mess subscriptions. Whether you need a short stay for family
              or want to switch to a mess with better cuisine and timings,
              our platform offers seamless solutions. With secure payments,
              instant confirmations, and transparent listings, finding the
              perfect guest house or swapping your mess is quick and
              hassle-free—all in just a few clicks.
            </p>

            <button
              className="bg-white text-purple-800 font-medium py-3 px-8 rounded-full hover:bg-purple-100 transition-colors duration-300 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700"
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
            >
              Join SwapStay Today
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <img
              src="https://media.istockphoto.com/id/1147265530/photo/question-mark-3d-purple-interrogation-point-question-sign-asking-symbol-icon-with-thinking.jpg?s=612x612&w=0&k=20&c=_x0BuM0k_dVAnhTtSjbyo_k9G8z0J0xCE5oL8otiERI="
              alt="Students exchanging keys"
              className="rounded-xl shadow-xl "
              style={{ width: "450px", marginLeft: "auto" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
