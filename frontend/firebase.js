// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "brijwalla.firebaseapp.com",
  projectId: "brijwalla",
  storageBucket: "brijwalla.firebasestorage.app",
  messagingSenderId: "681366752060",
  appId: "1:681366752060:web:0996874a36bb4dce5b2c39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}