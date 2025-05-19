const Room = require('../models/Room');

// Get room for the logged in user
exports.getUserRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ owner: req.user.id });
    
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        error: "Room not found for this user" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room data:', error);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// Update or create room for the logged in user
exports.updateUserRoom = async (req, res) => {
  try {
    const { blockType, blockName, floor, roomNumber, wing, sharing, availableForSwap } = req.body;
    
    // Find room by owner ID
    let room = await Room.findOne({ owner: req.user.id });
    
    if (!room) {
      // If room doesn't exist, create new one
      room = new Room({
        owner: req.user.id,
        blockType,
        blockName,
        floor,
        roomNumber,
        wing,
        sharing,
        availableForSwap,
        description: "No description provided", 
        images: [],
        amenities: []
      });
    } else {
      // Update existing room
      room.blockType = blockType;
      room.blockName = blockName;
      room.floor = floor;
      room.roomNumber = roomNumber;
      room.wing = wing;
      room.sharing = sharing;
      room.availableForSwap = availableForSwap;
      room.lastUpdated = Date.now();
    }
    
    await room.save();
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error while updating room"
    });
  }
};