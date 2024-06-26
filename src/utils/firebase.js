// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importar Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2e9KwwmCZDFISb1wV7UbKPn0_bsePwSU",
  authDomain: "classappv2-e296d.firebaseapp.com",
  projectId: "classappv2-e296d",
  storageBucket: "classappv2-e296d.appspot.com",
  messagingSenderId: "151571472717",
  appId: "1:151571472717:web:4d0bfd2594b07f73db1704"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializar Firebase Storage

export { auth, db, storage };
