import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
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

// sign out
export const logOut = async () => {
  await signOut(auth);
  localStorage.removeItem('user');
};

// helpers for local storage to keep previous logic working
export function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}
export function getCurrentUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}


