// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJQR8RPKR3IyWUXtjRLm0Gs9VGUkHFovQ",
  authDomain: "fir-test-ddf72.firebaseapp.com",
  projectId: "fir-test-ddf72",
  storageBucket: "fir-test-ddf72.appspot.com",
  messagingSenderId: "789604110114",
  appId: "1:789604110114:web:ebf5e05bf9ea91572f9f7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()