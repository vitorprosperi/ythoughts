// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx4fX0_WrNBJm0_1REB5s3mFp0mXKkNyQ",
  authDomain: "ythoughts-80737.firebaseapp.com",
  projectId: "ythoughts-80737",
  storageBucket: "ythoughts-80737.appspot.com",
  messagingSenderId: "169920519063",
  appId: "1:169920519063:web:1775d2c9fbc93f900f82d2",
  measurementId: "G-Y7N50VT52R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);