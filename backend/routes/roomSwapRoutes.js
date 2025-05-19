const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  getMySwapRequests,
  updateSwapRequestStatus,
  getSwapRequest,
  getAllSwapRequests,
  acceptReceivedSwapRequest,
  cancelSwapRequest,
  rejectSwapRequest,
  completeSwap,
  markRequestAsViewed,
  markAllRequestsAsViewed,
  getRequestsWithUnreadCount
} = require('../controllers/roomSwapController');
const { protect } = require('../middleware/authMiddleware');

// Create a swap request
router.post('/swap-request', protect, createSwapRequest);
// Get only my swap request
router.get('/swap-requests/me', protect, getMySwapRequests);
// Get all swap requests
router.get('/swap-requests', protect,  getAllSwapRequests);
// Mark all request as read
router.put('/swap-requests/view-all', protect,  markAllRequestsAsViewed);
// Get id specific swap request
router.get('/swap-requests/:id', protect, getSwapRequest);
// Update id specific swap request
router.put('/swap-requests/:id', protect, updateSwapRequestStatus);
// Accept the id specific swap request
router.put('/swap-requests/:id/recipient-accept', protect, acceptReceivedSwapRequest);
// Cancel the id specific swap request
router.put('/swap-requests/:id/cancel', protect, cancelSwapRequest);
// Reject the id specific swap request
router.put('/swap-requests/:id/reject', protect, rejectSwapRequest);
// Mark the id specific swap request as read
router.put('/swap-requests/:id/viewed', protect, markRequestAsViewed);
// Get all request unread counts
router.get('/with-unread', protect , getRequestsWithUnreadCount);
// Post to complete the request
router.post('/swap-requests/complete', protect,  completeSwap);

module.exports = router;