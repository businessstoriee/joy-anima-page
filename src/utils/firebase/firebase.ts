// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDre2X-oOWjoyFnJhHJWOiG7YPiriKSZFg",
//   authDomain: "greetinginvite.firebaseapp.com",
//   projectId: "greetinginvite",
//   storageBucket: "greetinginvite.appspot.app",
//   messagingSenderId: "463510580724",
//   appId: "1:463510580724:web:79c1460479a2909ea85da1"
// };

const firebaseConfig = {
  apiKey: "AIzaSyC-XCK3VLUXlUKf9eTlerq0N4PwuVm7qdc",
  authDomain: "greetinginvite-2c05c.firebaseapp.com",
  projectId: "greetinginvite-2c05c",
  storageBucket: "greetinginvite-2c05c.firebasestorage.app",
  messagingSenderId: "892414484193",
  appId: "1:892414484193:web:972b4d0bfdcb0414b221a0",
  measurementId: "G-MQ8KZRTQEF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);