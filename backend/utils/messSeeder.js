const Mess = require("../models/Mess");

const initialMessData = [
  {
    id: 1,
    name: "Mega Mess",
    location: "MT Blocks",
    type: "Veg",
    vacancyCount: 5,
    rating: 4.5,
    menuPreview: "Paneer Butter Masala, Roti, Rice, Dal",
    timings: {
      breakfast: "8:00 - 10:00 AM",
      lunch: "12:00 - 2:00 PM",
      dinner: "7:00 - 9:00 PM",
    },
    facilities: ["AC", "WiFi", "Clean Dining", "Hand Sanitizer"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Poha", "Tea/Coffee", "Bread & Jam", "Boiled Eggs"],
        lunch: ["Rice", "Dal Tadka", "Paneer Curry", "Salad", "Papad", "Curd"],
        dinner: ["Roti", "Mix Vegetable", "Dal Fry", "Sweet (Gulab Jamun)"]
      },
      Tuesday: {
        breakfast: ["Idli", "Sambar", "Coconut Chutney", "Fruit"],
        lunch: ["Rice", "Rajma", "Aloo Gobi", "Salad", "Pickle", "Buttermilk"],
        dinner: ["Roti", "Kadhai Paneer", "Dal Makhani", "Ice Cream"]
      },
      Wednesday: {
        breakfast: ["Upma", "Tea/Coffee", "Sprouts", "Banana"],
        lunch: ["Rice", "Sambhar", "Vegetable Korma", "Salad", "Curd", "Pickle"],
        dinner: ["Roti", "Matar Paneer", "Dal Palak", "Kheer"]
      },
      Thursday: {
        breakfast: ["Aloo Paratha", "Curd", "Tea/Coffee", "Pickle"],
        lunch: ["Rice", "Chana Dal", "Mixed Vegetable", "Salad", "Raita"],
        dinner: ["Roti", "Shahi Paneer", "Dal Tadka", "Fruit Custard"]
      },
      Friday: {
        breakfast: ["Puri", "Aloo Sabzi", "Tea/Coffee", "Fruit"],
        lunch: ["Rice", "Dal Fry", "Chole", "Salad", "Papad", "Buttermilk"],
        dinner: ["Roti", "Palak Paneer", "Black Dal", "Halwa"]
      },
      Saturday: {
        breakfast: ["Dosa", "Sambar", "Coconut Chutney", "Fruit"],
        lunch: ["Rice", "Sambhar", "Bhindi Fry", "Salad", "Curd", "Pickle"],
        dinner: ["Puri", "Aloo Curry", "Dal Makhani", "Sweet (Rasmalai)"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Tea/Coffee", "Fruit Bowl"],
        lunch: ["Veg Biryani", "Raita", "Paneer Curry", "Salad", "Papad"],
        dinner: ["Roti", "Malai Kofta", "Dal Fry", "Ice Cream"]
      }
    }
  },
   {
    id: 2,
    name: "Karawali Mess",
    location: "Hostel 1",
    type: "Veg/Non-Veg",
    vacancyCount: 8,
    rating: 4.8,
    menuPreview: "Mixed Thali, Rice, Dal Tadka, Papad",
    timings: {
      breakfast: "7:00 - 9:30 AM",
      lunch: "12:00 - 2:30 PM",
      dinner: "7:00 - 10:00 PM",
    },
    facilities: ["AC", "WiFi", "Clean Dining", "Hand Sanitizer", "TV"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Poha", "Tea/Coffee", "Bread & Jam", "Boiled Eggs (Optional)"],
        lunch: ["Rice", "Dal", "Paneer Curry", "Salad", "Curd", "Chicken (Optional)"],
        dinner: ["Roti", "Mix Veg", "Dal Fry", "Halwa", "Egg Curry (Optional)"]
      },
      Tuesday: {
        breakfast: ["Upma", "Tea/Coffee", "Fruits", "Boiled Eggs (Optional)"],
        lunch: ["Rice", "Rajma", "Aloo Gobi", "Salad", "Fish Curry (Optional)"],
        dinner: ["Roti", "Paneer Butter Masala", "Dal Tadka", "Rasogulla", "Chicken Curry (Optional)"]
      },
      Wednesday: {
        breakfast: ["Dosa", "Sambar", "Chutney", "Omelette (Optional)"],
        lunch: ["Rice", "Dal", "Mixed Vegetable", "Salad", "Curd", "Mutton Curry (Optional)"],
        dinner: ["Roti", "Chana Masala", "Dal Makhani", "Sweet (Jalebi)", "Egg Curry (Optional)"]
      },
      Thursday: {
        breakfast: ["Puri Bhaji", "Tea/Coffee", "Fruits", "Boiled Eggs (Optional)"],
        lunch: ["Rice", "Dal", "Mix Vegetable", "Salad", "Chicken Curry (Optional)"],
        dinner: ["Roti", "Palak Paneer", "Dal Fry", "Fruit Custard", "Fish Fry (Optional)"]
      },
      Friday: {
        breakfast: ["Idli", "Sambar", "Chutney", "Omelette (Optional)"],
        lunch: ["Rice", "Dal", "Aloo Matar", "Salad", "Papad", "Egg Curry (Optional)"],
        dinner: ["Roti", "Kadhai Paneer", "Dal Tadka", "Ice Cream", "Chicken Biryani (Optional)"]
      },
      Saturday: {
        breakfast: ["Aloo Paratha", "Curd", "Tea/Coffee", "Boiled Eggs (Optional)"],
        lunch: ["Rice", "Dal", "Mix Vegetable", "Salad", "Raita", "Mutton Curry (Optional)"],
        dinner: ["Roti", "Matar Paneer", "Dal Fry", "Kheer", "Egg Bhurji (Optional)"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Tea/Coffee", "Fruits", "Omelette (Optional)"],
        lunch: ["Veg Pulao", "Raita", "Paneer Curry", "Chicken Biryani (Optional)"],
        dinner: ["Roti", "Malai Kofta", "Dal Makhani", "Ice Cream", "Fish Curry (Optional)"]
      }
    }
  },
  {
    id: 3,
    name: "Aravali Mess",
    location: "Hostel 2",
    type: "Non-Veg",
    vacancyCount: 0,
    rating: 4.2,
    menuPreview: "Chicken Curry, Roti, Rice, Dal Fry",
    timings: {
      breakfast: "7:30 - 9:30 AM",
      lunch: "11:30 - 1:30 PM",
      dinner: "7:30 - 9:30 PM",
    },
    facilities: ["WiFi", "Clean Dining", "Hand Sanitizer"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Bread Omelette", "Tea/Coffee", "Cornflakes", "Fruits"],
        lunch: ["Rice", "Dal", "Egg Curry", "Salad", "Papad", "Curd"],
        dinner: ["Roti", "Chicken Curry", "Dal Tadka", "Rice Kheer"]
      },
      Tuesday: {
        breakfast: ["Paratha", "Curd", "Tea/Coffee", "Boiled Eggs"],
        lunch: ["Rice", "Dal", "Fish Curry", "Salad", "Pickle", "Buttermilk"],
        dinner: ["Roti", "Mutton Curry", "Dal Fry", "Rasmalai"]
      },
      Wednesday: {
        breakfast: ["Poha", "Tea/Coffee", "Boiled Eggs", "Fruits"],
        lunch: ["Rice", "Dal Makhani", "Chicken Masala", "Salad", "Papad"],
        dinner: ["Roti", "Egg Bhurji", "Dal Tadka", "Sweet (Jalebi)"]
      },
      Thursday: {
        breakfast: ["Sandwich", "Tea/Coffee", "Omelette", "Fruits"],
        lunch: ["Rice", "Dal", "Fish Fry", "Salad", "Raita", "Pickle"],
        dinner: ["Roti", "Butter Chicken", "Dal Fry", "Ice Cream"]
      },
      Friday: {
        breakfast: ["Idli", "Sambar", "Chutney", "Boiled Eggs"],
        lunch: ["Rice", "Dal", "Egg Curry", "Mixed Veg", "Salad", "Curd"],
        dinner: ["Roti", "Chicken Biryani", "Raita", "Fruit Custard"]
      },
      Saturday: {
        breakfast: ["Aloo Paratha", "Curd", "Tea/Coffee", "Boiled Eggs"],
        lunch: ["Rice", "Dal", "Mutton Curry", "Salad", "Papad", "Pickle"],
        dinner: ["Roti", "Egg Curry", "Dal Tadka", "Kheer"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Tea/Coffee", "Omelette", "Fruits"],
        lunch: ["Chicken Biryani", "Raita", "Salad", "Papad"],
        dinner: ["Roti", "Grilled Fish", "Dal Makhani", "Ice Cream"]
      }
    }
  },
  {
    id: 4,
    name: "Vindhya Mess",
    location: "Block 3",
    type: "Non-Veg",
    vacancyCount: 4,
    rating: 4.4,
    menuPreview: "Chicken Biryani, Roti, Dal, Ice Cream",
    timings: {
      breakfast: "7:30 - 9:30 AM",
      lunch: "12:00 - 2:00 PM",
      dinner: "7:00 - 9:30 PM"
    },
    facilities: ["WiFi", "Clean Dining", "TV", "Hand Sanitizer"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Bread Omelette", "Tea/Coffee", "Fruit Bowl"],
        lunch: ["Rice", "Dal", "Chicken Curry", "Salad", "Curd"],
        dinner: ["Roti", "Egg Masala", "Dal Fry", "Kheer"]
      },
      Tuesday: {
        breakfast: ["Upma", "Boiled Eggs", "Tea/Coffee"],
        lunch: ["Rice", "Fish Curry", "Mixed Veg", "Buttermilk"],
        dinner: ["Roti", "Mutton Curry", "Dal Tadka", "Rasmalai"]
      },
      Wednesday: {
        breakfast: ["Poha", "Tea/Coffee", "Banana"],
        lunch: ["Rice", "Rajma", "Chicken Masala", "Salad"],
        dinner: ["Roti", "Egg Bhurji", "Dal Fry", "Halwa"]
      },
      Thursday: {
        breakfast: ["Sandwich", "Boiled Eggs", "Tea/Coffee"],
        lunch: ["Rice", "Dal", "Grilled Fish", "Pickle", "Curd"],
        dinner: ["Roti", "Butter Chicken", "Dal Makhani", "Ice Cream"]
      },
      Friday: {
        breakfast: ["Idli", "Sambar", "Eggs", "Tea"],
        lunch: ["Rice", "Chole", "Chicken Fry", "Salad", "Papad"],
        dinner: ["Roti", "Chicken Biryani", "Raita", "Custard"]
      },
      Saturday: {
        breakfast: ["Paratha", "Curd", "Boiled Eggs", "Tea"],
        lunch: ["Rice", "Dal", "Egg Curry", "Mixed Veg"],
        dinner: ["Roti", "Fish Curry", "Dal Fry", "Kheer"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Fruit Juice", "Boiled Eggs"],
        lunch: ["Chicken Biryani", "Raita", "Salad", "Papad"],
        dinner: ["Roti", "Grilled Chicken", "Dal Makhani", "Ice Cream"]
      }
    }
  },
  {
    id: 5,
    name: "Satpura Mess",
    location: "Block 4",
    type: "Non-Veg",
    vacancyCount: 3,
    rating: 4.3,
    menuPreview: "Mutton Curry, Rice, Salad, Fruit Custard",
    timings: {
      breakfast: "7:00 - 9:00 AM",
      lunch: "12:00 - 2:30 PM",
      dinner: "7:00 - 9:30 PM"
    },
    facilities: ["WiFi", "Clean Dining", "Hand Sanitizer"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Omelette", "Toast", "Tea"],
        lunch: ["Rice", "Dal", "Chicken Masala", "Salad"],
        dinner: ["Roti", "Mutton Curry", "Dal Fry", "Kheer"]
      },
      Tuesday: {
        breakfast: ["Idli", "Sambar", "Tea"],
        lunch: ["Rice", "Fish Curry", "Mixed Veg", "Curd"],
        dinner: ["Roti", "Butter Chicken", "Dal", "Sweet"]
      },
      Wednesday: {
        breakfast: ["Paratha", "Curd", "Boiled Eggs"],
        lunch: ["Rice", "Dal", "Egg Curry", "Pickle"],
        dinner: ["Roti", "Chicken Korma", "Dal Fry", "Halwa"]
      },
      Thursday: {
        breakfast: ["Dosa", "Sambar", "Tea"],
        lunch: ["Rice", "Rajma", "Grilled Chicken", "Salad"],
        dinner: ["Roti", "Fish Masala", "Dal Tadka", "Custard"]
      },
      Friday: {
        breakfast: ["Poha", "Fruits", "Tea"],
        lunch: ["Chicken Biryani", "Raita", "Papad"],
        dinner: ["Roti", "Egg Bhurji", "Dal", "Ice Cream"]
      },
      Saturday: {
        breakfast: ["Bread Butter", "Boiled Eggs", "Tea"],
        lunch: ["Rice", "Dal", "Mutton Curry", "Salad"],
        dinner: ["Roti", "Fish Fry", "Dal Fry", "Rasmalai"]
      },
      Sunday: {
        breakfast: ["Aloo Paratha", "Curd", "Boiled Eggs"],
        lunch: ["Rice", "Paneer Curry", "Chicken (Optional)", "Salad"],
        dinner: ["Roti", "Butter Chicken", "Dal Makhani", "Ice Cream"]
      }
    }
  },
  {
    id: 6,
    name: "Tripura Mess",
    location: "Block 5",
    type: "Veg",
    vacancyCount: 7,
    rating: 4.1,
    menuPreview: "Aloo Gobi, Roti, Rice, Curd",
    timings: {
      breakfast: "7:30 - 10:00 AM",
      lunch: "12:00 - 2:00 PM",
      dinner: "7:00 - 9:00 PM"
    },
    facilities: ["Clean Dining", "Hand Sanitizer"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Poha", "Tea", "Banana"],
        lunch: ["Rice", "Dal", "Aloo Gobi", "Salad", "Curd"],
        dinner: ["Roti", "Paneer Butter Masala", "Dal Fry", "Halwa"]
      },
      Tuesday: {
        breakfast: ["Upma", "Chutney", "Tea"],
        lunch: ["Rice", "Rajma", "Mix Veg", "Pickle"],
        dinner: ["Roti", "Shahi Paneer", "Dal Makhani", "Custard"]
      },
      Wednesday: {
        breakfast: ["Idli", "Sambar", "Fruits"],
        lunch: ["Rice", "Chole", "Bhindi Fry", "Curd"],
        dinner: ["Roti", "Aloo Palak", "Dal Fry", "Kheer"]
      },
      Thursday: {
        breakfast: ["Aloo Paratha", "Curd", "Tea"],
        lunch: ["Veg Biryani", "Raita", "Salad"],
        dinner: ["Roti", "Kadhai Paneer", "Dal Tadka", "Rasogulla"]
      },
      Friday: {
        breakfast: ["Dosa", "Sambar", "Chutney"],
        lunch: ["Rice", "Dal", "Mix Veg", "Pickle"],
        dinner: ["Roti", "Palak Paneer", "Dal", "Ice Cream"]
      },
      Saturday: {
        breakfast: ["Sandwich", "Tea", "Fruit Bowl"],
        lunch: ["Rice", "Chana Dal", "Aloo Matar", "Curd"],
        dinner: ["Roti", "Veg Kofta", "Dal Fry", "Halwa"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Juice"],
        lunch: ["Veg Pulao", "Paneer Curry", "Salad"],
        dinner: ["Roti", "Malai Kofta", "Dal Makhani", "Ice Cream"]
      }
    }
  },
  {
    id: 7,
    name: "Netravati Mess",
    location: "Girls Block",
    type: "Veg/Non-Veg",
    vacancyCount: 6,
    rating: 4.6,
    menuPreview: "Mixed Thali, Rice, Dal, Optional Non-Veg",
    timings: {
      breakfast: "7:00 - 9:30 AM",
      lunch: "12:00 - 2:00 PM",
      dinner: "7:00 - 9:30 PM"
    },
    facilities: ["AC", "WiFi", "TV", "Hand Sanitizer"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Bread & Jam", "Boiled Eggs (Opt)", "Tea"],
        lunch: ["Rice", "Dal", "Paneer Curry", "Chicken Curry (Opt)", "Curd"],
        dinner: ["Roti", "Mixed Veg", "Dal Fry", "Kheer", "Egg Curry (Opt)"]
      },
      Tuesday: {
        breakfast: ["Upma", "Tea", "Fruits"],
        lunch: ["Rice", "Rajma", "Fish Curry (Opt)", "Salad"],
        dinner: ["Roti", "Shahi Paneer", "Dal Tadka", "Ice Cream"]
      },
      Wednesday: {
        breakfast: ["Dosa", "Sambar", "Boiled Eggs (Opt)"],
        lunch: ["Rice", "Dal", "Veg Kurma", "Mutton Curry (Opt)", "Salad"],
        dinner: ["Roti", "Palak Paneer", "Dal", "Halwa"]
      },
      Thursday: {
        breakfast: ["Aloo Paratha", "Curd", "Tea"],
        lunch: ["Veg Biryani", "Raita", "Chicken Fry (Opt)"],
        dinner: ["Roti", "Mix Veg", "Dal Fry", "Custard"]
      },
      Friday: {
        breakfast: ["Idli", "Sambar", "Eggs (Opt)"],
        lunch: ["Rice", "Dal", "Chole", "Fish Fry (Opt)"],
        dinner: ["Roti", "Kadhai Paneer", "Dal", "Rasmalai"]
      },
      Saturday: {
        breakfast: ["Poha", "Fruit Bowl", "Tea"],
        lunch: ["Rice", "Dal", "Egg Curry (Opt)", "Salad"],
        dinner: ["Roti", "Paneer Bhurji", "Dal Fry", "Kheer"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Juice"],
        lunch: ["Paneer Biryani", "Chicken Biryani (Opt)", "Raita"],
        dinner: ["Roti", "Malai Kofta", "Dal Makhani", "Ice Cream"]
      }
    }
  },
  {
    id: 8,
    name: "Pushpanjali Mess",
    location: "PG Block",
    type: "Veg",
    vacancyCount: 10,
    rating: 4.0,
    menuPreview: "Roti, Mix Veg, Rice, Dal Tadka",
    timings: {
      breakfast: "7:30 - 9:00 AM",
      lunch: "12:00 - 2:00 PM",
      dinner: "7:30 - 9:30 PM"
    },
    facilities: ["Clean Dining", "WiFi", "Hand Sanitizer"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Poha", "Tea"],
        lunch: ["Rice", "Dal", "Aloo Gobi", "Salad"],
        dinner: ["Roti", "Paneer Masala", "Dal Fry", "Kheer"]
      },
      Tuesday: {
        breakfast: ["Upma", "Chutney", "Tea"],
        lunch: ["Rice", "Rajma", "Bhindi Fry"],
        dinner: ["Roti", "Shahi Paneer", "Dal", "Ice Cream"]
      },
      Wednesday: {
        breakfast: ["Idli", "Sambar"],
        lunch: ["Rice", "Chole", "Mixed Veg"],
        dinner: ["Roti", "Aloo Palak", "Dal Fry", "Halwa"]
      },
      Thursday: {
        breakfast: ["Aloo Paratha", "Curd"],
        lunch: ["Veg Biryani", "Raita", "Salad"],
        dinner: ["Roti", "Kadhai Paneer", "Dal", "Custard"]
      },
      Friday: {
        breakfast: ["Dosa", "Chutney", "Tea"],
        lunch: ["Rice", "Dal", "Vegetable Kofta"],
        dinner: ["Roti", "Palak Paneer", "Dal Makhani", "Rasmalai"]
      },
      Saturday: {
        breakfast: ["Sandwich", "Fruit Bowl"],
        lunch: ["Rice", "Chana Dal", "Aloo Matar"],
        dinner: ["Roti", "Mix Veg", "Dal Fry", "Ice Cream"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Juice"],
        lunch: ["Pulao", "Raita", "Paneer Curry"],
        dinner: ["Roti", "Malai Kofta", "Dal", "Kheer"]
      }
    }
  },
  {
    id: 9,
    name: "Trishul Mess",
    location: "MTech Block",
    type: "Non-Veg",
    vacancyCount: 15,
    rating: 4.5,
    menuPreview: "Chicken Curry, Jeera Rice, Egg Curry, Dal",
    timings: {
      breakfast: "8:00 - 9:30 AM",
      lunch: "12:30 - 2:30 PM",
      dinner: "7:00 - 9:30 PM"
    },
    facilities: ["Clean Dining", "Separate Non-Veg Section", "Meat Quality Checks"],
    weeklyMenu: {
      Monday: {
        breakfast: ["Egg Bhurji", "Bread", "Tea"],
        lunch: ["Chicken Curry", "Jeera Rice", "Mix Veg", "Gulab Jamun"],
        dinner: ["Roti", "Dal Tadka", "Fried Chicken", "Kheer"]
      },
      Tuesday: {
        breakfast: ["Boiled Eggs", "Paratha", "Milk"],
        lunch: ["Fish Fry", "Rice", "Dal", "Salad"],
        dinner: ["Roti", "Egg Curry", "Veg Pulao", "Custard"]
      },
      Wednesday: {
        breakfast: ["Omelette", "Toast", "Juice"],
        lunch: ["Chicken Masala", "Plain Rice", "Paneer Bhurji"],
        dinner: ["Roti", "Dal Makhani", "Aloo Capsicum", "Halwa"]
      },
      Thursday: {
        breakfast: ["Veg Sandwich", "Fruit Bowl"],
        lunch: ["Mutton Keema", "Lachha Paratha", "Curd", "Salad"],
        dinner: ["Roti", "Paneer Butter Masala", "Rice", "Kheer"]
      },
      Friday: {
        breakfast: ["Poha", "Boiled Eggs", "Tea"],
        lunch: ["Chicken Biryani", "Onion Raita", "Salad"],
        dinner: ["Roti", "Egg Bhurji", "Mixed Veg", "Ice Cream"]
      },
      Saturday: {
        breakfast: ["Idli", "Sambar", "Boiled Egg"],
        lunch: ["Chilli Chicken", "Fried Rice", "Dal Fry"],
        dinner: ["Roti", "Paneer Curry", "Rice", "Custard"]
      },
      Sunday: {
        breakfast: ["Chole Bhature", "Juice"],
        lunch: ["Butter Chicken", "Naan", "Salad", "Raita"],
        dinner: ["Roti", "Mutton Curry", "Dal", "Ice Cream"]
      }
    }
  }
  
];

// Function to seed initial mess data if not already present
const seedMessData = async () => {
  try {
    const count = await Mess.countDocuments();
    
    if (count === 0) {
      console.log("Seeding initial mess data...");
      await Mess.insertMany(initialMessData);
      console.log("Mess data seeded successfully!");
    } else {
      console.log("Mess data already exists, skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding mess data:", error);
  }
};

module.exports = seedMessData;