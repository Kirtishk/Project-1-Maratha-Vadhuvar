import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwuCFhF2IMvENx-cFFSXxzB-54XBKatMU",
  authDomain: "maratha-vaduvar.firebaseapp.com",
  projectId: "maratha-vaduvar",
  storageBucket: "maratha-vaduvar.firebasestorage.app",
  messagingSenderId: "1068966628271",
  appId: "1:1068966628271:web:df5472db2a102a920e7d5a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
    db,
    auth
}

