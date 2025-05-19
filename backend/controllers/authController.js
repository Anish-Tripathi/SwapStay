const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { socket } = require('../utils/socketClient');
dotenv.config(); 


// Helper function to create token
const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// Set token in HTTP-only cookie and register socket notifications
const sendTokenResponse = (user, statusCode, res) => {
  const token = createToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Remove password from response
  user.password = undefined;

  // Register user for socket notifications
  try {
    // Register for general user events
    socket.emit('register-user', user._id);
    
    // Join room for direct notifications
    socket.emit('join-room', `user-${user._id}`);
    
    // Set up event listeners for notifications
    socket.on('room-swap-status-update', (data) => {
      console.log('Room swap status updated:', data);
     
    });
  } catch (error) {
    console.error('Error setting up socket notifications:', error);
    
  }

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        department: user.department,
        year: user.year,
        degree: user.degree,
        gender: user.gender,
        phone: user.phone
        // Add other user fields you want to expose
      }
    });
};

// Authentication middleware - Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Authorization middleware - Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    
    next();
  };
};


exports.register = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      department,
      email,
      phone,
      password,
      year,
      degree,
      gender
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const rollNoExists = await User.findOne({ rollNo });
    if (rollNoExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this roll number already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      rollNo,
      department,
      email,
      phone,
      password,
      year,
      degree,
      gender
    });

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password',
      code: 'CREDENTIALS_MISSING'
    });
  }

  try {
    // Check for user with case-insensitive email
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    }).select('+password +isActive');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please reactivate your account.',
        code: 'ACCOUNT_DEACTIVATED',
        email: user.email,
        canReactivate: true
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if email is verified
    if (user.emailVerified === false) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified. Please verify your email first.',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);

    // Register user for socket notifications after successful login
    registerForSocketNotifications(user._id);

  } catch (error) {
    console.error('[Auth Controller] Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      code: 'SERVER_ERROR',
      systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  // Disconnect from socket or leave rooms
  if (req.user && req.user._id) {
    socket.emit('disconnect-user', req.user._id);
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Helper function to register user for socket notifications
function registerForSocketNotifications(userId) {
  try {
    // Register for general user events
    socket.emit('register-user', userId);
    
    // Also join room for direct notifications
    socket.emit('join-room', `user-${userId}`);
    
    // Set up event listeners for notifications
    socket.on('room-swap-status-update', (data) => {
      console.log('Room swap status updated:', data);
    });
    
  } catch (error) {
    console.error('Error setting up socket notifications:', error);
  }
}

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

