const express = require('express');
const router = express.Router();
const guestHouseController = require('../controllers/guestHouseController');

router.get('/', guestHouseController.getGuestHouses);
router.get('/:id', guestHouseController.getGuestHouseById);
router.get('/rooms/available', guestHouseController.getAvailableRooms);

module.exports = router;