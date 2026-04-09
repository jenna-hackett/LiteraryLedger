"use client";
import { useState } from "react";
import { useUserAuth } from "./contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EntryPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleSignIn } = useUserAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await login(email, password);
    if (!error) {
      router.push("/home");
    } else {
      setError(error);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await googleSignIn();
    if (!error) {
      router.push("/home");
    } else {
      setError(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent py-12 px-4">
      
      {/* Card Style */}
      <div className="max-w-md w-full bg-[#fdfcf7] p-10 rounded-lg shadow-[4px_4px_0px_rgba(28,46,28,0.1)] border border-stone-300">
        <h2 className="text-3xl font-serif font-bold text-emerald-900 text-center mb-2">
          Sign in to your Ledger
        </h2>
        <p className="text-stone-500 text-sm text-center mb-8 italic font-serif">
          Return to your personal archive.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-900/5 text-red-700 text-xs rounded border border-red-200/50 text-center font-serif italic">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Inputs */}
          <input 
            type="email" 
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded border border-stone-300/60 focus:border-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-800/5 font-serif"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full px-4 py-3 rounded border border-stone-300/60 focus:border-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-800/5 font-serif"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button className="w-full bg-emerald-900 text-white font-serif tracking-widest uppercase text-xs py-4 rounded hover:bg-emerald-800 transition-all shadow-md">
            Enter Library
          </button>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <hr className="border-stone-300/40" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fdfcf7] px-4 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
              Or
            </span>
          </div>

          {/* Google Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-stone-300/60 py-3 rounded hover:bg-stone-800/5 transition-all font-serif text-stone-700 text-sm shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-200 text-center">
          <p className="text-stone-600 text-sm font-serif">
            New to the archives?{" "}
            <Link href="/register" className="text-emerald-900 font-bold hover:underline">
              Start your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}