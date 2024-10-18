// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_fIZX7yQa2tKDIhsURlPymNUZbcsmHXc",
  authDomain: "my-app-f440c.firebaseapp.com",
  projectId: "my-app-f440c",
  storageBucket: "my-app-f440c.appspot.com", // Ensure you have this storageBucket entry
  messagingSenderId: "245194424441",
  appId: "1:245194424441:web:ee407435409064958c54a8",
  measurementId: "G-FE70C2TTSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage }; // Export storage
