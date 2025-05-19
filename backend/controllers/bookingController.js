 
const Booking = require('../models/Booking');
const Room = require('../models/GuestRoom'); 
const User = require('../models/User');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Find user to get additional details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      roomId,
      guestHouseId,
      checkInDate,
      checkOutDate,
      totalPrice,
      numberOfGuests,
      guestNames
    } = req.body;

    // Validate required fields
    if (!roomId || !guestHouseId || !checkInDate || !checkOutDate || !totalPrice) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        requiredFields: ['roomId', 'guestHouseId', 'checkInDate', 'checkOutDate', 'totalPrice']
      });
    }
    
    // Parse dates
    const parsedCheckInDate = new Date(checkInDate);
    const parsedCheckOutDate = new Date(checkOutDate);

    // Validate dates
    if (isNaN(parsedCheckInDate)){
      return res.status(400).json({ message: 'Invalid check-in date format' });
    }
    if (isNaN(parsedCheckOutDate)) {
      return res.status(400).json({ message: 'Invalid check-out date format' });
    }
    if (parsedCheckInDate >= parsedCheckOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check room availability
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const existingBookings = await Booking.find({
      roomId,
      status: { $ne: 'cancelled' },
      $or: [
        { checkInDate: { $lte: parsedCheckInDate }, checkOutDate: { $gt: parsedCheckInDate } },
        { checkInDate: { $gte: parsedCheckInDate, $lt: parsedCheckOutDate } },
        { checkInDate: { $lte: parsedCheckInDate }, checkOutDate: { $gte: parsedCheckOutDate } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    // Format guest names
    const formattedGuestNames = Array.isArray(guestNames) 
      ? guestNames.filter(name => name.trim()) 
      : guestNames.split(',').map(name => name.trim()).filter(name => name);

    // Create new booking
       const newBooking = new Booking({
  userId,
  roomId,
  guestHouseId,
  checkInDate: parsedCheckInDate,
  checkOutDate: parsedCheckOutDate,
  totalPrice,
  studentName: user.name,
  rollNo: user.rollNo,
  numberOfGuests: numberOfGuests || 1,
  guestNames: formattedGuestNames,
  status: 'pending',
  paymentStatus: 'pending',
  roomDetails: {
    name: req.body.roomDetails?.name || room.name || "Guest Room", 
    type: req.body.roomDetails?.type || room.type || "Standard",   
    capacity: room.capacity, 
    price: room.price,       
    number: room.number       
  }
     });
    await newBooking.save();
    
    // Populate references for response
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('user', 'name email rollNo')
      .populate('room', 'name type capacity price')
      .populate('guestHouse', 'name location');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking', 
      error: error.message
    });
  }
};

// Process payment for a booking
exports.processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { method, details } = req.body;

    // Validate payment method
    const validMethods = ['card', 'upi', 'cash'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ 
        message: 'Invalid payment method',
        validMethods
      });
    }

    if (method === 'card') {
      if (!details.cardNumber || !details.cardName || !details.expiry || !details.cvv) {
        return res.status(400).json({ 
          message: 'Missing card details',
          requiredFields: ['cardNumber', 'cardName', 'expiry', 'cvv']
        });
      }
      
      // Simple card validation
      if (details.cardNumber.replace(/\D/g, '').length !== 16) {
        return res.status(400).json({ message: 'Invalid card number' });
      }
    }

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot process payment for cancelled booking' });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment has already been processed' });
    }

    const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Update booking with payment info
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    booking.paymentMethod = method;
    booking.paymentDetails = {
      method,
      ...details,
      processedAt: new Date()
    };
    
    await booking.save();
  
    res.status(200).json({
      success: true,
      booking,
      paymentId,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      message: 'Error processing payment', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('roomId')
      .populate('guestHouseId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      message: 'Error fetching booking', 
      error: error.message 
    });
  }
};

// Get user's booking history
exports.getUserBookingHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, sortBy = 'checkInDate', sortOrder = 'desc', limit = 10, page = 1 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const query = { userId };
    
    if (status === 'upcoming') {
  // Include both pending AND confirmed upcoming bookings
      query.status = { $in: ['pending', 'confirmed'] };
      query.checkInDate = { $gt: new Date() };
      } 
   else if (status === 'active') {
  // Only confirmed and ongoing stays (exclude pending)
      query.status = 'confirmed';
      query.checkOutDate = { $gte: new Date() };
    } 
    else if (status === 'past') {
  // Past stays (completed or confirmed, but checkout passed)
      query.checkOutDate = { $lt: new Date() };
      query.status = { $in: ['confirmed', 'completed'] }; // Exclude pending
    }
       else if (status === 'cancelled') {
        query.status = 'cancelled';
     }
     else {
       query.status = status;
      }
    
    // Determine sort direction
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Count total documents for pagination
    const total = await Booking.countDocuments(query);
    
    // Get bookings
    const bookings = await Booking.find(query)
  .populate('roomId')
  .populate('guestHouseId')
  .lean(); 

     const processedBookings = bookings.map(booking => {
       if (booking.roomDetails) {
       return {
      ...booking,
      roomId: booking.roomDetails
    };
     }
     return booking;
    });

    res.status(200).json({
    bookings: processedBookings,
    pagination: {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / parseInt(limit))
  }
});
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ 
      message: 'Error fetching booking history', 
      error: error.message 
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      message: 'Error cancelling booking', 
      error: error.message 
    });
  }
};

// Update booking status to completed (after checkout)
exports.completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot complete a cancelled booking' });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Booking is already completed' });
    }
    
    booking.status = 'completed';
    await booking.save();
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({ 
      message: 'Error completing booking', 
      error: error.message 
    });
  }
};