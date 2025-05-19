const User = require('../models/User');
const crypto = require('crypto');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { socket } = require('../utils/socketClient');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/emailService');
dotenv.config(); 

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",  
  port: 2525,
  secure: false,
  auth: {
    user: "9ddf6c75991378",
    pass: "f2e6eb8673bbe5"
  }
});


// Helper function to create token
const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};


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
      
      }
    });
};

const createResetEmailTemplate = (userName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your SwayStay Password</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #f3e8ff; /* Light purple background */
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .header {
          background-color: #4B0082; /* Dark purple */
          padding: 30px 0;
          text-align: center;
          position: relative;
        }

        .header-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #7B61FF, #9F67FF); /* Purple gradient */
        }

        .logo {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .logo-accent {
          color: #d8b4fe;
        }

        .content {
          padding: 40px 30px;
          color: #4B0082; /* Dark purple */
        }

        h2 {
          color: #4B0082;
          font-weight: 600;
          margin-top: 0;
          font-size: 24px;
        }

        p {
          font-size: 16px;
          margin-bottom: 24px;
          color: #6b21a8;
        }

        .greeting {
          font-size: 18px;
          font-weight: 500;
          color: #4B0082;
        }

        .button-container {
          text-align: center;
          margin: 32px 0;
        }

        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(90deg, #7B61FF, #9F67FF); /* Purple gradient */
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
        }

        .note {
          margin-top: 30px;
          padding: 20px;
          background-color: #ede9fe; /* Soft purple */
          border-left: 4px solid #7B61FF;
          border-radius: 6px;
        }

        .note p {
          font-size: 14px;
          color: #6b21a8;
          margin: 8px 0;
        }

        .footer {
          background-color: #ede9fe; /* Light purple */
          text-align: center;
          padding: 25px 20px;
          font-size: 13px;
          color: #6b21a8;
        }

        .divider {
          height: 1px;
          background-color: #d8b4fe;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-accent"></div>
          <div class="logo">Sway<span class="logo-accent">Stay</span></div>
        </div>

        <div class="content">
          <h2>Password Reset Request</h2>
          <p class="greeting">Hello ${userName},</p>
          <p>We received a request to reset your password for your SwayStay account. Please use the secure button below to create a new password and regain access to your account.</p>

          <div class="button-container">
            <a href="${resetUrl}" class="button" target="_blank" rel="noopener noreferrer">Reset My Password</a>
          </div>

          <p>For security reasons, this password reset link will expire in <strong>30 minutes</strong>. If you need a new link after that time, you'll need to submit another password reset request.</p>

          <div class="note">
            <p><strong>Important:</strong> If you didn't request this password reset, please disregard this email.</p>
            <p>If you believe someone may be attempting to access your account, please contact our support team immediately at <strong>support@swaystay.com</strong>.</p>
          </div>
        </div>

        <div class="footer">
          <div class="divider"></div>
          <p>&copy; ${new Date().getFullYear()} SwayStay. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Email:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    
    // Save user with reset token fields
    await user.save({ validateBeforeSave: false });

    const clientURL = process.env.CLIENT_URL || 'http://localhost:8080';
    const resetUrl = `${clientURL}/auth?mode=reset-password&token=${resetToken}`;

    try {
      let info = await transporter.sendMail({
        from: '"Student Portal" <noreply@studentportal.com>',
        to: user.email, 
        subject: 'Reset Your Password',
        html: createResetEmailTemplate(user.name, resetUrl)
      });
      
      console.log('Message sent: %s', info.messageId);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      console.error('Email error:', error);
    
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Missing token'
      });
    }

    // Hash the token from the URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token and non-expired token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Token is valid
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      email: user.email
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Hash the token from the URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token and non-expired token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Get user from database with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password before allowing deactivation
    if (password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password'
        });
      }
    }
    
    // Deactivate the user
    user.isActive = false;
    user.deactivatedAt = Date.now();
    await user.save();
    
    // Clear auth cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
      httpOnly: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.reactivateAccount = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required for reactivation',
      code: 'REACTIVATION_CREDENTIALS_MISSING'
    });
  }

  try {
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      isActive: false
    }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No deactivated account found with this email',
        code: 'ACCOUNT_NOT_FOUND'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password provided',
        code: 'INVALID_REACTIVATION_CREDENTIALS'
      });
    }

    // Reactivate account
    user.isActive = true;
    user.deactivatedAt = null;
    user.reactivatedAt = Date.now();
    
    user.accountStatusLog.push({
      event: 'reactivation',
      timestamp: new Date(),
      source: 'user' 
    });

    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('[Auth Controller] Reactivation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during account reactivation',
      code: 'REACTIVATION_ERROR',
      systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.checkAccountStatus = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
      code: 'EMAIL_MISSING'
    });
  }

  try {
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    }).select('isActive');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
        code: 'ACCOUNT_NOT_FOUND'
      });
    }

    // Return the account status
    res.status(200).json({
      success: true,
      isActive: user.isActive,
      code: user.isActive ? 'ACCOUNT_ACTIVE' : 'ACCOUNT_INACTIVE'
    });

  } catch (error) {
    console.error('[Auth Controller] Check status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking account status',
      code: 'SERVER_ERROR',
      systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.sendReactivationOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
      code: 'EMAIL_REQUIRED'
    });
  }

  try {
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      isActive: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No deactivated account found with this email',
        code: 'ACCOUNT_NOT_FOUND'
      });
    }

    // Generate OTP (6 digits)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP and expiration in user document
    user.reactivationOTP = otp;
    user.reactivationOTPExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Create email message
  // Create email message
const message = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #6a0dad;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #ffffff;
            padding: 25px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .otp-code {
            background-color: #f5f0fa;
            color: #6a0dad;
            font-size: 24px;
            font-weight: bold;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 5px;
            letter-spacing: 3px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #6a0dad;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Account Reactivation</h1>
    </div>
    <div class="content">
        <p>Hello,</p>
        <p>You've requested to reactivate your account at SwapStay. Please use the following verification code:</p>
        
        <div class="otp-code">${otp}</div>
        
        <p>This code will expire in 15 minutes. If you didn't request this, please ignore this email or contact our support team.</p>
        
        <p>Thank you,<br>The SwapStay Team</p>
    </div>
    <div class="footer">
        <p>© ${new Date().getFullYear()} SwapStay. All rights reserved.</p>
        <p>If you need any help, please contact us at support@swapstay.com</p>
    </div>
</body>
</html>
`;

    // Send email using our updated service
    try {
      await sendEmail({
        email: user.email,
        subject: 'Account Reactivation Code',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Reactivation code sent to your email'
      });
    } catch (emailError) {
      console.error('[Auth Controller] Email sending error:', emailError);
      
      // Still save the OTP but inform the user about email issues
      res.status(200).json({
        success: true,
        message: 'Reactivation code generated but could not send email. Please contact support.',
        debug: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('[Auth Controller] Send Reactivation OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reactivation code',
      code: 'REACTIVATION_OTP_ERROR',
      systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.verifyReactivationOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and verification code are required',
      code: 'REACTIVATION_DATA_MISSING'
    });
  }

  try {
    // Find deactivated user with valid OTP
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      isActive: false,
      reactivationOTP: otp,
      reactivationOTPExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
        code: 'INVALID_OTP'
      });
    }

    // Reactivate account
    user.isActive = true;
    user.deactivatedAt = null;
    user.reactivatedAt = Date.now();

    // Clear OTP fields
    user.reactivationOTP = undefined;
    user.reactivationOTPExpire = undefined;

    // Log reactivation
    user.accountStatusLog.push({
      event: 'reactivation',
      timestamp: new Date(),
      source: 'user'
    });

    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('[Auth Controller] Verify Reactivation OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during account reactivation',
      code: 'REACTIVATION_ERROR',
      systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};