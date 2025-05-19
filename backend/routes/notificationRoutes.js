const express = require('express');
const {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUnreadCount,
  createTestNotification
} = require('../controllers/notificationController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

// All notification routes are protected
router.use(protect);

// Get all notifications
router.route('/')
  .get(getMyNotifications);

// Get unread count
router.route('/unread-count')
  .get(getUnreadCount);
  
// Mark all as read
router.route('/read-all')
  .put(markAllNotificationsRead);

// Test endpoint to create test notification
if (process.env.NODE_ENV !== 'production') {
  router.route('/test')
    .post(createTestNotification);
}

// Routes for individual notifications
router.route('/:id/read')
  .put(markNotificationRead);

router.route('/:id')
  .delete(deleteNotification);

module.exports = router;