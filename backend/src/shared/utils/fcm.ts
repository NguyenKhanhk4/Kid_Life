import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { logger } from './logger';

// Initialize Firebase Admin (only once)
try {
  if (!getApps().length) {
    // Attempt to load from env var or mock if not available
    const serviceAccountJson = process.env.FCM_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      initializeApp({
        credential: cert(serviceAccount),
      });
      logger.info('Firebase Admin initialized successfully');
    } else {
      logger.warn('FCM_SERVICE_ACCOUNT_JSON not provided. Push notifications will be mocked.');
    }
  }
} catch (error) {
  logger.error('Failed to initialize Firebase Admin', { error });
}

export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  if (!getApps().length) {
    logger.info(`[Mock FCM] Token: ${fcmToken}, Title: ${title}, Body: ${body}`);
    return; // Mock in dev/if unconfigured
  }

  try {
    const message = {
      notification: { title, body },
      data,
      token: fcmToken,
    };
    await getMessaging().send(message);
    logger.info(`Push notification sent to token: ${fcmToken}`);
  } catch (error) {
    logger.error('Error sending push notification', { error });
  }
};
