// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Copiază aici configurația de la Firebase console
  apiKey: "AIzaSyDBLaC2rNb87SOkPE3rRkAgXIq3tCylH2A",
  authDomain: "noble-house-gads-preview.firebaseapp.com",
  projectId: "noble-house-gads-preview",
  storageBucket: "noble-house-gads-preview.firebasestorage.app",
  messagingSenderId: "536676302866",
  appId: "1:536676302866:web:8040fdb7516b0d727698cb",
  measurementId: "G-W1BZTKZRBL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
