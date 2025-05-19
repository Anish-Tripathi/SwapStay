const Notification = require('../models/Notification');
const RoomSwapRequest = require('../models/RoomSwapRequest'); 
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

exports.getMyNotifications = asyncHandler(async (req, res, next) => {
  const typeFilter = req.query.type ? { type: req.query.type } : {};
  
  const notifications = await Notification.find({ 
    recipient: req.user.id,
    ...typeFilter
  })
    .sort('-createdAt')
    .limit(req.query.limit ? parseInt(req.query.limit) : 20); // Allow customizable limit
    
  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

exports.markNotificationRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(new ErrorResponse(`No notification found with id ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to update this notification
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this notification', 403));
  }
  
  notification.read = true;
  await notification.save();
  
  // If this is a room swap request notification, update the viewed status in the related request
  if (notification.type === 'room_swap_request' && notification.data && notification.data.requestId) {
    try {
      const swapRequest = await RoomSwapRequest.findById(notification.data.requestId);
      if (swapRequest) {
        // Mark as viewed in the swap request if needed
       
        swapRequest.viewed = true;
        await swapRequest.save();
      }
    } catch (error) {
      console.error('Error updating related swap request:', error);
     
    }
  }
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

exports.markAllNotificationsRead = asyncHandler(async (req, res, next) => {
  const typeFilter = req.query.type ? { type: req.query.type } : {};

  // Find all unread notifications first
  const unreadNotifications = await Notification.find({
    recipient: req.user.id,
    read: false,
    ...typeFilter
  });

  // Mark all notifications as read
  await Notification.updateMany(
    {
      recipient: req.user.id,
      read: false,
      ...typeFilter
    },
    { read: true }
  );

  // Filter room swap request notifications with valid requestIds
  const roomSwapNotifications = unreadNotifications.filter(
    n => n.type === 'room_swap_request' && n.data?.requestId && mongoose.Types.ObjectId.isValid(n.data.requestId)
  );

  if (roomSwapNotifications.length > 0) {
    const requestIds = roomSwapNotifications.map(n => n.data.requestId);

    try {
      await RoomSwapRequest.updateMany(
        {
          _id: { $in: requestIds },
          recipient: req.user.id
        },
        { viewed: true }
      );
    } catch (error) {
      console.error('Error updating related swap requests:', error);
      
    }
  }

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(new ErrorResponse(`No notification found with id ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to delete this notification
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this notification', 403));
  }
  
  await notification.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const typeFilter = req.query.type ? { type: req.query.type } : {};
  
  const count = await Notification.countDocuments({
    recipient: req.user.id,
    read: false,
    ...typeFilter
  });
  
  res.status(200).json({
    success: true,
    data: { count }
  });
});

exports.createTestNotification = asyncHandler(async (req, res, next) => {

  if (process.env.NODE_ENV === 'production') {
    return next(new ErrorResponse('Test endpoint not available in production', 403));
  }
  
  const notification = await Notification.create({
    recipient: req.user.id,
    type: req.body.type || 'room_swap_request',
    title: req.body.title || 'Test Notification',
    message: req.body.message || 'This is a test notification',
    data: req.body.data || {},
    priority: req.body.priority || 'normal',
    read: false
  });
  
  res.status(201).json({
    success: true,
    data: notification
  });
});