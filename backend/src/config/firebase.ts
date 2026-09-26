import * as admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

// Thiếu cấu hình → chỉ tắt đăng nhập Google, không làm sập cả server
if (!serviceAccountJson) {
  console.warn('Cảnh báo: thiếu FIREBASE_SERVICE_ACCOUNT → đăng nhập Google sẽ không hoạt động.');
} else if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
  });
}

export const firebaseAdmin = admin;
