import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";


//struct for firebase data DO NOT TOUCH THIS
export const firebaseConfig = {
    apiKey: "AIzaSyC8BtJeetmmRyCk5OHFgHowu93o52UQHDo",
    authDomain: "paper-trader-53ba3.firebaseapp.com",
    projectId: "paper-trader-53ba3",
    storageBucket: "paper-trader-53ba3.appspot.com",
    messagingSenderId: "613651748321",
    appId: "1:613651748321:web:c70a2b4775621ad29eeea0"
}


//initilizes firebase
const app = initializeApp(firebaseConfig);

//initializes firestore
const db = getFirestore(app);

//authorizes user
const auth = getAuth();

//test add to database
export async function testAdd(){
  try {
    const docRef = await addDoc(collection(db, "testUsersData"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

//simplified signup function
export function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

//simplified login funtion
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

//logs user out
export function logout() {
    return signOut(auth)
}

//Custom hook for userAuth refresh
export function useAuth() {
    //this is complicated so no touchy 
    //it gets user and sets user 
    //it has embedded functions which are confusing

    const [currentUser, setCurrentUser] = useState();

    useEffect(()=> {
        const unsub =  onAuthStateChanged(auth, user => setCurrentUser(user));
        return unsub;
    }, [])

    return currentUser;

}