import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth,initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  
});
const FIREBASE_AUTH = getAuth(app);

export { db, storage, auth as FIREBASE_AUTH };

