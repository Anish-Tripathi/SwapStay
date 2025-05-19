import {
  Search,
  MessageSquare,
  Bell,
  Home,
  Shield,
  Utensils,
} from "lucide-react";

export const servicesList = [
  {
    icon: <Search className="h-10 w-10 text-white" />,
    title: "Smart Room Search",
    description:
      "Find rooms effortlessly with advanced filters like location, amenities, and availability, ensuring a perfect swap.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-white" />,
    title: "Direct Messaging",
    description:
      "Chat instantly with potential swap partners in real-time, making the process smooth and hassle-free.",
  },
  {
    icon: <Bell className="h-10 w-10 text-white" />,
    title: "Instant Notifications",
    description:
      "Stay updated with real-time alerts whenever someone is interested in your room, keeping you ahead in the swapping process.",
  },
  {
    icon: <Utensils className="h-10 w-10 text-white" />,
    title: "Mess Swap Services",
    description:
      "Flexibility at your fingertips! Easily switch mess plans, view daily menus, and choose what suits you best.",
  },
  {
    icon: <Home className="h-10 w-10 text-white" />,
    title: "Guest House Booking",
    description:
      "Need a temporary stay? Our seamless booking system lets you check availability, view details, and book instantly.",
  },
  {
    icon: <Shield className="h-10 w-10 text-white" />,
    title: "Secure Verification",
    description:
      "Your safety matters! Our robust verification system ensures all users are authenticated and trustworthy.",
  },
];
