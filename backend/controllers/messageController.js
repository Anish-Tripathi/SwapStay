const Message = require('../models/Message');
const RoomSwapRequest = require('../models/RoomSwapRequest');
const mongoose = require('mongoose');

exports.getMessages = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { roomSwapId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(roomSwapId)) {
      return res.status(400).json({ message: 'Invalid room swap ID format' });
    }
    
    // Verify user has access to this room swap request
    const roomSwapRequest = await RoomSwapRequest.findById(roomSwapId);
    if (!roomSwapRequest) {
      return res.status(404).json({ message: 'Room swap request not found' });
    }
    
    // Use the correct field names and handle null values safely
    const requesterId = roomSwapRequest.requester ? roomSwapRequest.requester.toString() : null;
    const recipientId = roomSwapRequest.recipient ? roomSwapRequest.recipient.toString() : null;

    // Check if user is authorized to view these messages
    if (req.user.id !== requesterId && req.user.id !== recipientId) {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }
    
    // Get the last read timestamp for this user
    const lastReadTimestamp = req.user.id === requesterId 
      ? roomSwapRequest.requesterLastRead 
      : roomSwapRequest.recipientLastRead;
    
    // Get messages with pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const messages = await Message.find({ roomSwapId })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name avatar');
    
    // Process messages to add flags based on read status and timestamps
const processedMessages = messages.map(message => {
  const messageObj = message.toObject();
  const isFromOtherUser = message.sender._id.toString() !== req.user.id;
  
  // Message is unread if it's from another user AND not read
  messageObj.isUnread = isFromOtherUser && !message.isRead;
  
     // Message is new if:
     // 1. It's from another user AND
     // 2. Either:
     //    - It's explicitly marked as new (isNewMsg) OR
     //    - It was sent after the user's last read timestamp OR
     //    - It hasn't been read yet (for backward compatibility)
  messageObj.isNew = isFromOtherUser && (
    message.isNewMsg || 
    (lastReadTimestamp && message.timestamp > lastReadTimestamp) || 
    !message.isRead
  );
  
  return messageObj;
});
    
    // Get total count for pagination info
    const totalMessages = await Message.countDocuments({ roomSwapId });
      
    return res.json({
      messages: processedMessages,
      pagination: {
        total: totalMessages,
        page,
        limit,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { roomSwapId, text } = req.body;
    
    // Input validation
    if (!roomSwapId) {
      return res.status(400).json({ message: 'Room swap ID is required' });
    }
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Message text cannot be empty' });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(roomSwapId)) {
      return res.status(400).json({ message: 'Invalid room swap ID format' });
    }
    
    // Verify user has access to this room swap request
    const roomSwapRequest = await RoomSwapRequest.findById(roomSwapId);
    if (!roomSwapRequest) {
      return res.status(404).json({ message: 'Room swap request not found' });
    }
    
    // Use the correct field names and handle null values safely
    const requesterId = roomSwapRequest.requester ? roomSwapRequest.requester.toString() : null;
    const recipientId = roomSwapRequest.recipient ? roomSwapRequest.recipient.toString() : null;
    
    // Check if user is authorized to send messages
    if (req.user.id !== requesterId && req.user.id !== recipientId) {
      return res.status(403).json({ message: 'Not authorized to send messages' });
    }
    
    // Create and save new message
    const newMessage = new Message({
      roomSwapId,
      sender: req.user.id,
      recipient: req.user.id === requesterId ? recipientId : requesterId, // Add this line
      text,
      isRead: false
    });
    
    await newMessage.save();
    
    // Update the room swap request's lastMessageAt field
    await RoomSwapRequest.findByIdAndUpdate(roomSwapId, {
      lastMessageAt: new Date(),
      lastMessageText: text,
      lastMessageSender: req.user.id
    });
    
    // Populate sender info for response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name avatar');
      
    // Return message with sender details
    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { roomSwapId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(roomSwapId)) {
      return res.status(400).json({ message: 'Invalid room swap ID format' });
    }
    
    // First get the last read timestamp for this user in this conversation
    const lastReadTimestamp = new Date();
    
    // Check if there are any unread messages
    const unreadCount = await Message.countDocuments({
      roomSwapId: roomSwapId,
      sender: { $ne: req.user.id },
      isRead: false
    });
    
    // If no unread messages, return early but with the lastReadTimestamp
    if (unreadCount === 0) {
      return res.json({ 
        success: true, 
        updatedCount: 0, 
        messagesMarkedRead: 0,
        lastReadTimestamp
      });
    }
    
    // Find the room swap request with minimal field projection
    const roomSwapRequest = await RoomSwapRequest.findById(roomSwapId)
      .select('requester recipient')
      .lean();
      
    if (!roomSwapRequest) {
      return res.status(404).json({ message: 'Room swap request not found' });
    }
    
    // Use the correct field names and handle null values safely
    const requesterId = roomSwapRequest.requester ? roomSwapRequest.requester.toString() : null;
    const recipientId = roomSwapRequest.recipient ? roomSwapRequest.recipient.toString() : null;
    
    // Check if user is authorized
    if (req.user.id !== requesterId && req.user.id !== recipientId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Mark messages as read with optimized update
    const updateResult = await Message.updateMany(
      { 
        roomSwapId: roomSwapId,
        sender: { $ne: req.user.id },
        isRead: false
      },
      { 
        $set: {
          isRead: true,
          isNewMsg: false,
          lastReadAt: lastReadTimestamp
        }
      }
    );
    
    const updateField = req.user.id === requesterId 
      ? { requesterLastRead: lastReadTimestamp }
      : { recipientLastRead: lastReadTimestamp };
    
    await RoomSwapRequest.findByIdAndUpdate(
      roomSwapId,
      updateField
    );
    
    // Check if update succeeded
    if (!updateResult.acknowledged) {
     
      return res.status(500).json({ message: 'Failed to update messages' });
    }

    return res.json({ 
      success: true, 
      messagesMarkedRead: updateResult.modifiedCount,
      updatedCount: updateResult.modifiedCount,
      lastReadTimestamp
    });
      
  } catch (error) {
    console.error('Error marking messages as read:', error);
    
    return res.status(500).json({ 
      message: 'Server error while marking messages as read', 
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
};



exports.getUnreadCount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log('Authentication error - no user or user id');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.id;
   
  
    const roomSwapRequests = await RoomSwapRequest.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    }).lean();
    
    if (!roomSwapRequests || roomSwapRequests.length === 0) {
      console.log('No room swap requests found for user');
      return res.json({
        counts: {},
        newCounts: {}
      });
    }
    
    const unreadCounts = {};
    const newCounts = {};
    
    // Process each room swap request safely
    await Promise.all(roomSwapRequests.map(async (request) => {
      try {
        // Safely get the room swap ID as a string
        const roomSwapId = request._id.toString();
        
        const isRequester = request.requester && 
                           request.requester.toString() === userId;
        
        // Get total unread messages
        const unreadCount = await Message.countDocuments({
          roomSwapId,
          sender: { $ne: userId },
          isRead: false
        });
        
        const lastReadTimestamp = isRequester ? 
                                request.requesterLastRead : 
                                request.recipientLastRead;
        
        // Query for new messages
        let newMessagesQuery = {
          roomSwapId,
          sender: { $ne: userId },
          $or: [
            { isNewMsg: true }
          ]
        };
        
        if (lastReadTimestamp) {
          newMessagesQuery.$or.push({ 
            timestamp: { $gt: lastReadTimestamp } 
          });
        }
        
        const newCount = await Message.countDocuments(newMessagesQuery);
        
        if (unreadCount > 0) {
          unreadCounts[roomSwapId] = unreadCount;
        }
        
        if (newCount > 0) {
          newCounts[roomSwapId] = newCount;
        }
      } catch (error) {
        console.error(`Error processing room swap request:`, error);
        // Continue with other requests even if one fails
      }
    }));
  
    
    return res.json({
      counts: unreadCounts,
      newCounts: newCounts
    });
    
  } catch (error) {
    console.error('Error getting unread counts:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get chat preview data for listings
exports.getChatPreviews = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find all room swap requests involving the user
    const roomSwaps = await RoomSwapRequest.find({
      $or: [
        { requester: req.user.id },
        { recipient: req.user.id }
      ]
    }).populate('requester', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('requesterRoom', 'name building floor')
      .populate('recipientRoom', 'name building floor')
      .sort({ lastMessageAt: -1 });
    
    // Get the last message for each room swap
    const chatPreviews = await Promise.all(roomSwaps.map(async (swap) => {
      // Get last message
      const lastMessage = await Message.findOne({ roomSwapId: swap._id })
        .sort({ timestamp: -1 })
        .select('text timestamp sender isRead');
        
      // Get unread count
      const unreadCount = await Message.countDocuments({
        roomSwapId: swap._id,
        sender: { $ne: req.user.id },
        isRead: false
      });
      
      // Determine other user (not the current user)
      const otherUser = req.user.id === swap.requester._id.toString() 
        ? swap.recipient 
        : swap.requester;
      
      const userRoom = req.user.id === swap.requester._id.toString()
        ? swap.requesterRoom
        : swap.recipientRoom;
        
      const otherRoom = req.user.id === swap.requester._id.toString()
        ? swap.recipientRoom
        : swap.requesterRoom;
        
      return {
        roomSwapId: swap._id,
        otherUser: {
          id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar
        },
        rooms: {
          userRoom: {
            id: userRoom._id,
            name: userRoom.name,
            building: userRoom.building,
            floor: userRoom.floor
          },
          otherRoom: {
            id: otherRoom._id,
            name: otherRoom.name,
            building: otherRoom.building,
            floor: otherRoom.floor
          }
        },
        lastMessage: lastMessage ? {
          text: lastMessage.text,
          timestamp: lastMessage.timestamp,
          isFromUser: lastMessage.sender.toString() === req.user.id,
          isRead: lastMessage.isRead
        } : null,
        unreadCount,
        status: swap.status,
        lastMessageAt: swap.lastMessageAt || swap.createdAt
      };
    }));
    
    // Sort by unread first, then by last message timestamp
    chatPreviews.sort((a, b) => {
      // First prioritize chats with unread messages
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      
      // Then sort by last message timestamp
      const aTime = a.lastMessageAt || new Date(0);
      const bTime = b.lastMessageAt || new Date(0);
      return bTime - aTime;
    });
    
    return res.json(chatPreviews);
  } catch (error) {
    console.error('Error getting chat previews:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};