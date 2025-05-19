const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockType: {
    type: String,
    required: true,
    enum: ['Boys Hostel', 'Girls Hostel', 'MT Blocks']
  },
  blockName: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  wing: {
    type: String,
    default: ''
  },
  sharing: {
    type: String,
    required: true,
    enum: ['Single Sharing', 'Double Sharing', 'Triple Sharing', 'Four Sharing']
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String 
  }],
  amenities: {
    type: [String],
    default: []
  },
  availableForSwap: {
    type: Boolean,
    default: true
  },
  datePosted: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);