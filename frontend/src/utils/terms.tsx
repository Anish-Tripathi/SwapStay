import {
  CheckCircle,
  AlertCircle,
  Shield,
  BookOpen,
  Users,
  Utensils,
} from "lucide-react";

export const sections = [
  {
    id: 1,
    icon: <BookOpen className="h-6 w-6" />,
    title: "Acceptance of Terms",
    content:
      "By accessing and using the IET SwapStay platform, you agree to be bound by these Terms and Conditions. These terms apply to all users of the platform, including students seeking to exchange rooms and those booking guest houses. Please read these terms carefully before proceeding with registration.",
  },
  {
    id: 2,
    icon: <Users className="h-6 w-6" />,
    title: "User Eligibility",
    content: (
      <>
        <p className="mb-3">To use IET SwapStay, you must be:</p>
        <ul className="list-none space-y-2">
          {[
            "A current student of NITK",
            "At least 18 years of age",
            "Have a valid student ID",
            "Currently residing in an NITK hostel (for room exchange)",
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 3,
    icon: <AlertCircle className="h-6 w-6" />,
    title: "Room Exchange Rules",
    content: (
      <>
        <p className="mb-3">
          Users must follow these guidelines when exchanging rooms:
        </p>
        <ul className="list-none space-y-2">
          {[
            "Provide accurate information about your current room",
            "Upload clear and recent photos of your accommodation",
            "Obtain necessary permissions from hostel authorities",
            "Complete the exchange process within the specified timeframe",
            "Follow all hostel regulations during the exchange process",
            "Ensure the room is in clean and proper condition before exchange",
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 4,
    icon: <BookOpen className="h-6 w-6" />,
    title: "Guest House Booking Terms",
    content: (
      <>
        <p className="mb-3">
          For guest house bookings, the following terms apply:
        </p>
        <ul className="list-none space-y-2">
          {[
            "Bookings must be made at least 48 hours in advance",
            "Cancellations within 24 hours of check-in may incur a fee",
            "Payment must be completed at the time of booking",
            "Users must present valid ID during check-in",
            "Check-in and check-out times must be strictly followed",
            "Any damage to property will be the responsibility of the user",
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 5,
    icon: <Utensils className="h-6 w-6" />,
    title: "Mess Change Terms",
    content: (
      <>
        <p className="mb-3">
          Please note the following terms for mess change requests:
        </p>
        <ul className="list-none space-y-2">
          {[
            "Mess change requests can be made only once per month",
            "Requests must be submitted before the 5th of each month",
            "Changes will be effective from the following month",
            "Swaps are subject to availability and capacity",
            "Special dietary requests must be mentioned during application",
            "Once changed, reverting back requires a new request",
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 6,
    icon: <Shield className="h-6 w-6" />,
    title: "Privacy Policy",
    content: (
      <>
        <p className="mb-3">
          We are committed to protecting your privacy. Your personal information
          will be:
        </p>
        <ul className="list-none space-y-2">
          {[
            "Used only for room exchange and booking purposes",
            "Never shared with unauthorized third parties",
            "Stored securely and protected from unauthorized access",
            "Encrypted during transmission to prevent data breaches",
            "Deleted upon request or account termination",
            "Processed in accordance with data protection regulations",
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 7,
    icon: <Users className="h-6 w-6" />,
    title: "User Conduct",
    content: (
      <>
        <p className="mb-3">Users are expected to:</p>
        <ul className="list-none space-y-2">
          {[
            "Behave respectfully towards other users",
            "Not engage in fraudulent activities",
            "Report any suspicious behavior",
            "Follow all institute guidelines",
            "Maintain honest communication",
            "Respect privacy and confidentiality of other users",
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
];
