const GuestHouse = require('../models/GuestHouse');
const Room = require('../models/GuestRoom');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// Get all guest houses with available rooms
exports.getGuestHouses = async (req, res) => {
  try {
    // Get query parameters for date filtering
    const { checkIn, checkOut } = req.query;
    
    // First get all guesthouses
    const guestHouses = await GuestHouse.find().lean();
    
    // For each guesthouse, get its rooms and check availability
    const result = await Promise.all(guestHouses.map(async (guestHouse) => {
      // Get all rooms for this guesthouse
      const rooms = await Room.find({ guestHouse: guestHouse._id }).lean();
      
      // If date range is provided, filter out booked rooms
      let availableRooms = rooms;
      
      if (checkIn && checkOut) {
        // Convert to Date objects
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        // Get all bookings that overlap with the requested date range
        const bookings = await Booking.find({
          roomId: { $in: rooms.map(room => room._id) },
          status: { $ne: 'cancelled' },
          $or: [
            // Case 1: booking starts before checkIn and ends after checkIn
            { checkInDate: { $lte: checkInDate }, checkOutDate: { $gt: checkInDate } },
            // Case 2: booking starts during the requested period
            { checkInDate: { $gt: checkInDate, $lt: checkOutDate } },
            // Case 3: booking exactly matches the requested period
            { checkInDate: checkInDate, checkOutDate: checkOutDate }
          ]
        });
        
        // Get IDs of rooms that are already booked
        const bookedRoomIds = bookings.map(booking => booking.roomId.toString());
        
        // Filter out booked rooms
        availableRooms = rooms.filter(room => 
          !bookedRoomIds.includes(room._id.toString())
        );
      }
      
      // Return guesthouse with available rooms
      return {
        ...guestHouse,
        rooms: availableRooms,
        availableRoomCount: availableRooms.length
      };
    }));
    
    // Return only guesthouses that have available rooms
    const guestHousesWithAvailableRooms = result.filter(
      guestHouse => guestHouse.availableRoomCount > 0
    );
    
    res.status(200).json(guestHousesWithAvailableRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guest houses', error: error.message });
  }
};

// Get specific guest house details with available rooms
exports.getGuestHouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;
    
    // Find the guesthouse
    const guestHouse = await GuestHouse.findById(id).lean();
    
    if (!guestHouse) {
      return res.status(404).json({ message: 'Guest house not found' });
    }
    
    // Get all rooms for this guesthouse
    const rooms = await Room.find({ guestHouse: guestHouse._id }).lean();
    
    // If date range is provided, filter out booked rooms
    let availableRooms = rooms;
    
    if (checkIn && checkOut) {
      // Convert to Date objects
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Get all bookings that overlap with the requested date range
      const bookings = await Booking.find({
        roomId: { $in: rooms.map(room => room._id) },
        status: { $ne: 'cancelled' },
        $or: [
          // Case 1: booking starts before checkIn and ends after checkIn
          { checkInDate: { $lte: checkInDate }, checkOutDate: { $gt: checkInDate } },
          // Case 2: booking starts during the requested period
          { checkInDate: { $gt: checkInDate, $lt: checkOutDate } },
          // Case 3: booking exactly matches the requested period
          { checkInDate: checkInDate, checkOutDate: checkOutDate }
        ]
      });
      
      // Get IDs of rooms that are already booked
      const bookedRoomIds = bookings.map(booking => booking.roomId.toString());
      
      // Filter out booked rooms
      availableRooms = rooms.filter(room => 
        !bookedRoomIds.includes(room._id.toString())
      );
    }
    
    // Return guesthouse with available rooms
    res.status(200).json({
      ...guestHouse,
      rooms: availableRooms
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guest house', error: error.message });
  }
};

// Get available rooms based on date parameters
exports.getAvailableRooms = async (req, res) => {
  try {
    const { guestHouseId, checkIn, checkOut } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }
    
    // Convert to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }
    
    // Build query to find rooms
    const query = {};
    if (guestHouseId) {
      query.guestHouse = mongoose.Types.ObjectId(guestHouseId);
    }
    
    // Get all rooms matching the query
    const rooms = await Room.find(query).lean();
    
    // Get all bookings that overlap with the requested date range
    const bookings = await Booking.find({
      roomId: { $in: rooms.map(room => room._id) },
      status: { $ne: 'cancelled' },
      $or: [
        // Case 1: booking starts before checkIn and ends after checkIn
        { checkInDate: { $lte: checkInDate }, checkOutDate: { $gt: checkInDate } },
        // Case 2: booking starts during the requested period
        { checkInDate: { $gt: checkInDate, $lt: checkOutDate } },
        // Case 3: booking exactly matches the requested period
        { checkInDate: checkInDate, checkOutDate: checkOutDate }
      ]
    });
    
    // Get IDs of rooms that are already booked
    const bookedRoomIds = bookings.map(booking => booking.roomId.toString());
    
    // Filter out booked rooms
    const availableRooms = rooms.filter(room => 
      !bookedRoomIds.includes(room._id.toString())
    );
    
    res.status(200).json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available rooms', error: error.message });
  }
};