import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkLfj59O2GbdLElL_T329dUK5TN71wqW4",
  authDomain: "usam-b014b.firebaseapp.com",
  projectId: "usam-b014b",
  storageBucket: "usam-b014b.appspot.com",
  messagingSenderId: "390700110180",
  appId: "1:390700110180:web:d56c666b92381c7b88ea71",
  measurementId: "G-KH5RHRFPK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);  // Initialize Firebase Auth
const analytics = getAnalytics(app);

export { db, auth };
