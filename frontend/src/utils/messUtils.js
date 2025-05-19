// Contact information for all messes
export const contactInfo = {
  karawalimess: {
    manager: "Mr. Vikram Shah",
    phone: "+91 9898776655",
    email: "karawalimess@campus.edu",
    hours: "9:00 AM - 6:00 PM (Mon-Sat)",
  },
  aravalimess: {
    manager: "Ms. Pooja Deshmukh",
    phone: "+91 9988776655",
    email: "aravalimess@campus.edu",
    hours: "8:30 AM - 5:30 PM (Mon-Fri)",
  },
  megamess: {
    manager: "Mr. Rajesh Kumar",
    phone: "+91 9777665544",
    email: "megamess@campus.edu",
    hours: "9:00 AM - 7:00 PM (Mon-Sun)",
  },
  vindhyamess: {
    manager: "Mrs. Leela Sharma",
    phone: "+91 9811122233",
    email: "vindhyamess@campus.edu",
    hours: "8:30 AM - 6:00 PM (Mon-Sat)",
  },
  satpuramess: {
    manager: "Mr. Devendra Singh",
    phone: "+91 9833344455",
    email: "satpuramess@campus.edu",
    hours: "9:00 AM - 4:30 PM (Mon-Fri)",
  },
  tripuramess: {
    manager: "Ms. Anita Kapoor",
    phone: "+91 9845566778",
    email: "tripuramess@campus.edu",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
  },
  netravatimess: {
    manager: "Mr. Suresh Bhandari",
    phone: "+91 9966778899",
    email: "netravatimess@campus.edu",
    hours: "8:00 AM - 6:00 PM (Mon-Sat)",
  },
  pushpanjalimess: {
    manager: "Ms. Kavita Joshi",
    phone: "+91 9900887766",
    email: "pushpanjalimess@campus.edu",
    hours: "9:00 AM - 5:30 PM (Mon-Fri)",
  },
  trishulmess: {
    manager: "Mr. Rajeev Mehta",
    phone: "+91 9977554433",
    email: "trishulmess@campus.edu",
    hours: "8:30 AM - 5:30 PM (Mon-Sat)",
  },
};

// Function to get default contact info if not found
const getDefaultContact = (messName) => {
  return {
    manager: "Mr. Ramesh Kumar",
    phone: "+91 9876543210",
    email: `${messName.toLowerCase().replace(/\s+/g, "")}@campus.edu`,
    hours: "9:00 AM - 5:00 PM (Mon-Fri)",
  };
};

// Function to get reviews and hygiene data based on mess name
export const getMessDetails = (messName) => {
  let reviews = [];
  let hygiene = null;

  switch (messName.toLowerCase()) {
    case "vindhya":
      reviews = [
        {
          user: "Sneha R.",
          rating: 5,
          comment: "Amazing food with balanced nutrition. Love the weekly specials!",
          date: "3 days ago",
        },
        {
          user: "Kunal T.",
          rating: 4,
          comment: "Great ambience and friendly staff. Could use faster service sometimes.",
          date: "5 days ago",
        },
        {
          user: "Divya P.",
          rating: 4,
          comment: "Hygiene and cleanliness are commendable. Food taste is consistent.",
          date: "1 week ago",
        },
      ];
      hygiene = {
        score: 4.8,
        details: ["Daily kitchen cleaning", "UV water filters", "Glove & mask use"],
      };
      break;

    case "satpura":
      reviews = [
        {
          user: "Ravi V.",
          rating: 3,
          comment: "Decent options, but seating area gets crowded quickly.",
          date: "4 days ago",
        },
        {
          user: "Meena J.",
          rating: 4,
          comment: "Non-veg dishes are excellent. Could add more dessert options.",
          date: "6 days ago",
        },
        {
          user: "Arjun S.",
          rating: 5,
          comment: "Affordable, delicious meals. Quick service!",
          date: "2 weeks ago",
        },
      ];
      hygiene = {
        score: 4.5,
        details: ["Bi-weekly pest control", "Disposable gloves used", "Table wipes after every use"],
      };
      break;

    case "tripura":
      reviews = [
        {
          user: "Ayesha N.",
          rating: 4,
          comment: "Great vegetarian spread. Love the paneer dishes!",
          date: "2 days ago",
        },
        {
          user: "Harish R.",
          rating: 3,
          comment: "Food is good but breakfast starts late for early risers.",
          date: "1 week ago",
        },
        {
          user: "Nikhil M.",
          rating: 4,
          comment: "Comfortable seating, good hygiene practices in place.",
          date: "1 week ago",
        },
      ];
      hygiene = {
        score: 4.3,
        details: ["Filtered water", "Clean aprons for kitchen staff", "Daily surface cleaning"],
      };
      break;

    case "netravati":
      reviews = [
        {
          user: "Ritika S.",
          rating: 5,
          comment: "Excellent quality food and the best mix of veg/non-veg.",
          date: "3 days ago",
        },
        {
          user: "Rahul D.",
          rating: 4,
          comment: "Spacious and clean mess. Service is fast and polite.",
          date: "6 days ago",
        },
        {
          user: "Karthik M.",
          rating: 4,
          comment: "Offers a wide range of options and maintains great hygiene.",
          date: "2 weeks ago",
        },
      ];
      hygiene = {
        score: 4.9,
        details: ["Temperature checks", "Sanitized utensils", "Ventilated cooking area"],
      };
      break;

    case "pushpanjali":
      reviews = [
        {
          user: "Tanvi P.",
          rating: 3,
          comment: "Good food, but sometimes repetitive menu.",
          date: "5 days ago",
        },
        {
          user: "Yash R.",
          rating: 4,
          comment: "Vegetarian choices are nice. Staff is very helpful.",
          date: "1 week ago",
        },
        {
          user: "Snehal M.",
          rating: 5,
          comment: "Very clean and well-managed. Highly recommended!",
          date: "2 weeks ago",
        },
      ];
      hygiene = {
        score: 4.6,
        details: ["Daily cleaning schedule", "Hand wash stations", "Periodic audits"],
      };
      break;

    case "trishul":
      reviews = [
        {
          user: "Ankit T.",
          rating: 4,
          comment: "Fresh food and reasonable pricing. Enjoyed every meal.",
          date: "2 days ago",
        },
        {
          user: "Maya G.",
          rating: 5,
          comment: "Love the homemade taste! Great hygiene too.",
          date: "4 days ago",
        },
        {
          user: "Sameer L.",
          rating: 4,
          comment: "Balanced diet offerings. Clean seating area.",
          date: "1 week ago",
        },
      ];
      hygiene = {
        score: 4.7,
        details: ["Frequent mop routines", "Sanitizer dispensers", "Covered food service"],
      };
      break;

    default:
      reviews = [
        {
          user: "Rahul S.",
          rating: 4,
          comment: "The food quality has improved significantly. Really enjoying the new menu options!",
          date: "2 days ago",
        },
        {
          user: "Priya M.",
          rating: 5,
          comment: "Cleanliness is top-notch. Staff is very friendly and accommodating to special requests.",
          date: "1 week ago",
        },
        {
          user: "Amit K.",
          rating: 3,
          comment: "Food is decent but could use more variety. Service during peak hours needs improvement.",
          date: "2 weeks ago",
        },
      ];
      hygiene = {
        score: 4.7,
        details: ["Daily sanitization", "Regular pest control", "Staff health checks"],
      };
  }

  return { reviews, hygiene };
};

// Function to enhance mess data with contact, reviews, and hygiene information
export const enhanceMess = (mess) => {
  // Get mess details based on mess name
  const { reviews, hygiene } = getMessDetails(mess.name);
  
  // Normalize the mess name to match contactInfo keys
  const messKey = mess.name.toLowerCase().replace(/\s+/g, "");
  
  // Get contact info using the normalized key, or fallback to default
  const contact = contactInfo[messKey] || getDefaultContact(mess.name);

  // Return enhanced mess object with all details
  return {
    ...mess,
    reviews,
    hygiene: mess.hygiene || hygiene,
    contact,
  };
};