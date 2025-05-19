const mongoose = require('mongoose');

const  GuestRoomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  beds: {
    type: Number,
    required: true,
    min: 1
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  // Reference to parent guesthouse
  guestHouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuestHouse',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GuestRoomModel', GuestRoomSchema);