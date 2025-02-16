// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-829e1.firebaseapp.com",
    projectId: "mern-blog-829e1",
    storageBucket: "mern-blog-829e1.firebasestorage.app",
    messagingSenderId: "180149087787",
    appId: "1:180149087787:web:d454e289015c3c4776846e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
