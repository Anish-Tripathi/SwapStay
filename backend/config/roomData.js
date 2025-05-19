export const guesthouses = [
  {
    _id: guestHouseIds.JCBose,
    name: "J C Bose Guest House",
    description: "Located near the main gate, Sahyadri Guest House offers a serene environment with views of the Western Ghats. Ideal for visiting faculty and guests.",
    features: ["Air-conditioned rooms", "Wi-Fi", "24x7 Security", "Complimentary breakfast"],
    totalRooms: 6,
    image: "https://srhu.edu.in/wp-content/uploads/2018/01/9.-Guest-House.jpg",
    rooms: [] // Will be populated with room ObjectIds
  },
  {
    _id: guestHouseIds.VikramSarabhai,
    name: "Vikram Sarabhai Guest House",
    description: "Just a minute's walk from NITK Beach, this guest house offers peaceful accommodation with sea breeze and stunning sunset views.",
    features: ["Sea-facing rooms", "Free Wi-Fi", "Conference room", "Private balcony"],
    totalRooms: 6,
    image: "https://th.bing.com/th/id/OIP.xJoA99rYTt2XyROLaSs3VQHaDk?rs=1&pid=ImgDetMain",
    rooms: [] // Will be populated with room ObjectIds
  },
  {
    _id: guestHouseIds.HomiJBhaba,
    name: "Homi J Bhaba Guest House",
    description: "Built to commemorate NITK's silver jubilee, this guest house offers premium facilities for alumni and VIP guests.",
    features: ["Executive suites", "Cafeteria", "Work desk", "Gym access"],
    totalRooms: 6,
    image: "https://example.com/images/silverjubilee.jpg",
    rooms: [] // Will be populated with room ObjectIds
  },
  {
    _id: guestHouseIds.AcademicBlock,
    name: "Academic Block Residency",
    description: "Conveniently located near the main academic block, this guest house is best suited for guest lecturers and seminar speakers.",
    features: ["Proximity to lecture halls", "Wi-Fi", "Library access", "In-house dining"],
    totalRooms: 6,
    image: "https://jvbi.ac.in/images/facilities/17guest-house/img4.jpg",
    rooms: [] // Will be populated with room ObjectIds
  },
  {
    _id: guestHouseIds.Lakeview,
    name: "Lakeview Guest House",
    description: "Overlooking the NITK lake, this guest house offers tranquil views and a peaceful environment for researchers and visitors.",
    features: ["Lake view", "Outdoor seating", "Study desk", "Room service"],
    totalRooms: 6,
    image: "https://cache.careers360.mobi/media/presets/720X480/colleges/social-media/media-gallery/2488/2018/7/27/University-Institute-of-Engineering-and-Technology-CSJMU-Kanpur-5.jpg",
    rooms: [] // Will be populated with room ObjectIds
  },
  {
    _id: guestHouseIds.International,
    name: "International Guest House",
    description: "Designed for international delegates and collaborations, this guest house offers luxurious amenities and high security.",
    features: ["Luxury suites", "Airport pickup", "24/7 concierge", "Mini fridge"],
    totalRooms: 6,
    image: "https://t-ec.bstatic.com/xdata/images/hotel/max500/96870272.jpg?k=7ce485bbe5758b31a2c39d6b4025f88d2b59bfbc27feb27c9648dd82de1c97e7&o=",
    rooms: [] // Will be populated with room ObjectIds
  }
];

export const rooms = [
  // J C Bose Guest House Rooms
  {
    _id: new mongoose.Types.ObjectId(),
    number: "JCB-101",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Comfortable twin room with study desks, ideal for visiting faculty.",
    features: ["Wi-Fi", "Air Conditioning", "Study Desk"],
    price: 1500,
    image: "https://images.unsplash.com/photo-1560448070-4328d9e1d4b1",
    guestHouse: guestHouseIds.JCBose
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "JCB-102",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Cozy single room with a serene view of the campus greenery.",
    features: ["Wi-Fi", "Air Conditioning", "Balcony"],
    price: 1200,
    image: "https://images.unsplash.com/photo-1582719478170-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.JCBose
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "JCB-103",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Spacious room with modern amenities and comfortable bedding.",
    features: ["Wi-Fi", "Air Conditioning", "Mini Fridge"],
    price: 1600,
    image: "https://images.unsplash.com/photo-1590490350330-5d4d8f3f3f3f",
    guestHouse: guestHouseIds.JCBose
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "JCB-104",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Elegant room with a work desk and high-speed internet.",
    features: ["Wi-Fi", "Air Conditioning", "Work Desk"],
    price: 1300,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    guestHouse: guestHouseIds.JCBose
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "JCB-105",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Bright room with ample space and comfortable furnishings.",
    features: ["Wi-Fi", "Air Conditioning", "Wardrobe"],
    price: 1550,
    image: "https://images.unsplash.com/photo-1616627987935-1e1b5d5d5d5d",
    guestHouse: guestHouseIds.JCBose
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "JCB-106",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Quiet room suitable for solo travelers and short stays.",
    features: ["Wi-Fi", "Air Conditioning", "Reading Lamp"],
    price: 1250,
    image: "https://images.unsplash.com/photo-1582719478180-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.JCBose
  },

  // Vikram Sarabhai Guest House Rooms
  {
    _id: new mongoose.Types.ObjectId(),
    number: "VS-201",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Modern room with a view of the academic block.",
    features: ["Wi-Fi", "Air Conditioning", "Smart TV"],
    price: 1600,
    image: "https://images.unsplash.com/photo-1590490350330-5d4d8f3f3f3f",
    guestHouse: guestHouseIds.VikramSarabhai
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "VS-202",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Compact room with essential amenities for a comfortable stay.",
    features: ["Wi-Fi", "Air Conditioning", "Mini Fridge"],
    price: 1300,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    guestHouse: guestHouseIds.VikramSarabhai
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "VS-203",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Spacious room with modern decor and facilities.",
    features: ["Wi-Fi", "Air Conditioning", "Work Desk"],
    price: 1650,
    image: "https://images.unsplash.com/photo-1616627987935-1e1b5d5d5d5d",
    guestHouse: guestHouseIds.VikramSarabhai
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "VS-204",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Quiet room with a comfortable bed and study area.",
    features: ["Wi-Fi", "Air Conditioning", "Reading Lamp"],
    price: 1350,
    image: "https://images.unsplash.com/photo-1582719478170-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.VikramSarabhai
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "VS-205",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Well-lit room with modern furnishings and amenities.",
    features: ["Wi-Fi", "Air Conditioning", "Wardrobe"],
    price: 1700,
    image: "https://images.unsplash.com/photo-1560448070-4328d9e1d4b1",
    guestHouse: guestHouseIds.VikramSarabhai
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "VS-206",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Cozy room ideal for short stays and solo travelers.",
    features: ["Wi-Fi", "Air Conditioning", "Mini Fridge"],
    price: 1400,
    image: "https://images.unsplash.com/photo-1582719478180-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.VikramSarabhai
  },

  // Homi J Bhaba Guest House Rooms
  {
    _id: new mongoose.Types.ObjectId(),
    number: "HB-301",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Elegant room with a view of the campus landscape.",
    features: ["Wi-Fi", "Air Conditioning", "Smart TV"],
    price: 1700,
    image: "https://images.unsplash.com/photo-1590490350330-5d4d8f3f3f3f",
    guestHouse: guestHouseIds.HomiJBhaba
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "HB-302",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Well-furnished room suitable for individual guests.",
    features: ["Wi-Fi", "Desk", "Mini Fridge"],
    price: 1400,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    guestHouse: guestHouseIds.HomiJBhaba
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "HB-303",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Spacious room with balcony and garden view.",
    features: ["Wi-Fi", "Balcony", "Air Conditioning"],
    price: 1750,
    image: "https://images.unsplash.com/photo-1560448070-4328d9e1d4b1",
    guestHouse: guestHouseIds.HomiJBhaba
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "HB-304",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Simple and clean room perfect for short campus visits.",
    features: ["Wi-Fi", "Ceiling Fan", "Desk"],
    price: 1250,
    image: "https://images.unsplash.com/photo-1582719478170-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.HomiJBhaba
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "HB-305",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Ideal for family visits, includes extra sitting space.",
    features: ["Wi-Fi", "Sofa", "Hot Water"],
    price: 1800,
    image: "https://images.unsplash.com/photo-1616627987935-1e1b5d5d5d5d",
    guestHouse: guestHouseIds.HomiJBhaba
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "HB-306",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Quiet room located near the guest house library.",
    features: ["Wi-Fi", "Bookshelf", "Air Conditioning"],
    price: 1450,
    image: "https://images.unsplash.com/photo-1582719478180-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.HomiJBhaba
  },

  // Academic Block Residency Rooms
  {
    _id: new mongoose.Types.ObjectId(),
    number: "ABR-401",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Close to lecture halls, great for visiting speakers.",
    features: ["Wi-Fi", "Desk", "Printer Access"],
    price: 1600,
    image: "https://images.unsplash.com/photo-1590490350330-5d4d8f3f3f3f",
    guestHouse: guestHouseIds.AcademicBlock
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "ABR-402",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Private room ideal for academic collaborators.",
    features: ["Wi-Fi", "Air Conditioning", "Work Lamp"],
    price: 1350,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    guestHouse: guestHouseIds.AcademicBlock
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "ABR-403",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Functional room with access to seminar halls.",
    features: ["Wi-Fi", "Work Desk", "Coffee Maker"],
    price: 1700,
    image: "https://images.unsplash.com/photo-1560448070-4328d9e1d4b1",
    guestHouse: guestHouseIds.AcademicBlock
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "ABR-404",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Simple setup perfect for day-to-day academic visits.",
    features: ["Wi-Fi", "Air Conditioning", "Fan"],
    price: 1250,
    image: "https://images.unsplash.com/photo-1582719478170-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.AcademicBlock
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "ABR-405",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Large space with whiteboard and meeting table.",
    features: ["Wi-Fi", "Conference Space", "Water Dispenser"],
    price: 1850,
    image: "https://images.unsplash.com/photo-1616627987935-1e1b5d5d5d5d",
    guestHouse: guestHouseIds.AcademicBlock
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "ABR-406",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Studio room for extended faculty stays.",
    features: ["Wi-Fi", "Kitchenette", "Recliner"],
    price: 1600,
    image: "https://images.unsplash.com/photo-1582719478180-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.AcademicBlock
  },

  // Lakeview Guest House Rooms
  {
    _id: new mongoose.Types.ObjectId(),
    number: "LV-501",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Peaceful room with a beautiful view of NITK Lake.",
    features: ["Wi-Fi", "Lake View", "Balcony"],
    price: 1750,
    image: "https://images.unsplash.com/photo-1616627987935-1e1b5d5d5d5d",
    guestHouse: guestHouseIds.Lakeview
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "LV-502",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Minimalist room designed for solo guests.",
    features: ["Wi-Fi", "Natural Light", "Fan"],
    price: 1300,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    guestHouse: guestHouseIds.Lakeview
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "LV-503",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Spacious room with green surroundings and lake breeze.",
    features: ["Wi-Fi", "Balcony", "Coffee Maker"],
    price: 1800,
    image: "https://images.unsplash.com/photo-1560448070-4328d9e1d4b1",
    guestHouse: guestHouseIds.Lakeview
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "LV-504",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Room with large windows overlooking the lake path.",
    features: ["Wi-Fi", "View Deck", "Air Conditioning"],
    price: 1450,
    image: "https://images.unsplash.com/photo-1582719478170-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.Lakeview
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "LV-505",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Peaceful lakeside retreat with modern comforts.",
    features: ["Wi-Fi", "Lounge Chairs", "Desk"],
    price: 1850,
    image: "https://images.unsplash.com/photo-1590490350330-5d4d8f3f3f3f",
    guestHouse: guestHouseIds.Lakeview
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "LV-506",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Private room for researchers and visiting scholars.",
    features: ["Wi-Fi", "Bookshelf", "Coffee Table"],
    price: 1500,
    image: "https://images.unsplash.com/photo-1582719478180-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.Lakeview
  },

  // International Guest House Rooms
  {
    _id: new mongoose.Types.ObjectId(),
    number: "INT-601",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Premium room with international standards of comfort.",
    features: ["Wi-Fi", "AC", "Mini Bar"],
    price: 2000,
    image: "https://images.unsplash.com/photo-1616627987935-1e1b5d5d5d5d",
    guestHouse: guestHouseIds.International
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "INT-602",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Luxury single room for international delegates.",
    features: ["Wi-Fi", "Smart TV", "Ironing Station"],
    price: 1800,
    image: "https://images.unsplash.com/photo-1582719478170-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.International
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "INT-603",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Executive room with lounge space and high security.",
    features: ["Wi-Fi", "Security System", "Lounge"],
    price: 2200,
    image: "https://images.unsplash.com/photo-1590490350330-5d4d8f3f3f3f",
    guestHouse: guestHouseIds.International
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "INT-604",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Contemporary styled room for professional visitors.",
    features: ["Wi-Fi", "Refrigerator", "Work Table"],
    price: 1750,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    guestHouse: guestHouseIds.International
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "INT-605",
    capacity: 2,
    beds: 2,
    bathrooms: 1,
    description: "Spacious international suite with modern design.",
    features: ["Wi-Fi", "Coffee Machine", "Meeting Table"],
    price: 2300,
    image: "https://images.unsplash.com/photo-1560448070-4328d9e1d4b1",
    guestHouse: guestHouseIds.International
  },
  {
    _id: new mongoose.Types.ObjectId(),
    number: "INT-606",
    capacity: 1,
    beds: 1,
    bathrooms: 1,
    description: "Elegant room for dignitaries and special guests.",
    features: ["Wi-Fi", "Mini Bar", "24x7 Service"],
    price: 2100,
    image: "https://images.unsplash.com/photo-1582719478180-2f6f6c7f1a3e",
    guestHouse: guestHouseIds.International
  }
];