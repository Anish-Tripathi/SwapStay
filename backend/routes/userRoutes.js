const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getCurrentUser, 
  updateProfile, 
  uploadProfilePicture, 
  updateTheme, 
  updateNotificationSettings, 
  changePassword 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/profile');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create custom filename with user ID
    cb(null, `photo_${req.user.id}${path.extname(file.originalname)}`);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Set up multer for profile picture uploads
const uploadProfileImage = multer({
  storage: profileStorage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB limit
  },
  fileFilter: fileFilter
});


router.use(protect);

router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);
router.put('/profile/picture', uploadProfileImage.single('file'), uploadProfilePicture);
router.put('/theme', updateTheme);
router.put('/notifications', updateNotificationSettings);
router.put('/password', changePassword);

module.exports = router;