// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGlfwYF9K7qjXjt8HbZJBlhhJ7rMJ49cw",
  authDomain: "nutrifit-app-e1e60.firebaseapp.com",
  projectId: "nutrifit-app-e1e60",
  storageBucket: "nutrifit-app-e1e60.appspot.com",
  messagingSenderId: "843616849605",
  appId: "1:843616849605:web:5bbb1e6c7a36bb8199eaac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;