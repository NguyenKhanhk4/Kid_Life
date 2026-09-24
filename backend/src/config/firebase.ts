import * as admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountJson) {
  console.error("Lỗi: Không tìm thấy biến môi trường FIREBASE_SERVICE_ACCOUNT!");
}

const serviceAccount = serviceAccountJson ? JSON.parse(serviceAccountJson) : {};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firebaseAdmin = admin;
