import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA__DWH1BvUh0xRu_PtMqyChMzgNMxnXYE",              // paste your config here
  authDomain: "smart-gym-app-4be95.firebaseapp.com",
  projectId: "smart-gym-app-4be95.firebaseapp.com",
  storageBucket: "smart-gym-app-4be95.firebasestorage.app",
  messagingSenderId:  "183754804013",
  appId: "1:183754804013:web:af874e546cd611502021a4",
  measurementId: "G-EZ30VRK9S5",
  databaseURL:"https://smart-gym-app-4be95-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);