import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { HeroSection } from "../components/about/HeroSection";
import { MissionSection } from "../components/about/MissionSection";
import { ProcessSection } from "../components/about/ProcessSection";
import { BenefitsSection } from "../components/about/BenefitsSection";
import { WhyChooseSection } from "../components/about/WhyChooseSection";
import { TestimonialsSection } from "../components/about/TestimonialsSection";
import {
  roomSwapSteps,
  guestHouseSteps,
  messSteps,
  benefits,
  whyChooseUs,
} from "@/utils/content";

const About = () => {
  return (
    <div className="min-h-screen  flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />

        <MissionSection />

        <ProcessSection
          title="Room Swap Process"
          description="Exchange your current room with another student in a simple, secure process."
          steps={roomSwapSteps}
          bgColor="bg-purple-50"
          accentColor="border-purple-500"
        />

        <ProcessSection
          title="Guest House Booking"
          description="Find and book quality guest houses near your college campus."
          steps={guestHouseSteps}
          bgColor="bg-blue-50"
          accentColor="border-blue-500"
        />

        <ProcessSection
          title="Mess Change Process"
          description="Switch to a new mess that better suits your taste and budget."
          steps={messSteps}
          bgColor="bg-green-50"
          accentColor="border-green-500"
        />

        <BenefitsSection benefits={benefits} />

        <WhyChooseSection reasons={whyChooseUs} />

        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
};

export default About;
