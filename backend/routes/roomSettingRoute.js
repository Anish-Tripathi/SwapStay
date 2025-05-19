// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomSettingController');
const { protect } = require('../middleware/authMiddleware');

//  Fetch user's room
router.get('/users/room', protect, roomController.getUserRoom);

// Update room details
router.put('/users/room', protect, roomController.updateUserRoom);

module.exports = router;