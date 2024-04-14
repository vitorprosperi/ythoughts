import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { useState, useEffect } from 'react';


const useAuth = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return user;
};


const firebaseConfig = {
  apiKey: "AIzaSyDx4fX0_WrNBJm0_1REB5s3mFp0mXKkNyQ",
  authDomain: "ythoughts-80737.firebaseapp.com",
  projectId: "ythoughts-80737",
  storageBucket: "ythoughts-80737.appspot.com",
  messagingSenderId: "169920519063",
  appId: "1:169920519063:web:1775d2c9fbc93f900f82d2",
  measurementId: "G-Y7N50VT52R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db, useAuth};
