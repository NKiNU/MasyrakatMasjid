// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMxcPQnZtlmhoYPHp8WshLhMKD4JM7MCc",
  authDomain: "masyarakat-masjid-10fc1.firebaseapp.com",
  projectId: "masyarakat-masjid-10fc1",
  storageBucket: "masyarakat-masjid-10fc1.appspot.com",
  messagingSenderId: "415198236168",
  appId: "1:415198236168:web:b0dbb31b6908334bfccbbd",
  measurementId: "G-0VGVSJBV6S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const imgDB = getStorage(app);

export { imgDB };
