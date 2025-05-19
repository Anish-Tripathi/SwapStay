let ioInstance;

module.exports = {
  setIO: (io) => {
    ioInstance = io;
    
    ioInstance.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);
      
      // Join user-specific room
      socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join chat room for real-time updates
      socket.on('join-chat-room', (roomSwapId) => {
        socket.join(`chat-${roomSwapId}`);
        console.log(`User joined chat room ${roomSwapId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  },

  getIO: () => {
    if (!ioInstance) throw new Error('Socket.io not initialized!');
    return ioInstance;
  },

  // Helper methods for emitting events
  emitToUser: (userId, event, data) => {
    ioInstance.to(`user-${userId}`).emit(event, data);
  },

  emitToChat: (roomSwapId, event, data) => {
    ioInstance.to(`chat-${roomSwapId}`).emit(event, data);
  }
};