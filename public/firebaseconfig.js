import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import { getFirestore,collection, getDocs,query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm2atJDKZpTvpfFUZcVvlqF9yP0LaoKvs",
  authDomain: "greenponia-b8a97.firebaseapp.com",
  projectId: "greenponia-b8a97",
  storageBucket: "greenponia-b8a97.appspot.com",
  messagingSenderId: "352633184413",
  appId: "1:352633184413:web:69c661fc0100f9ed20f474",
  measurementId: "G-CFJZGNQWJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Firestore
export const db = getFirestore(app);
