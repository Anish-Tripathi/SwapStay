const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  if (
    req.originalUrl.includes('/payment') || 
    req.path.includes('/payment') || 
    req.originalUrl.includes('/confirm-payment')
  ) {
    
    return next();
  }

  try {
    let token;

    

    // 1. Get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    
    }
    // 2. Fallback to Authorization header (Bearer)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
      
    }

    // 3. Token not found
    if (!token) {
      console.log(' No token found, redirecting to /auth');
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no token provided',
        redirectTo: '/auth',
      });
    }

    // 4. Verify and decode token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
      
      const user = await User.findById(decoded.id).select('-password');

      // 5. User not found
      if (!user) {
        console.log('User not found for token ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'Not authorized - user not found',
          redirectTo: '/auth',
        });
      }

      // 6. Attach user to request and continue
      req.user = user;
      next();
    } catch (tokenError) {
      console.error('🔒 Token verification error:', tokenError.message);
      
      return res.status(401).json({
        success: false,
        message: `Token verification failed: ${tokenError.message}`,
        redirectTo: '/auth',
      });
    }
  } catch (error) {
    console.error('🔒 Auth middleware unexpected error:', error);

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      redirectTo: '/auth',
    });
  }
};