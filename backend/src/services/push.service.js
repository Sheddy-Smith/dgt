const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

// Initialize Firebase Admin
let firebaseApp;

try {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
  logger.info('✅ Firebase Admin initialized');
} catch (error) {
  logger.error('❌ Firebase Admin initialization failed:', error);
}

class PushNotificationService {
  /**
   * Send push notification to single device
   */
  async sendToDevice(deviceToken, { title, body, data = {}, imageUrl }) {
    try {
      const message = {
        token: deviceToken,
        notification: {
          title,
          body,
          ...(imageUrl && { imageUrl })
        },
        data: this.convertDataToStrings(data),
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await admin.messaging().send(message);
      logger.info(`Push notification sent to ${deviceToken}: ${response}`);
      return response;
    } catch (error) {
      logger.error('Failed to send push notification:', error);
      throw error;
    }
  }

  /**
   * Send push notification to multiple devices
   */
  async sendToMultipleDevices(deviceTokens, { title, body, data = {}, imageUrl }) {
    try {
      const message = {
        notification: {
          title,
          body,
          ...(imageUrl && { imageUrl })
        },
        data: this.convertDataToStrings(data),
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        },
        tokens: deviceTokens
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      logger.info(`Push notifications sent: ${response.successCount} success, ${response.failureCount} failed`);
      return response;
    } catch (error) {
      logger.error('Failed to send push notifications:', error);
      throw error;
    }
  }

  /**
   * Send notification to topic
   */
  async sendToTopic(topic, { title, body, data = {}, imageUrl }) {
    try {
      const message = {
        topic,
        notification: {
          title,
          body,
          ...(imageUrl && { imageUrl })
        },
        data: this.convertDataToStrings(data),
        android: {
          priority: 'high'
        }
      };

      const response = await admin.messaging().send(message);
      logger.info(`Push notification sent to topic ${topic}: ${response}`);
      return response;
    } catch (error) {
      logger.error(`Failed to send notification to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe devices to topic
   */
  async subscribeToTopic(deviceTokens, topic) {
    try {
      const response = await admin.messaging().subscribeToTopic(deviceTokens, topic);
      logger.info(`Subscribed ${response.successCount} devices to topic ${topic}`);
      return response;
    } catch (error) {
      logger.error(`Failed to subscribe to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Convert data object values to strings (FCM requirement)
   */
  convertDataToStrings(data) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }
}

module.exports = new PushNotificationService();
