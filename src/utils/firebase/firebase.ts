// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDre2X-oOWjoyFnJhHJWOiG7YPiriKSZFg",
  authDomain: "greetinginvite.firebaseapp.com",
  projectId: "greetinginvite",
  storageBucket: "greetinginvite.firebasestorage.app",
  messagingSenderId: "463510580724",
  appId: "1:463510580724:web:79c1460479a2909ea85da1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
