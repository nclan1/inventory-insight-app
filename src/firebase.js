import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: "inventory-insight",
  storageBucket: "inventory-insight.appspot.com",
  messagingSenderId: "1077437198359",
  appId: "1:1077437198359:web:62912d4967c1420895ac52",
  measurementId: "G-MJ43PLJN0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };