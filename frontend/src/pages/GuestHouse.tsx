import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import GuestHouseContent from "../components/guesthouse/GuestHouseContent";

const GuestHousePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-purple-700 text-white py-8 text-center dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Guest House Booking</h1>
          <p className="text-purple-100 mt-2 text-md">
            Your home away from home - Comfortable and convenient accommodations
            for university visitors
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <GuestHouseContent />
      </main>

      <Footer />
    </div>
  );
};

export default GuestHousePage;
