
let ioInstance;

module.exports = {
  setIO: (io) => {
    ioInstance = io;
    
    // Connection handling 
    ioInstance.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);
      
      // Join user-specific room
      socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  },
  getIO: () => {
    if (!ioInstance) {
      throw new Error('Socket.io not initialized!');
    }
    return ioInstance;
  }
};