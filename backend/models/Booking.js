const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  guestHouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuestHouse',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  studentName: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  guestNames: {
    type: [String],
    default: []
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String
  },
  paymentDetails: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  roomDetails: {
    name: { type: String, required: false },
    type: { type: String, required: false },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    number: { type: String, required: true }
  },
  guestHouseDetails: {
    name: String
  }
}, 
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

BookingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

BookingSchema.virtual('room', {
  ref: 'Room',
  localField: 'roomId',
  foreignField: '_id',
  justOne: true
});

BookingSchema.virtual('guestHouse', {
  ref: 'GuestHouse',
  localField: 'guestHouseId',
  foreignField: '_id',
  justOne: true
});

BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);