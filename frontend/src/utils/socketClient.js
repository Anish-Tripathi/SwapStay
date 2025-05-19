
import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }

  connect(authToken) {
    if (this.socket?.connected) return;

    this.socket = io(this.SERVER_URL, {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
      auth: { token: authToken }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      // Join user-specific room after connection
      if (authToken) {
        this.joinUserRoom();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });
  }

  joinUserRoom() {
    if (!this.socket) return;
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      this.socket.emit('join-user-room', userId);
    }
  }

  //  remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketClient = new SocketClient();
export default socketClient;