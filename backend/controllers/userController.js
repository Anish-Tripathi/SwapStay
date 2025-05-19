const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// To get the current user
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// To update the users profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, rollNo, department, phone, year, degree, gender } = req.body;

 
  const updateFields = {};
  if (name) updateFields.name = name;
  if (rollNo) updateFields.rollNo = rollNo; 
  if (department) updateFields.department = department;
  if (phone) updateFields.phone = phone;
  if (year) updateFields.year = year;
  if (degree) updateFields.degree = degree;
  if (gender) updateFields.gender = gender;

  
  const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// To update users profile picture
exports.uploadProfilePicture = asyncHandler(async (req, res, next) => {

  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const profilePicturePath = `/uploads/profile/${req.file.filename}`;
  
  const user = await User.findByIdAndUpdate(
    req.user.id, 
    { profilePicture: profilePicturePath },
    { new: true }
  );

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profilePicturePath
  });
});

// To update users theme
exports.updateTheme = asyncHandler(async (req, res, next) => {
  const { theme } = req.body;

  if (!theme || !['light', 'dark', 'system'].includes(theme)) {
    return next(new ErrorResponse('Invalid theme selection', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { theme },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: user.theme
  });
});

// To update the notification settings
exports.updateNotificationSettings = asyncHandler(async (req, res, next) => {
  const { notificationSettings } = req.body;

  if (!notificationSettings) {
    return next(new ErrorResponse('No notification settings provided', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { notificationSettings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: user.notificationSettings
  });
});

// To change the password
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }

  // Check current password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if current password matches
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});