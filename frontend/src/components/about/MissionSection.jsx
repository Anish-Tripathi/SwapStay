import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export const MissionSection = () => {
  return (
    <main className="flex-1 bg-purple-200 py-8  dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
    <section className="py-16" id="our-story">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <img
              src="https://thumbs.dreamstime.com/b/mission-isolated-glassy-purple-round-button-abstract-illustration-mission-glassy-purple-round-button-105885547.jpg"
              alt="Students in campus"
              className="rounded-xl shadow-xl"
              style={{ width: "400px" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold text-purple-900 mb-6 dark:text-purple-300">
              Our Mission
            </h2>
            <div className="w-20 h-1 bg-purple-500 mb-6"></div>
            <p className="text-lg text-gray-700 mb-6 dark:text-gray-300">
              SwapStay is a platform designed to help students easily
              exchange their hostel rooms within the campus. Our mission is
              to simplify the <b>Room Exchange Process</b> and help students
              find the perfect accommodation that suits their needs.
            </p>
            <p className="text-lg text-gray-700 mb-6 dark:text-gray-300">
              In addition to hostel room exchanges, SwapStay also offers a{" "}
              <b>Guest House Booking</b> feature, allowing students and
              visitors to easily explore available guest houses, check
              amenities, and book their stay with a secure and
              straightforward process.
            </p>
            <p className="text-lg text-gray-700 mb-6 dark:text-gray-300">
              SwapStay also simplifies the <b>Mess Change Process</b> by
              allowing students to request mess transfers easily. Our
              platform ensures a smooth and transparent transition, enabling
              students to choose the mess that best fits their dietary
              preferences and schedule.
            </p>

            <div className="flex items-center gap-4 text-purple-800 dark:text-purple-400">
              <Shield className="h-6 w-6" />
              <span className="font-medium">
                Secure & Trusted by Universities
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </main>
  );
};
