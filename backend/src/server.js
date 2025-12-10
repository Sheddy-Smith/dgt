require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const { logger } = require('./utils/logger');

// Import routes
const authRoutes = require('./api/auth');
const listingRoutes = require('./api/listings');
const userRoutes = require('./api/users');
const walletRoutes = require('./api/wallet');
const paymentRoutes = require('./api/payments');
const payoutRoutes = require('./api/payouts');
const categoryRoutes = require('./api/categories');
const bannerRoutes = require('./api/banners');
const notificationRoutes = require('./api/notifications');
const reportRoutes = require('./api/reports');
const settingRoutes = require('./api/settings');
const analyticsRoutes = require('./api/analytics');

// Import services
const { initializeWebSocket } = require('./services/websocket.service');
const { startCronJobs } = require('./cron');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io instance globally for access in other modules
global.io = io;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Static file serving (for uploads on Hostinger)
if (process.env.STORAGE_PATH) {
  app.use('/uploads', express.static(process.env.STORAGE_PATH));
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Initialize WebSocket connections
initializeWebSocket(io);

// Start server
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  logger.info(`ðŸš€ Server running on ${HOST}:${PORT}`);
  logger.info(`ðŸ“¦ Environment: ${process.env.NODE_ENV}`);
  logger.info(`ðŸŒ CORS enabled for: ${process.env.CORS_ORIGIN}`);
  
  // Start cron jobs if enabled
  if (process.env.ENABLE_CRON_JOBS === 'true') {
    startCronJobs();
    logger.info('â° Cron jobs started');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server, io };
