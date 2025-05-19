const express = require('express');
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getMyRooms,
  checkUserRoom,
  getAvailableRooms,
  toggleRoomAvailability
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const { uploadRoomImages } = require('../middleware/uploadMiddleware');

router.get('/user/myrooms', protect, getMyRooms);

// For checking if user has already listed a room
router.get('/user-room', protect, checkUserRoom);

// For available rooms and swap requests
router.get('/available', getAvailableRooms);

// Public routes
router.get('/browse-rooms', getAllRooms);

// Protected routes
router.post('/', protect, uploadRoomImages, createRoom);
router.put('/:id', protect, uploadRoomImages, updateRoom);
router.delete('/:id', protect, deleteRoom);

router.patch('/:id/toggle-availability', protect, toggleRoomAvailability);

// Parameterized routes last
router.get('/:id', getRoomById);


module.exports = router;