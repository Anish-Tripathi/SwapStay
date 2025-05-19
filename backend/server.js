const dotenv = require('dotenv');
dotenv.config();
const { checkEmailConfig } = require('./config/emailConfig');
checkEmailConfig();
const { setIO } = require('./utils/socketServer');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');

// Import routes
const userRoutes = require('./routes/userRoutes');
const complaintsRoutes = require('./routes/complaintsRoutes');
const stripeRoutes = require('./routes/stripePaymentRoute');
const guestHouseRoutes = require('./routes/guestHouseRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const roomSettingRoutes = require('./routes/roomSettingRoute');
const messRoutes = require('./routes/messRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const roomSwapRoutes = require('./routes/roomSwapRoutes');
const roomRoutes = require('./routes/roomRoutes');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);


const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean); 

// Configure Socket.IO 
const io = socketIo(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

setIO(io);

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
     
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {

  const originalRedirect = res.redirect;
  res.redirect = function(url) {
  
    console.trace();
    return originalRedirect.apply(this, arguments);
  };
  
  next();
});

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1y',
  immutable: true
}));

app.use('/images', express.static(path.join(__dirname, 'public/images'), {
  maxAge: '1y',
  immutable: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/complaints', complaintsRoutes);
app.use('/api', stripeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', require('./routes/authRoutes'));
app.use('/api/rooms', roomRoutes);
app.use('/api/rooms', roomSwapRoutes);
app.use('/api/guesthouses', guestHouseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', roomSettingRoutes);
app.use('/api/mess', messRoutes);

// Uploads directory
const uploadsDir = path.join(__dirname, 'uploads', 'rooms');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


app.get('/', (req, res) => {
  res.send('Auth API is running');
});

// Socket.IO connection handling
io.on('connection', (socket) => {

  
  // Join a room for private messaging
  socket.on('join-room', (roomId) => {
    socket.join(`chat-${roomId}`);
   
  });
  
  // Let users join their personal notification room
  socket.on('register-user', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
     
    }
  });
  
  // Handle new messages
  socket.on('send-message', (data) => {
  
    
    // Broadcast message to room
    io.to(`chat-${data.roomSwapId}`).emit('receive-message', data);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});