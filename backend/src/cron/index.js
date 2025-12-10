const cron = require('node-cron');

// Import all cron jobs
const expireListings = require('./expireListings');
const expiringReminders = require('./expiringReminders');
const analyticsSnapshot = require('./analyticsSnapshot');

/**
 * Start all cron jobs
 */
function startCronJobs() {
  console.log('Starting cron jobs...');
  
  expireListings.start();
  expiringReminders.start();
  analyticsSnapshot.start();
  
  console.log('All cron jobs started');
}

/**
 * Stop all cron jobs
 */
function stopCronJobs() {
  console.log('Stopping cron jobs...');
  
  expireListings.stop();
  expiringReminders.stop();
  analyticsSnapshot.stop();
  
  console.log('All cron jobs stopped');
}

module.exports = {
  startCronJobs,
  stopCronJobs
};
