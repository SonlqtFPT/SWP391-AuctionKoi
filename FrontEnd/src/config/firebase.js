
import { GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const googleProvider = new GoogleAuthProvider();

const firebaseConfig = {
    apiKey: "AIzaSyDXVoeIEUHQIE7VgWzcEiu_Itq7QxextIg",
    authDomain: "koi-auction-33946.firebaseapp.com",
    projectId: "koi-auction-33946",
    storageBucket: "koi-auction-33946.appspot.com",
    messagingSenderId: "673189776727",
    appId: "1:673189776727:web:cd21658dfd93796a44c212",
    measurementId: "G-8BKNLWWT83"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {googleProvider};