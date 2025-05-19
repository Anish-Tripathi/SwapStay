const RoomSwapRequest = require('../models/RoomSwapRequest');
const Room = require('../models/Room');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Message = require('../models/Message');
const { getIO } = require('../utils/socketServer');
const { sendNotification } = require('../utils/notificationHelper');

// const createDefaultSwapMessages = async (requestId, senderId, roomDetails, reason) => {
//   try {
//     const io = getIO();
    
//     const swapRequest = await RoomSwapRequest.findById(requestId)
//       .select('recipient')
//       .lean();
    
//     if (!swapRequest) {
//       throw new Error('Swap request not found');
//     }

//     const recipientId = swapRequest.recipient;

//     // Default message wehn we sent the swap request
//     const message1 = await Message.create({
//       roomSwapId: requestId,
//       sender: senderId,
//       recipient: recipientId, 
//       text: `Hello! I'm interested in swapping rooms with you. I currently live in ${roomDetails}.`,
//       timestamp: new Date(),
//       isRead: false,
//       isNewMsg:true
//     });

//     const message2 = await Message.create({
//       roomSwapId: requestId,
//       sender: senderId,
//       recipient: recipientId, 
//       text: reason || "Would you consider my swap request?",
//       timestamp: new Date(Date.now() + 1000),
//       isRead: false,
//       isNewMsg:true
//     });

//     io.to(requestId.toString()).emit('receive-message', message1);
//     io.to(requestId.toString()).emit('receive-message', message2);

//     return [message1, message2];
//   } catch (error) {
//     console.error("Error creating default swap messages:", error);
//     return [];
//   }
// };


// When the swap is completed, update both rooms with the new owners
exports.completeSwap = asyncHandler(async (req, res, next) => {
  const { swapRequestId } = req.body;
  
  const swapRequest = await RoomSwapRequest.findById(swapRequestId)
    .populate('requesterRoom')
    .populate('requestedRoom');
  
  if (!swapRequest) {
    return next(new ErrorResponse(`No swap request found with id ${swapRequestId}`, 404));
  }
  
  // Check if request is in a state that can be completed
  if (swapRequest.status !== 'accepted') {
    return next(new ErrorResponse('This swap request cannot be completed because it is not accepted', 400));
  }
  
  
  // Get the rooms involved
  const requesterRoom = swapRequest.requesterRoom;
  const requestedRoom = swapRequest.requestedRoom;
  
  // Swap the owners
  const tempOwner = requesterRoom.owner;
  requesterRoom.owner = requestedRoom.owner;
  requestedRoom.owner = tempOwner;
  
  // Update room records
  await requesterRoom.save();
  await requestedRoom.save();
  
  // Update swap request to completed
  swapRequest.status = 'completed';
  swapRequest.updatedAt = Date.now();
  await swapRequest.save();
  
  // Send notifications to both parties
  await sendNotification(
    swapRequest.requester,
    'room_swap_completed',
    'Room Swap Completed',
    `Your room swap with ${requestedRoom.blockName} ${requestedRoom.roomNumber} has been completed.`,
    {
      swapRequestId: swapRequest._id,
      newRoom: {
        blockType: requestedRoom.blockType,
        blockName: requestedRoom.blockName,
        roomNumber: requestedRoom.roomNumber
      }
    },
    'high'
  );
  
  await sendNotification(
    swapRequest.recipient,
    'room_swap_completed',
    'Room Swap Completed',
    `Your room swap with ${requesterRoom.blockName} ${requesterRoom.roomNumber} has been completed.`,
    {
      swapRequestId: swapRequest._id,
      newRoom: {
        blockType: requesterRoom.blockType,
        blockName: requesterRoom.blockName,
        roomNumber: requesterRoom.roomNumber
      }
    },
    'high'
  );
  
  res.status(200).json({
    success: true,
    data: swapRequest
  });
});

exports.acceptReceivedSwapRequest = asyncHandler(async (req, res, next) => {
  const swapRequest = await RoomSwapRequest.findById(req.params.id)
    .populate('requesterRoom')
    .populate('requestedRoom');
  
  if (!swapRequest) {
    return next(new ErrorResponse(`No swap request found with id ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to accept this request
  if (swapRequest.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Only the recipient can accept a swap request', 403));
  }
  
  // Check if request is still pending
  if (swapRequest.status !== 'pending') {
    return next(new ErrorResponse(`This request cannot be accepted because it is ${swapRequest.status}`, 400));
  }
  
  // Get the rooms involved
  const requesterRoom = swapRequest.requesterRoom;
  const requestedRoom = swapRequest.requestedRoom;
  
  // Verify that rooms exist
  if (!requesterRoom || !requestedRoom) {
    return next(new ErrorResponse('Could not find one or both rooms associated with this swap request', 404));
  }
  
  try {
    // Update the request status
    swapRequest.recipientAccepted = true;
    swapRequest.status = 'accepted'; // Mark as accepted
    swapRequest.updatedAt = Date.now();
    await swapRequest.save();
    
    // Swap the room owners immediately
    const tempOwner = requesterRoom.owner;
    requesterRoom.owner = requestedRoom.owner;
    requestedRoom.owner = tempOwner;
    
    // Mark both rooms as unavailable for further swaps
    requesterRoom.availableForSwap = false;
    requestedRoom.availableForSwap = false;
    
    // Save room changes
    await requesterRoom.save();
    await requestedRoom.save();
    
    // Find all other pending requests involving either of these rooms
    const otherPendingRequests = await RoomSwapRequest.find({
      _id: { $ne: swapRequest._id },
      status: 'pending',
      $or: [
        { requesterRoom: requesterRoom._id },
        { requestedRoom: requestedRoom._id },
        { requesterRoom: requestedRoom._id },
        { requestedRoom: requesterRoom._id }
      ]
    });
    
    // Update all other pending requests to cancelled
    for (const request of otherPendingRequests) {
      request.status = 'cancelled';
      request.rejectionReason = 'Auto-cancelled due to another accepted swap request';
      request.updatedAt = Date.now();
      await request.save();
      
      // Send notifications to users of cancelled requests
      await Notification.create({
        recipient: request.requester,
        type: 'room_swap_cancelled',
        title: 'Room Swap Request Cancelled',
        message: 'Your room swap request has been automatically cancelled because one of the rooms involved has been swapped in another request.',
        data: { swapRequestId: request._id },
        read: false,
        priority: 'normal'
      });
      
      // Send notification to recipient if they're not the current user
      if (request.recipient.toString() !== req.user.id) {
        await Notification.create({
          recipient: request.recipient,
          type: 'room_swap_cancelled',
          title: 'Room Swap Request Cancelled',
          message: 'A room swap request involving your room has been automatically cancelled because the room has been swapped in another request.',
          data: { swapRequestId: request._id },
          read: false,
          priority: 'normal'
        });
      }
    }
    
    // Send notifications about accepted swap to both parties
    await Notification.create({
      recipient: swapRequest.requester,
      type: 'room_swap_accepted',
      title: 'Room Swap Accepted',
      message: `Your room swap with ${requestedRoom.blockName} ${requestedRoom.roomNumber} has been accepted. Your room has been updated.`,
      data: {
        swapRequestId: swapRequest._id,
        newRoom: {
          blockType: requestedRoom.blockType,
          blockName: requestedRoom.blockName,
          roomNumber: requestedRoom.roomNumber
        }
      },
      read: false,
      priority: 'high'
    });
    
    await Notification.create({
      recipient: swapRequest.recipient,
      type: 'room_swap_accepted', 
      title: 'Room Swap Accepted',
      message: `You've accepted the room swap with ${requesterRoom.blockName} ${requesterRoom.roomNumber}. Your room has been updated.`,
      data: {
        swapRequestId: swapRequest._id,
        newRoom: {
          blockType: requesterRoom.blockType,
          blockName: requesterRoom.blockName,
          roomNumber: requesterRoom.roomNumber
        }
      },
      read: false,
      priority: 'high'
    });
    
    res.status(200).json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    console.error('Error details:', error);
    return next(new ErrorResponse(`Failed to process the swap request: ${error.message}`, 500));
  }
});

exports.cancelSwapRequest = asyncHandler(async (req, res, next) => {
  const requestId = req.params.id;
  
  const swapRequest = await RoomSwapRequest.findById(requestId);
  
  if (!swapRequest) {
    return next(new ErrorResponse(`No swap request found with id ${requestId}`, 404));
  }
  
  // Check if user is authorized to cancel this request
  if (swapRequest.requester.toString() !== req.user.id) {
    return next(new ErrorResponse('Only the requester can cancel a swap request', 403));
  }
  
  // Check if request can be cancelled
  if (!['pending', 'accepted'].includes(swapRequest.status)) {
    return next(new ErrorResponse(`This request cannot be cancelled because it is ${swapRequest.status}`, 400));
  }

  try {
    // Instead of updating status, completely remove the request from database
    await RoomSwapRequest.findByIdAndDelete(requestId);
    
    // Remove any related notifications
    await Notification.deleteMany({
      'data.swapRequestId': requestId
    });
    
    // Create a new notification for the recipient about the cancellation
    const recipientNotification = {
      recipient: swapRequest.recipient,
      type: 'room_swap_update', 
      title: 'Swap Request Cancelled',
      message: 'A room swap request for your room has been cancelled by the requester.',
      data: {
        status: 'cancelled',
        swapRequestId: null 
      },
      read: false,
      priority: 'low'
    };
    
    try {
      await Notification.create(recipientNotification);
    } catch (notifError) {
      console.error('Error creating cancellation notification:', notifError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Swap request cancelled and removed successfully'
    });
  } catch (error) {
    console.error('Error cancelling swap request:', error);
    return next(new ErrorResponse('Error cancelling swap request', 500));
  }
});

exports.rejectSwapRequest = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const swapRequest = await RoomSwapRequest.findById(req.params.id);
  
  if (!swapRequest) {
    return next(new ErrorResponse(`No swap request found with id ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to reject this request
  if (swapRequest.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Only the recipient can reject a swap request', 403));
  }
  
  // Check if request can be rejected
  if (swapRequest.status !== 'pending') {
    return next(new ErrorResponse(`This request cannot be rejected because it is ${swapRequest.status}`, 400));
  }
  
  // Update the request status
  swapRequest.status = 'rejected';
  swapRequest.rejectionReason = reason || 'No reason provided';
  swapRequest.updatedAt = Date.now();
  await swapRequest.save();
  
  // Notify requester that their request was rejected
  await Notification.create({
    recipient: swapRequest.requester,
    type: 'room_swap_rejected',
    title: 'Swap Request Rejected',
    message: reason 
      ? `Your room swap request has been rejected. Reason: ${reason}`
      : 'Your room swap request has been rejected.',
    data: {
      swapRequestId: swapRequest._id,
      status: 'rejected',
      reason: reason || null
    },
    read: false,
    priority: 'normal'
  });
  
  res.status(200).json({
    success: true,
    data: swapRequest
  });
});

exports.createSwapRequest = asyncHandler(async (req, res, next) => {
  const { roomId, reason, priority } = req.body;

  if (!roomId) {
    return next(new ErrorResponse('Room ID is required', 400));
  }

  const requestedRoom = await Room.findById(roomId).populate('owner', 'name');
  if (!requestedRoom) {
    return next(new ErrorResponse(`Room not found with id of ${roomId}`, 404));
  }

  if (!requestedRoom.owner) {
    return next(new ErrorResponse('The requested room has no assigned owner', 400));
  }

  if (!requestedRoom.availableForSwap) {
    return next(new ErrorResponse('This room is not available for swap', 400));
  }

  const userRoom = await Room.findOne({ owner: req.user.id });
  const user = await User.findById(req.user.id).select('name profilePicture');
  if (!userRoom) {
    return next(new ErrorResponse('You must have a room to request a swap', 400));
  }

  const validPriorities = ['low', 'normal', 'high'];
  const notificationPriority = priority && validPriorities.includes(priority) ? priority : 'normal';

 try {
    const swapRequest = await RoomSwapRequest.create({
      requester: req.user.id,
      requesterRoom: userRoom._id,
      requestedRoom: roomId,
      recipient: requestedRoom.owner._id || requestedRoom.owner,
      reason: reason || 'No reason provided',
      priority: notificationPriority,
      status: 'pending'
    });

    // try {
    //   await createDefaultSwapMessages(
    //     swapRequest._id, 
    //     req.user.id, 
    //     `${userRoom.blockType} ${userRoom.blockName}, Room ${userRoom.roomNumber}`,
    //     reason
    //   );
    // } catch (msgErr) {
    //   console.error('Error creating default swap messages:', msgErr);
    // }

   
    try {
      await Notification.create({
        recipient: requestedRoom.owner._id || requestedRoom.owner,
        type: 'room_swap_request',
        title: 'New Room Swap Request',
        message: `${user.name} has requested to swap rooms with you.`,
        avatar: user.profilePicture
          ? `http://localhost:5000${user.profilePicture}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6d28d9&color=fff`,
        data: {
          swapRequestId: swapRequest._id,
          requesterName: user.name,
          requesterRoom: {
            blockType: userRoom.blockType,
            blockName: userRoom.blockName,
            roomNumber: userRoom.roomNumber,
            floor: userRoom.floor,
            wing: userRoom.wing,
            images: userRoom.images,
            amenities: userRoom.amenities,
            description: userRoom.description,
            sharing: userRoom.sharing,
          },
          requestedRoom: {
            blockType: requestedRoom.blockType,
            blockName: requestedRoom.blockName,
            roomNumber: requestedRoom.roomNumber,
            floor: requestedRoom.floor,
            wing: requestedRoom.wing,
            images: requestedRoom.images,
            amenities: requestedRoom.amenities,
            description: requestedRoom.description,
            sharing: requestedRoom.sharing,
          }
        },
        read: false,
        priority: notificationPriority
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    return res.status(201).json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    console.error('Error creating swap request:', error);
    return next(new ErrorResponse('Error creating swap request', 500));
  }
});

exports.getMySwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    
    let sentQuery = { requester: userId };
    let receivedQuery = { recipient: userId };
    
    if (status) {
      if (status === "pending") {
        sentQuery.status = { $in: ["pending", "accepted"] };
        receivedQuery.status = { $in: ["pending", "accepted"] };
      } else if (status === "approved") {
        sentQuery.status = { $in: ["approved", "accepted", "completed"] };
        receivedQuery.status = { $in: ["approved", "accepted", "completed"] };
      } else {
        sentQuery.status = status;
        receivedQuery.status = status;
      }
    }
    // Get requests initiated by this user (sent requests)
    const sentRequests = await RoomSwapRequest.find({ requester: userId })
      .populate({
        path: 'requesterRoom',
        select: 'blockName blockType roomNumber floor wing images amenities description sharing',
      })
      .populate({
        path: 'requestedRoom',
        select: 'blockName blockType roomNumber floor wing images amenities description sharing owner',
        populate: {
          path: 'owner',
          select: 'name email phone profilePicture rollNo department year studentId',
          model: 'User'
        }
      })
      .populate({
        path: 'recipient',
        select: 'name email phone profilePicture rollNo department year studentId',
        model: 'User'
      })
      .sort({ createdAt: -1 });
    
    // Get requests received by this user
    const userRoom = await Room.findOne({ owner: userId });
    let receivedRequests = [];
    
    if (userRoom) {
      // Build query for received requests
      let receivedQuery = { requestedRoom: userRoom._id };
      if (status) {
        if (status === "approved") {
          receivedQuery.status = { $in: ["approved", "accepted", "completed"] };
        } else {
          receivedQuery.status = status;
        }
      }
      
      receivedRequests = await RoomSwapRequest.find({ recipient: userId })
        .populate({
          path: 'requesterRoom',
          select: 'blockName blockType roomNumber floor wing images amenities description sharing',
        })
        .populate({
          path: 'requestedRoom',
          select: 'blockName blockType roomNumber floor wing images amenities description sharing',
        })
        .populate({
          path: 'requester',
          select: 'name email phone profilePicture rollNo department year studentId',
          model: 'User',
        })
        .sort({ createdAt: -1 });
    }
    
    const formattedReceived = receivedRequests.map(req => {
      // Clone the request document to avoid modifying the original
      const formattedReq = req.toObject();
      formattedReq.requesterDetails = formattedReq.requester;
      return formattedReq;
    });
    
    return res.status(200).json({
      success: true,
      sent: sentRequests,
      received: formattedReceived,
    });
  } catch (error) {
    console.error('Error fetching swap requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch swap requests',
      error: error.message,
    });
  }
};

exports.updateSwapRequestStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!['pending', 'accepted', 'approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
    return next(new ErrorResponse('Invalid status value', 400));
  }
  
  let swapRequest = await RoomSwapRequest.findById(req.params.id);
  
  if (!swapRequest) {
    return next(new ErrorResponse(`No swap request found with id ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to update this request
  if (swapRequest.recipient.toString() !== req.user.id && swapRequest.requester.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this request', 403));
  }
  
  // Specific authorization checks based on the action
  if (status === 'accepted' || status === 'rejected') {
    // Only recipient can accept/reject
    if (swapRequest.recipient.toString() !== req.user.id) {
      return next(new ErrorResponse('Only the recipient can accept or reject a swap request', 403));
    }
  } else if (status === 'cancelled') {
    // Only requester can cancel
    if (swapRequest.requester.toString() !== req.user.id) {
      return next(new ErrorResponse('Only the requester can cancel a swap request', 403));
    }
  } else if (status === 'completed') {
  }
  
  // Update the request status
  swapRequest.status = status;
  swapRequest.updatedAt = Date.now();
  await swapRequest.save();
  
  // Create notification based on the new status
  let notificationData = {
    type: 'room_swap_update',
    data: {
      swapRequestId: swapRequest._id,
      status
    },
    read: false
  };
  
  if (status === 'accepted') {
    // Notify requester that their request was accepted
    await Notification.create({
      ...notificationData,
      recipient: swapRequest.requester,
      title: 'Swap Request Accepted',
      message: 'Your room swap request has been accepted. Please contact the hostel administration for further details.',
      priority: 'high'
    });
  } else if (status === 'rejected') {
    // Notify requester that their request was rejected
    await Notification.create({
      ...notificationData,
      recipient: swapRequest.requester,
      title: 'Swap Request Rejected',
      message: 'Your room swap request has been rejected.',
      priority: 'normal'
    });
  } else if (status === 'cancelled') {
    // Notify recipient that the request was cancelled
    await Notification.create({
      ...notificationData,
      recipient: swapRequest.recipient,
      title: 'Swap Request Cancelled',
      message: 'A room swap request for your room has been cancelled.',
      priority: 'low'
    });
  } else if (status === 'completed') {
    // Notify both parties that the swap is completed
    await Notification.create({
      ...notificationData,
      recipient: swapRequest.requester,
      title: 'Room Swap Completed',
      message: 'Your room swap has been completed successfully.',
      priority: 'high'
    });
    
    await Notification.create({
      ...notificationData,
      recipient: swapRequest.recipient,
      title: 'Room Swap Completed',
      message: 'Your room swap has been completed successfully.',
      priority: 'high'
    });
  }
  
  // Notify both parties via socket
  io.to(`user-${swapRequest.requester}`).emit('room-swap-status-update', {
    roomSwapId: swapRequest._id,
    status,
    updatedAt: new Date()
  });
  
  io.to(`user-${swapRequest.recipient}`).emit('room-swap-status-update', {
    roomSwapId: swapRequest._id,
    status,
    updatedAt: new Date()
  });
  
  if (status === 'accepted' || status === 'rejected' || status === 'completed') {
    const systemMessage = new Message({
      roomSwapId: swapRequest._id,
      sender: req.user.id,
      text: getStatusMessage(status),
      isSystemMessage: true
    });
    
    await systemMessage.save();
  }
  
  res.status(200).json({
    success: true,
    data: swapRequest
  });
});

// Helper function to get status messages
function getStatusMessage(status) {
  switch (status) {
    case 'accepted':
      return 'The room swap request has been accepted!';
    case 'rejected':
      return 'The room swap request has been declined.';
    case 'completed':
      return 'The room swap has been completed successfully.';
    default:
      return `Room swap request status updated to: ${status}`;
  }
}

exports.getSwapRequest = asyncHandler(async (req, res, next) => {
  const swapRequest = await RoomSwapRequest.findById(req.params.id)
    .populate('requester', 'name email profilePicture rollNo')
    .populate('recipient', 'name email profilePicture rollNo')
    .populate('requesterRoom', 'blockType blockName roomNumber floor wing images amenities description sharing')
    .populate('requestedRoom', 'blockType blockName roomNumber floor wing images amenities description sharing')
    
  if (!swapRequest) {
    return next(new ErrorResponse(`No swap request found with id ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to view this request
  if (swapRequest.recipient.toString() !== req.user.id && swapRequest.requester.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view this request', 403));
  }
  
  res.status(200).json({
    success: true,
    data: swapRequest
  });
});

exports.getAllSwapRequests = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  
  // Build query
  const query = {};
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Fetch swap requests with populated fields
  const swapRequests = await RoomSwapRequest.find(query)
    .populate({
      path: 'requester',
      select: 'name email profilePicture phone department year studentId',
      model: 'User'
    })
    .populate({
      path: 'recipient',
      select: 'name email profilePicture',
      model: 'User'
    })
    .populate('requesterRoom', 'blockType blockName roomNumber floor wing images amenities')
    .populate('requestedRoom', 'blockType blockName roomNumber floor wing images amenities')
    .sort('-createdAt');
  
  // Transform data for the frontend
  const transformedRequests = swapRequests.map(request => ({
    _id: request._id,
    requesterDetails: request.requester,
    requesterRoom: request.requesterRoom,
    requestedRoom: request.requestedRoom,
    reason: request.reason,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
  }));
  
  res.status(200).json({
    success: true,
    count: transformedRequests.length,
    data: transformedRequests
  });
});

exports.markRequestAsViewed = asyncHandler(async (req, res, next) => {
  const swapRequest = await RoomSwapRequest.findById(req.params.id);
  
  if (!swapRequest) {
    return next(new ErrorResponse(`No swap request found with id ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to view this request
  if (swapRequest.recipient.toString() !== req.user.id && 
      swapRequest.requester.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this request', 403));
  }
  
  // Mark the request as viewed
  swapRequest.viewed = true;
  swapRequest.updatedAt = Date.now();
  await swapRequest.save();
  
  res.status(200).json({
    success: true,
    data: swapRequest
  });
});

exports.markAllRequestsAsViewed = asyncHandler(async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication failed'
      });
    }

    const requests = await RoomSwapRequest.find({
      $or: [
        { recipient: req.user.id },
        { requester: req.user.id }
      ],
      viewed: false
    });

    // Update all unviewed requests
    const updateResult = await RoomSwapRequest.updateMany(
      {
        _id: { $in: requests.map(r => r._id) }
      },
      {
        $set: {
          viewed: true,
          updatedAt: Date.now()
        }
      }
    );
    
    await Notification.updateMany(
      {
        recipient: req.user.id,
        type: { $regex: /^room_swap/ },
        read: false
      },
      {
        $set: { read: true }
      }
    );

     const io = getIO();

    if (io) {
      io.to(`user-${req.user.id}`).emit('all-requests-marked-read');
    }
    
    return res.status(200).json({
      success: true,
      message: 'All requests marked as viewed',
      count: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Error in markAllRequestsAsViewed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark requests as viewed',
      error: error.message
    });
  }
});
// Get room swap requests with unread message count
exports.getRequestsWithUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all requests the user is involved in
    const requests = await RoomSwapRequest.find({
      $or: [
        { requestedBy: userId },
        { requestedTo: userId }
      ]
    }).populate('requestedBy requestedTo', 'name avatar roomNumber');
    
    // Get unread message counts for each request
    const requestsWithUnread = await Promise.all(requests.map(async (request) => {
      const unreadCount = await Message.countDocuments({
        roomSwapId: request._id,
        sender: { $ne: userId },
        isRead: false
      });
      
      return {
        ...request.toObject(),
        unreadCount
      };
    }));
    
    return res.json(requestsWithUnread);
  } catch (error) {
    console.error('Error getting requests with unread count:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};