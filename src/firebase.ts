// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log("Firebase");
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_apiKey,
  authDomain: import.meta.env.VITE_API_authDomain,
  projectId: import.meta.env.VITE_API_projectId,
  storageBucket: import.meta.env.VITE_API_storageBucket,
  messagingSenderId: import.meta.env.VITE_API_messagingSenderId,
  databaseURL: import.meta.env.VITE_API_databaseURL,
  appId: import.meta.env.VITE_API_appId,
  measurementId: import.meta.env.VITE_API_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);
export { app, analytics, db, database };
