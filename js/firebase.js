import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDI89Y0gNBpV_M6z1SmoTO3aW502anTJIE",
  authDomain: "finova-a6602.firebaseapp.com",
  projectId: "finova-a6602",
  storageBucket: "finova-a6602.firebasestorage.app",
  messagingSenderId: "42928281204",
  appId: "1:42928281204:web:a6140e19cb69e8378be321",
  measurementId: "G-CYF2B31RJB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
