import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfQ-wRmBoGmNTZVH5O1kzj6-JsgOFbZ-E",
  authDomain: "learning-ai-84e33.firebaseapp.com",
  projectId: "learning-ai-84e33",
  storageBucket: "learning-ai-84e33.firebasestorage.app",
  messagingSenderId: "137892156340",
  appId: "1:137892156340:web:104195e6aaacb05e4798e1",
  measurementId: "G-V97VXR8DKG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign In
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Email/Password Sign Up
export const signUpWithEmail = (email, password, displayName) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(userCredential.user, {
        displayName: displayName
      }).then(() => userCredential.user);
    });
};

// Email/Password Sign In
export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Forgot Password
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Sign Out
export const logOut = () => {
  return signOut(auth);
};

