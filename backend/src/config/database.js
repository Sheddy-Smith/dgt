const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

// Log Prisma warnings and errors
prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', e);
});

prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e);
});

// Test database connection
prisma.$connect()
  .then(() => logger.info('✅ Database connected successfully'))
  .catch((error) => logger.error('❌ Database connection failed:', error));

module.exports = prisma;
