// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Configurație Firebase
  apiKey: "AIzaSyCSC97N1c5Rd-mIrU9URBK4dsNu4YR28k8",
  authDomain: "noble-house--ads-preview.firebaseapp.com",
  projectId: "noble-house--ads-preview",
  storageBucket: "noble-house--ads-preview.firebasestorage.app",
  messagingSenderId: "760782390491",
  appId: "1:760782390491:web:925185da4af46623f0b8fe",
  measurementId: "G-YM9J0D7HWN"
};

// Inițializează aplicația
const app = initializeApp(firebaseConfig);

// Referință la Firestore
const db = getFirestore(app);

// Referință la Auth (pentru login cu email/parolă)
const auth = getAuth(app);

export { db, auth };
