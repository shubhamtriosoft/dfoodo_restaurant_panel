import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXNe9s5Mq9aKGytBlAycyY224wyvI8yf4",
  authDomain: "dfoodo2024.firebaseapp.com",
  projectId: "dfoodo2024",
  storageBucket: "dfoodo2024.appspot.com",
  messagingSenderId: "186101617757",
  appId: "1:186101617757:web:c0ad1d41f343e521a7e9b4",
  measurementId: "G-DTE6272F9Q"
};

firebase.initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestore = getFirestore();
export default firebase;

class FirebaseService {}

const firebaseService = new FirebaseService();
export { firebaseService };
