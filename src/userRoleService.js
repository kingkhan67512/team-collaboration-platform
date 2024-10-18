// src/userRoleService.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Ensure Firestore is configured in firebase.js

// Function to get user role from Firestore
const getUserRole = async (userId) => {
  const docRef = doc(db, "users", userId); // Assuming roles are stored in Firestore under "users" collection
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().role; // Assuming 'role' is a field in the user document
  } else {
    console.log("No such document!");
    return null;
  }
};

export { getUserRole }; // Export the function for use in other files
