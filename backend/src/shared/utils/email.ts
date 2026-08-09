import nodemailer from 'nodemailer';
import { env } from '../../config/env';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (env.nodeEnv === 'development') {
    logger.info(`[Mock Email] To: ${to}, Subject: ${subject}`);
    return; // Mock email in dev
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"KidLife" <noreply@kidlife.com>',
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error('Error sending email', { error });
    throw new Error('Failed to send email');
  }
};
