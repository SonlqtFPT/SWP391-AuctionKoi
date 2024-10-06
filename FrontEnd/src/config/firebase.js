// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpVDDAW3sY0-5QK3uAJZDC0l3XfeojOW4",
  authDomain: "koifish-e7d4c.firebaseapp.com",
  projectId: "koifish-e7d4c",
  storageBucket: "koifish-e7d4c.appspot.com",
  messagingSenderId: "739005138123",
  appId: "1:739005138123:web:0d3a200dc37ed670f6c74e",
  measurementId: "G-HKD5SS3FWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage};