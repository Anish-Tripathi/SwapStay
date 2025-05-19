const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['technical', 'room-condition', 'swap-issue', 'user-behavior', 'maintenance', 'other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent']
  },
  email: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'resolved', 'closed']
  },
  evidenceFile: {
    type: String, 
    required: false
  },
  complaintId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Generate a complaint ID before saving
ComplaintSchema.pre('save', function(next) {
  if (!this.complaintId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Generate a random 4-digit number
    const random = Math.floor(1000 + Math.random() * 9000);
    
    this.complaintId = `COMP-${year}${month}${day}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', ComplaintSchema);