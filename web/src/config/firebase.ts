import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWZ3OumyoIhfwM8rwLaoL1xXKYN_RXccI",
  authDomain: "kidlife-ca205.firebaseapp.com",
  projectId: "kidlife-ca205",
  storageBucket: "kidlife-ca205.firebasestorage.app",
  messagingSenderId: "489429044553",
  appId: "1:489429044553:web:2502d522dce12f9aa2de98",
  measurementId: "G-BVB57R29H0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
