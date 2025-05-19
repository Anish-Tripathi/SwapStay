const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markAsRead, getUnreadCount } = require('../controllers/messageController');
const {protect} = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Get total unread message count 
router.get('/unread-count', getUnreadCount);

// Get messages for a specific roomSwapId
router.get('/:roomSwapId', getMessages);

// Get unread message status for a specific room
router.get('/:roomSwapId/read', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { roomSwapId } = req.params;
    
    const RoomSwapRequest = require('../models/RoomSwapRequest');
    const roomSwapRequest = await RoomSwapRequest.findById(roomSwapId);
    
    if (!roomSwapRequest) {
      return res.status(404).json({ message: 'Room swap request not found' });
    }
    
    const requesterId = roomSwapRequest.requester ? roomSwapRequest.requester.toString() : null;
    const recipientId = roomSwapRequest.recipient ? roomSwapRequest.recipient.toString() : null;
    
    // Check if user is authorized
    if (req.user.id !== requesterId && req.user.id !== recipientId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get the last read timestamp for this user
    const lastReadTimestamp = req.user.id === requesterId
      ? roomSwapRequest.requesterLastRead
      : roomSwapRequest.recipientLastRead;
    
    // Get unread messages 
    const Message = require('../models/Message'); 
    
    const unreadMessagesQuery = {
      roomSwapId,
      sender: { $ne: req.user.id },
      isRead: false
    };
    
    if (lastReadTimestamp) {
      unreadMessagesQuery.$or = [
        { timestamp: { $gt: lastReadTimestamp } },
        { isRead: false } 
      ];
    }
    
    const unreadMessages = await Message.find(unreadMessagesQuery)
      .select('_id timestamp text sender isRead')
      .lean();
    
    // Get message count
    const unreadCount = unreadMessages.length;
    
    return res.json({
      success: true,
      unreadMessages: unreadMessages.map(msg => ({
        messageId: msg._id.toString(),
        time: new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        timestamp: msg.timestamp,
        text: msg.text,
        sender: msg.sender.toString(), 
        isRead: msg.isRead === false
      })),
      unreadCount,
      lastReadTimestamp
    });
  } catch (error) {
    console.error('Error getting unread status:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a new message
router.post('/', sendMessage);

// Mark messages as read
router.put('/:roomSwapId/read', markAsRead);

module.exports = router;