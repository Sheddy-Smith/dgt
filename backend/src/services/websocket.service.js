const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

const connectedUsers = new Map(); // userId -> socket.id mapping

function initializeWebSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    connectedUsers.set(userId, socket.id);
    
    logger.info(`User connected: ${userId} (socket: ${socket.id})`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Join role-based rooms
    if (socket.userRole === 'ADMIN' || socket.userRole === 'SUPER_ADMIN') {
      socket.join('admins');
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      logger.info(`User disconnected: ${userId}`);
    });

    // Handle custom events
    socket.on('subscribe:listing', (listingId) => {
      socket.join(`listing:${listingId}`);
      logger.info(`User ${userId} subscribed to listing ${listingId}`);
    });

    socket.on('unsubscribe:listing', (listingId) => {
      socket.leave(`listing:${listingId}`);
      logger.info(`User ${userId} unsubscribed from listing ${listingId}`);
    });

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
  });
}

/**
 * Emit event to specific user
 */
function emitToUser(userId, event, data) {
  const io = global.io;
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    logger.debug(`Emitted ${event} to user ${userId}`);
  }
}

/**
 * Emit event to all admins
 */
function emitToAdmins(event, data) {
  const io = global.io;
  if (io) {
    io.to('admins').emit(event, data);
    logger.debug(`Emitted ${event} to admins`);
  }
}

/**
 * Emit event related to a listing
 */
function emitListingUpdate(listingId, event, data) {
  const io = global.io;
  if (io) {
    io.to(`listing:${listingId}`).emit(event, data);
    logger.debug(`Emitted ${event} for listing ${listingId}`);
  }
}

/**
 * Broadcast to all connected clients
 */
function broadcast(event, data) {
  const io = global.io;
  if (io) {
    io.emit(event, data);
    logger.debug(`Broadcasted ${event} to all clients`);
  }
}

/**
 * Get connected users count
 */
function getConnectedUsersCount() {
  return connectedUsers.size;
}

/**
 * Check if user is online
 */
function isUserOnline(userId) {
  return connectedUsers.has(userId);
}

module.exports = {
  initializeWebSocket,
  emitToUser,
  emitToAdmins,
  emitListingUpdate,
  broadcast,
  getConnectedUsersCount,
  isUserOnline
};
