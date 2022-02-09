import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRc2aWh6F3akh5wRgv8fRr3CJ2NYFUBZo",
  authDomain: "productify-5e45b.firebaseapp.com",
  projectId: "productify-5e45b",
  storageBucket: "productify-5e45b.appspot.com",
  messagingSenderId: "22343856035",
  appId: "1:22343856035:web:9a10c9718422f32253b416",
  measurementId: "G-8CS8GRFQ8T",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
