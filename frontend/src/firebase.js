import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFywEb7NeyXtryzA84ftSKk15mOARkT4w",
  authDomain: "social-media-app-a58dc.firebaseapp.com",
  projectId: "social-media-app-a58dc",
  storageBucket: "social-media-app-a58dc.firebasestorage.app",
  messagingSenderId: "1092862997278",
  appId: "1:1092862997278:web:bc471bfd462d71c9b48f0f",
  measurementId: "G-B891KWPCVX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
