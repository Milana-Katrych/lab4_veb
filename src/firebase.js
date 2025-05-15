import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4OzEY5QQGQjACKeQzHXDILO5TER_lcpk",
  authDomain: "laba4-d5b38.firebaseapp.com",
  projectId: "laba4-d5b38",
  storageBucket: "laba4-d5b38.firebasestorage.app",
  messagingSenderId: "945829704514",
  appId: "1:945829704514:web:b3188624b69c4317520edb",
  measurementId: "G-F1WV7NY3WG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);