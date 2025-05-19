import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { HeroSection } from "@/components/index/HeroSection";
import { ChangeSection } from "@/components/index/ChangeSection";
import { ServicesSection } from "@/components/index/ServiceSection";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(userLoggedIn);
  }, []);

  // Handle navigation for protected routes
  const handleProtectedNavigation = (route) => {
    if (isAuthenticated) {
      navigate(route);
    } else {
      navigate("/auth?mode=login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />

      <main className="flex-1">
        <HeroSection handleProtectedNavigation={handleProtectedNavigation} />
        <ChangeSection />
        <ServicesSection
          handleProtectedNavigation={handleProtectedNavigation}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
