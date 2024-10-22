// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { GoogleAuthProvider } from "firebase/auth";


const googleProvider = new GoogleAuthProvider();
const firebaseConfig = {
    apiKey: "AIzaSyAGrmgZPIZeO4yD1ng6RSyRu0GgapNB-YE",
    authDomain: "swptest-7f1bb.firebaseapp.com",
    databaseURL: "https://swptest-7f1bb-default-rtdb.firebaseio.com",
    projectId: "swptest-7f1bb",
    storageBucket: "swptest-7f1bb.appspot.com",
    messagingSenderId: "312264882389",
    appId: "1:312264882389:web:cff6e4f72e3eb201518a5c",
    measurementId: "G-5DFMCPBY4W",
};

const VAPID_KEY =
  "BD0-JWIbZUQTgjrvMX73egd8tqDXECe_GGG_xDsrqbCwber3dpU3KsJW9Q0xAoj4OAd7H5UU-lQ-SYbIQifVA_c";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage, googleProvider, app, VAPID_KEY };
