const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getCurrentUser,
} = require('../controllers/authController');
const { 
  forgotPassword,
  verifyResetToken,
  resetPassword,
  deactivateAccount,
  reactivateAccount,
  checkAccountStatus,
  sendReactivationOTP,
  verifyReactivationOTP
} = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

// Handle signup and login based on query parameters
router.post('/auth', (req, res) => {
  const mode = req.query.mode;
  
  if (mode === 'signup') {
    console.log("Register route accessed");
    return register(req, res);
  } else if (mode === 'login') {
    return login(req, res);
  } else {
    return res.status(400).json({ success: false, message: 'Invalid mode' });
  }
});

// Public route
router.get('/auth/logout', logout);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/verify-reset-token', verifyResetToken);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/reactivate-account', reactivateAccount);

// Protected route
router.get('/me', protect, getCurrentUser);
router.put('/auth/deactivate-account', protect, deactivateAccount);
router.post('/auth/check-account-status', checkAccountStatus);
router.post('/auth/reactivate/send-otp', sendReactivationOTP);
router.put('/auth/reactivate/verify-otp', verifyReactivationOTP);

module.exports = router;
