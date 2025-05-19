import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ListRoom from "./pages/ListRoom";
import BrowseRooms from "./pages/BrowseRooms";
import Request from "./pages/Request";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import GuestHouse from "./pages/GuestHouse";
import ComplaintPage from "./pages/ComplaintPage";
import FeedbackPage from "./pages/FeedbackPage";
import Payment from "./pages/Payment";
import FAQPage from "./pages/FAQpage";
import Mess from "./pages/Mess";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/context/ThemeContext";
import { AuthProvider } from "./components/context/AuthContext";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/list-room" element={<ListRoom />} />
                <Route path="/browse-rooms" element={<BrowseRooms />} />
                <Route path="/notifications" element={<Request />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/complain" element={<ComplaintPage />} />
                <Route path="/guest-house" element={<GuestHouse />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/mess" element={<Mess />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
