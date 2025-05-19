const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Create a new booking
router.post('/', protect, bookingController.createBooking);

// Process payment for a booking
router.post('/:id/payment', bookingController.processPayment);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Get user's booking history
router.get('/user/:userId', bookingController.getUserBookingHistory);

// Complete a booking (after checkout)
router.post('/:id/complete', bookingController.completeBooking);

// Cancel booking
router.post('/:id/cancel', bookingController.cancelBooking);

router.use((req, res, next) => {
  console.log(`Booking route hit: ${req.method} ${req.path}`);
  next();
});

module.exports = router;