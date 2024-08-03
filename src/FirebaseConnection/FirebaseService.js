import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvVO9_k-A76H4ZaaafLcDapEKAGvgcwJ0",
  authDomain: "barlays-dashboard.firebaseapp.com",
  projectId: "barlays-dashboard",
  storageBucket: "barlays-dashboard.appspot.com",
  messagingSenderId: "882603137272",
  appId: "1:882603137272:web:ebc105e2222c4cc1b4c30d",
  measurementId: "G-11FQG9CX1C",
};

firebase.initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestore = getFirestore();
export default firebase;

class FirebaseService {}

const firebaseService = new FirebaseService();
export { firebaseService };
