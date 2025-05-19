const { io } = require('socket.io-client');

const SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const socket = io(SERVER_URL, {
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  transports: ['websocket'] 
});

// Connection status tracking
let isConnected = false;

socket.on('connect', () => {
  isConnected = true;
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  isConnected = false;
  console.log('Socket disconnected');
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message);
});

// Reconnect logic
socket.on('reconnect_attempt', (attempt) => {
  console.log(`Reconnection attempt ${attempt}`);
});

// Helper function to ensure socket is connected
const ensureConnection = async () => {
  if (isConnected) return true;
  
  return new Promise((resolve) => {
    const check = () => {
      if (isConnected) {
        resolve(true);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

module.exports = {
  socket,
  ensureConnection
};