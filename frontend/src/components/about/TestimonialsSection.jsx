import { motion } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "SwapStay made it incredibly easy for me to find a new room. The platform is simple to use, and I was able to complete my exchange in just a few days!",
      name: "Anish Tripathi",
      position: "Student, Computer Science",
      avatar: "https://img.freepik.com/premium-photo/smiling-indian-student-isolated-white-background_582637-15235.jpg",
    },
    {
      quote:
        "I found a perfect room exchange opportunity thanks to SwapStay. I love how transparent and quick the whole process was!",
      name: "Priya Patel",
      position: "Student, Mechanical Engineering",
      avatar: "https://th.bing.com/th/id/OIP.PFSU9W_kjnb2Vy9XNs1nPQHaHa?cb=iwp2&w=626&h=626&rs=1&pid=ImgDetMain",
    },
    {
      quote:
        "The messaging system is fantastic! I could easily communicate with potential room swappers and found my ideal match in no time.",
      name: "Raj Sharma",
      position: "Student, Business Administration",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
    },
  ];

  return (
    <section
      className="py-16 bg-purple-200 py-8 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200"
      id="testimonials"
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
            What Our Users Say
          </h2>
          <div className="w-20 h-1 bg-purple-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto dark:text-gray-300">
            Hear from students who have successfully found their ideal
            accommodations through SwapStay.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};