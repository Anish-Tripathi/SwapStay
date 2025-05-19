const Room = require('../models/Room');
const fs = require('fs').promises;
const path = require('path');

const processAmenities = (reqBody) => {
  let amenities = [];
  
  if (reqBody.amenities && typeof reqBody.amenities === 'string') {
    try {
      const parsedAmenities = JSON.parse(reqBody.amenities);
      
      if (typeof parsedAmenities === 'object' && !Array.isArray(parsedAmenities)) {
        amenities = Object.keys(parsedAmenities).filter(key => parsedAmenities[key]);
      } 
      else if (Array.isArray(parsedAmenities)) {
        amenities = parsedAmenities;
      }
    } catch (error) {
      console.error('Error parsing amenities JSON:', error);
    }
  }

  else {
    Object.keys(reqBody).forEach(key => {
      if (key.startsWith('amenities.') && (reqBody[key] === 'true' || reqBody[key] === true)) {
        amenities.push(key.replace('amenities.', ''));
      }
    });
  }

  if (reqBody.amenities && Array.isArray(reqBody.amenities)) {
    amenities = reqBody.amenities;
  }
  
  return amenities;
};

const mapBlockType = (blockType) => {
  if (!blockType) return undefined;
  
  return blockType === 'boys' ? 'Boys Hostel' : 
         blockType === 'girls' ? 'Girls Hostel' : 'MT Blocks';
};

const mapSharing = (sharing) => {
  if (!sharing) return undefined;
  
  const sharingMap = {
    '1': 'Single Sharing',
    '2': 'Double Sharing',
    '3': 'Triple Sharing',
    '4': 'Four Sharing'
  };
  
  return sharingMap[sharing] || sharing;
};

// Create a new room listing
exports.createRoom = async (req, res) => {
  try {
 
    // Process amenities using the helper function
    const processedAmenities = processAmenities(req.body);
  
    // Map block type and sharing values
    const mappedBlockType = mapBlockType(req.body.blockType);
    const mappedSharing = mapSharing(req.body.sharing);
    
    // Process uploaded images
    let imagesPaths = [];
    if (req.files && req.files.length > 0) {
      imagesPaths = req.files.map(file => `/uploads/rooms/${file.filename}`);
      
    }
    
    // Set room data with correct mappings
    const roomData = {
      ...req.body,
      blockType: mappedBlockType,
      sharing: mappedSharing,
      owner: req.user.id,
      amenities: processedAmenities,
      images: imagesPaths
    };
    
    const room = await Room.create(roomData);
    
    res.status(201).json({
      success: true,
      message: 'Room listed successfully',
      data: room
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing room',
      error: error.message
    });
  }
};

// Get all room listings
exports.getAllRooms = async (req, res) => {
  try {

    const { blockType, sharing } = req.query;
    const filter = {};

    if (blockType) {
      filter.blockType = mapBlockType(blockType);
    }

    if (sharing) {
      filter.sharing = mapSharing(sharing);
    }
    
    const rooms = await Room.find(filter)
      .populate('owner', 'name email profilePicture')
      .sort({ datePosted: -1 });
      
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name email profilePicture');
      
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room',
      error: error.message
    });
  }
};

// Check if user has already listed a room
exports.checkUserRoom = async (req, res) => {
  try {
    const userId = req.user.id;
   
    // Find a room listed by this user
    const existingRoom = await Room.findOne({ owner: userId });
    
    if (existingRoom) {
      return res.status(200).json({
        hasListing: true,
        roomDetails: existingRoom
      });
    } else {
      return res.status(200).json({
        hasListing: false
      });
    }
  } catch (error) {
    console.error("Error checking user room:", error);
    return res.status(500).json({
      success: false,
      message: 'Error checking if user has an existing room listing',
      error: error.message
    });
  }
};

// Update room listing
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is the owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }
    
    const processedAmenities = processAmenities(req.body);
   
    // Map block type and sharing values
    const mappedBlockType = mapBlockType(req.body.blockType);
    const mappedSharing = mapSharing(req.body.sharing);
    
    // Handle new images if uploaded
    let images = room.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/rooms/${file.filename}`);
      images = [...images, ...newImages];
    }
    
    // Update room data with correct mappings
    room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        blockType: mappedBlockType,
        blockName: req.body.blockName,
        floor: req.body.floor,
        roomNumber: req.body.roomNumber,
        wing: req.body.wing,
        sharing: mappedSharing,
        description: req.body.description,
        amenities: processedAmenities,
        images,
        availableForSwap: req.body.availableForSwap,
        lastUpdated: Date.now()
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: error.message
    });
  }
};

// Get available rooms for swapping
exports.getAvailableRooms = async (req, res) => {
  try {
    const { blockType, blockName, floor, wing } = req.query;
    
    // Build filter object
    const filter = { availableForSwap: true };
    
    if (blockType) {
      filter.blockType = mapBlockType(blockType);
    }
    
    if (blockName) filter.blockName = blockName;
    if (floor) filter.floor = floor;
    if (wing) filter.wing = wing;
    
    // Find rooms with filters
    const rooms = await Room.find(filter)
      .populate('owner', 'name email profilePicture')
      .sort({ lastUpdated: -1 });
    
    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
   
    res.status(500).json({ 
      success: false,
      message: 'Error fetching available rooms',
      error: error.message 
    });
  }
};

exports.createSwapRequest = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;
    
    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }
    
    if (!room.availableForSwap) {
      return res.status(400).json({ 
        success: false,
        message: 'This room is not available for swap' 
      });
    }
 
    res.status(200).json({
      success: true,
      message: 'Swap request sent successfully'
    });
  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating swap request',
      error: error.message 
    });
  }
};

// Delete room listing 
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is the owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }
    
    // Delete image files
    if (room.images && room.images.length > 0) {
      for (const image of room.images) {
        const imagePath = path.join(__dirname, '..', image);
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          console.error(`Failed to delete image ${image}:`, err);
        }
      }
    }
    
    await Room.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
};

// Toggle Room Availability
exports.toggleRoomAvailability = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is the owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }
    
    
    const newAvailability = req.body.availableForSwap !== undefined 
      ? req.body.availableForSwap 
      : !room.availableForSwap;
    
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id, 
      { availableForSwap: newAvailability },
      { new: true } 
    );
    
    res.status(200).json({
      success: true,
      message: `Room marked as ${newAvailability ? 'available' : 'unavailable'} successfully`,
      data: updatedRoom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating room availability',
      error: error.message
    });
  }
};

// Get rooms by user (my listings)
exports.getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user.id })
      .sort({ datePosted: -1 });
      
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your rooms',
      error: error.message
    });
  }
};


