"use client";
import { useState } from "react";
import { useUserAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  
  const { user, signUp } = useUserAuth();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    const { error } = await signUp(email, password, firstName, lastName);
    if (error) {
      setError(error);
    } else {
      router.push("/search"); 
    }
  };

  return (
    <div className="flex items-center justify-center bg-stone-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-stone-100">
        <h2 className="text-2xl font-serif font-bold text-emerald-900 text-center mb-2">
          Join the Ledger
        </h2>
        <p className="text-stone-500 text-sm text-center mb-8 italic">
          Start your personal reading archive today.
        </p>

        {error && (
          <p className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="First Name"
              required
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-50/50"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Last Name"
              required
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-50/50"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          
          <input 
            type="email" 
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-50/50"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="password" 
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-50/50"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input 
            type="password" 
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-50/50"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="w-full bg-emerald-800 text-white font-bold py-3 rounded-lg hover:bg-emerald-900 transition shadow-md mt-2">
            Create Account
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-stone-600 text-sm">
            Already have an account?{" "}
            <Link href="/" className="text-emerald-800 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}