import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';

// Load .env
config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  try {
    console.log('Testing SMTP connection with user:', process.env.SMTP_USER);
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // Send to self
      subject: 'KidLife SMTP Test',
      text: 'This is a test email from KidLife backend to verify SMTP configuration.',
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

testEmail();
