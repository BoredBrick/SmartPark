import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBNYWs-MyUXiTn4SedItVDtTHfwk9acUeI",

  authDomain: "smartpark-d9f63.firebaseapp.com",

  projectId: "smartpark-d9f63",

  storageBucket: "smartpark-d9f63.appspot.com",

  messagingSenderId: "682918839067",

  appId: "1:682918839067:web:edae1a1a14664e2e81c9be",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
