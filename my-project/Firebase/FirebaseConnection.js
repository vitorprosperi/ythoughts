import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";

let firebaseApp; // Variável para armazenar a instância do Firebase App

const useAuth = () => {
  const [authInfo, setAuthInfo] = useState({ user: null, loading: true });
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setAuthInfo({ user, loading: false });
    });

    return unsubscribe;
  }, []);

  return authInfo;
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

// Inicialize o aplicativo do Firebase somente se ainda não estiver inicializado
if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig);
}

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db, useAuth };
