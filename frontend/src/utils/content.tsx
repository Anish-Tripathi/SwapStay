import {
  Users,
  MessageCircle,
  Clock,
  Check,
  Home,
  Bed,
  CreditCard,
  CheckCircle,
  Clipboard,
  Search,
  Utensils,
  Shield,
  Lock,
} from "lucide-react";

// Define process steps for different sections
export const roomSwapSteps = [
  {
    title: "List Your Room",
    description:
      "Create a detailed listing of your current room with photos, amenities, and location details.",
    icon: <Users className="h-8 w-8 text-purple-100" />,
  },
  {
    title: "Browse Options",
    description:
      "Search for available rooms that match your preferences using our advanced filtering system.",
    icon: <MessageCircle className="h-8 w-8 text-purple-100" />,
  },
  {
    title: "Connect & Chat",
    description:
      "Send exchange requests and chat with potential room partners to finalize details.",
    icon: <Clock className="h-8 w-8 text-purple-100" />,
  },
  {
    title: "Complete Swap",
    description:
      "Coordinate and finalize the exchange through our secure verification process.",
    icon: <Check className="h-8 w-8 text-purple-100" />,
  },
];

export const guestHouseSteps = [
  {
    title: "Explore Guest Houses",
    description:
      "Browse a variety of guest houses with photos, amenities, and reviews.",
    icon: <Home className="h-8 w-8 text-blue-100" />,
  },
  {
    title: "Choose Your Room",
    description:
      "Select a room that fits your needs and budget, with detailed features.",
    icon: <Bed className="h-8 w-8 text-blue-100" />,
  },
  {
    title: "Secure Payment",
    description:
      "Make a secure payment through our platform with multiple options available.",
    icon: <CreditCard className="h-8 w-8 text-blue-100" />,
  },
  {
    title: "Confirm Booking",
    description:
      "Receive instant confirmation and check-in details for a smooth experience.",
    icon: <CheckCircle className="h-8 w-8 text-blue-100" />,
  },
];

export const messSteps = [
  {
    title: "Request Change",
    description:
      "Submit your mess change request with preferred location and cuisine.",
    icon: <Clipboard className="h-8 w-8 text-green-100" />,
  },
  {
    title: "Compare Options",
    description:
      "Browse available mess options based on menu, price, and user reviews.",
    icon: <Search className="h-8 w-8 text-green-100" />,
  },
  {
    title: "Select Mess",
    description:
      "Choose your preferred mess and complete subscription formalities.",
    icon: <Utensils className="h-8 w-8 text-green-100" />,
  },
  {
    title: "Start Enjoying",
    description:
      "Begin enjoying meals at your new mess on your selected start date.",
    icon: <CheckCircle className="h-8 w-8 text-green-100" />,
  },
];

// Benefits content
export const benefits = [
  {
    title: "Flexibility",
    description: "Change your living situation based on your evolving needs.",
    icon: <Clock className="h-8 w-8 text-primary" />,
  },
  {
    title: "Cost Savings",
    description: "Reduce expenses by finding more affordable options.",
    icon: <CreditCard className="h-8 w-8 text-primary" />,
  },
  {
    title: "Verified Users",
    description:
      "All users are verified with college ID and other documentation.",
    icon: <Shield className="h-8 w-8 text-primary" />,
  },
  {
    title: "Secure Process",
    description:
      "Our platform provides a secure environment for all transactions.",
    icon: <Lock className="h-8 w-8 text-primary" />,
  },
];

// Why Choose Us content
export const whyChooseUs = [
  {
    title: "College-Focused",
    description: "Built specifically for college students with unique needs.",
  },
  {
    title: "Simplified Process",
    description: "Easy-to-use interface designed for busy students.",
  },
  {
    title: "24/7 Support",
    description: "Our team is available to assist you anytime.",
  },
  {
    title: "Largest Network",
    description: "Access to the largest network of college accommodations.",
  },
];
