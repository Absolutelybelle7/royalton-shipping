// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_nDTxt46m0SV7Mb_1gHD76GaqFAYNlb0",
  authDomain: "shipping-2121.firebaseapp.com",
  projectId: "shipping-2121",
  storageBucket: "shipping-2121.firebasestorage.app",
  messagingSenderId: "592539455498",
  appId: "1:592539455498:web:68fe61e9eeb420a3ff0ff3",
  measurementId: "G-3SR9M7576W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Analytics (optional, can be removed if not needed)
getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;