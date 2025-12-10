require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');
const next = require('next');
const path = require('path');

// Import backend middleware
const { errorHandler } = require('./backend/src/middleware/errorHandler');
const { rateLimiter } = require('./backend/src/middleware/rateLimiter');
const { logger } = require('./backend/src/utils/logger');

// Import backend routes
const authRoutes = require('./backend/src/api/auth');
const listingRoutes = require('./backend/src/api/listings');
const userRoutes = require('./backend/src/api/users');
const walletRoutes = require('./backend/src/api/wallet');
const paymentRoutes = require('./backend/src/api/payments');
const payoutRoutes = require('./backend/src/api/payouts');
const categoryRoutes = require('./backend/src/api/categories');
const bannerRoutes = require('./backend/src/api/banners');
const notificationRoutes = require('./backend/src/api/notifications');
const reportRoutes = require('./backend/src/api/reports');
const settingRoutes = require('./backend/src/api/settings');
const analyticsRoutes = require('./backend/src/api/analytics');

// Import backend services
const { initializeWebSocket } = require('./backend/src/services/websocket.service');
const { startCronJobs } = require('./backend/src/cron');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io instance globally
global.io = io;

// Security and compression
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined', { 
  stream: { write: message => logger.info(message.trim()) } 
}));

// Rate limiting for API routes only
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      userApp: 'running',
      adminPanel: 'running',
      backendAPI: 'running'
    }
  });
});

// Backend API Routes (all under /api)
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

// Static file serving (for uploads)
if (process.env.STORAGE_PATH) {
  app.use('/uploads', express.static(process.env.STORAGE_PATH));
}

// Initialize Next.js apps
async function startServer() {
  try {
    // User App (main marketplace)
    const userApp = next({ 
      dev, 
      dir: __dirname,
      conf: { 
        distDir: './.next',
        basePath: '',
      }
    });
    await userApp.prepare();
    const userHandle = userApp.getRequestHandler();

    // Admin Panel
    const adminApp = next({ 
      dev, 
      dir: path.join(__dirname, 'admin_panel'),
      conf: { 
        distDir: './.next',
        basePath: '/admin',
      }
    });
    await adminApp.prepare();
    const adminHandle = adminApp.getRequestHandler();

    // Route handlers
    // Admin panel routes (all /admin/* requests)
    app.use('/admin', (req, res, next) => {
      return adminHandle(req, res);
    });

    // User app routes (everything else except /api)
    app.use((req, res, next) => {
      // Skip API routes and socket.io
      if (req.url.startsWith('/api') || req.url.startsWith('/socket.io')) {
        return next();
      }
      return userHandle(req, res);
    });

    // Global error handler
    app.use(errorHandler);

    // Initialize WebSocket
    initializeWebSocket(io);

    // Start server
    server.listen(PORT, HOST, () => {
      logger.info(`
╔════════════════════════════════════════════════════════════╗
║  🚀 UNIFIED SERVER RUNNING                                  ║
╠════════════════════════════════════════════════════════════╣
║  📍 Host: ${HOST}:${PORT}                                   ║
║  🌍 Environment: ${process.env.NODE_ENV}                    ║
║                                                            ║
║  🔗 Applications:                                          ║
║    • User App:      http://localhost:${PORT}               ║
║    • Admin Panel:   http://localhost:${PORT}/admin         ║
║    • Backend API:   http://localhost:${PORT}/api           ║
║    • Health Check:  http://localhost:${PORT}/health        ║
║                                                            ║
║  🔌 WebSocket:      ws://localhost:${PORT}/socket.io       ║
╚════════════════════════════════════════════════════════════╝
      `);

      // Start cron jobs if enabled
      if (process.env.ENABLE_CRON_JOBS === 'true') {
        startCronJobs();
        logger.info('⏰ Cron jobs started');
      }
    });

  } catch (err) {
    logger.error('Server startup error:', err);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

module.exports = { app, server, io };
