"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db, googleProvider } from "@/app/utils/firebase";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/Password Sign Up
  async function signUp(email, password, firstName, lastName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Create user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        userId: uid,
        firstName,
        lastName,
        email,
        role: "user", // Changed to user as default
        createdAt: new Date().toISOString(),
      });

      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  // Email/Password Login
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  // Google Sign-In
  async function googleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create or update user profile in Firestore
      // { merge: true } ensures we don't overwrite existing bios/data
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        firstName: user.displayName?.split(" ")[0] || "User",
        lastName: user.displayName?.split(" ")[1] || "",
        email: user.email,
        role: "user",
      }, { merge: true });

      return { user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  // Logout
  async function logout() {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, googleSignIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(AuthContext);
}