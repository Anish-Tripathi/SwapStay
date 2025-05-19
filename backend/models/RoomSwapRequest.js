const mongoose = require('mongoose');

const RoomSwapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requesterRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  requestedRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the swap request']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  requesterAccepted: {
    type: Boolean,
    default: true
  },
  recipientAccepted: {
    type: Boolean,
    default: false
  },
  rejectionReason: {
    type: String,
    default: null
  },
  viewed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  requesterLastRead: {
    type: Date,
    default: null
  },
  recipientLastRead: {
    type: Date,
    default: null
  },
  lastMessageAt: {
    type: Date
  },
  lastMessageText: {
    type: String
  },
  lastMessageSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('RoomSwapRequest', mongoose.models.RoomSwapRequest || RoomSwapRequestSchema);
