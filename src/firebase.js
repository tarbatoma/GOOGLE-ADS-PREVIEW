// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Configurația ta Firebase
  apiKey: "AIzaSyDBLaC2rNb87SOkPE3rRkAgXIq3tCylH2A",
  authDomain: "noble-house-gads-preview.firebaseapp.com",
  projectId: "noble-house-gads-preview",
  storageBucket: "noble-house-gads-preview.firebasestorage.app",
  messagingSenderId: "536676302866",
  appId: "1:536676302866:web:8040fdb7516b0d727698cb",
  measurementId: "G-W1BZTKZRBL"
};

// Inițializează aplicația
const app = initializeApp(firebaseConfig);

// Referință la Firestore
const db = getFirestore(app);

// Referință la Auth (pentru login cu email/parolă)
const auth = getAuth(app);

export { db, auth };
