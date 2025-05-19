const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  roomSwapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomSwapRequest',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isNewMsg: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Message', MessageSchema);