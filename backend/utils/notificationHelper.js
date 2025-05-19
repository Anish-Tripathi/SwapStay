const Notification = require('../models/Notification');

exports.sendNotification = async (recipientId, type, title, message, data = {}, priority = 'normal') => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      data,
      read: false,
      priority
    });
    
    return notification;
  } catch (error) {
    console.error(`Error sending notification of type ${type}:`, error);
    return null;
  }
};

exports.createMessageNotification = async (message) => {
  try {
    // Find the room swap request
    const roomSwapRequest = await RoomSwapRequest.findById(message.roomSwapId)
      .populate('requestedBy requestedTo', 'name');
    
    // Determine recipient (the other person)
    const recipientId = message.sender.toString() === roomSwapRequest.requestedBy._id.toString()
      ? roomSwapRequest.requestedTo._id
      : roomSwapRequest.requestedBy._id;
    
    // Create notification
    const notification = new Notification({
      user: recipientId,
      type: 'message',
      title: 'New message',
      message: `${message.sender.name} sent you a message regarding room swap request.`,
      relatedId: message.roomSwapId,
      isRead: false
    });
    
    await notification.save();
    
    // Emit notification to the recipient if they're online
    io.to(`user-${recipientId}`).emit('new-notification', notification);
    
    return notification;
  } catch (error) {
    console.error('Error creating message notification:', error);
  }
};