const mongoose = require('mongoose');

const GuestHouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  totalRooms: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  // Reference to rooms collection
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('GuestHouse', GuestHouseSchema);