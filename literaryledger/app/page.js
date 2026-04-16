"use client";
import { useState } from "react";
import { useUserAuth } from "./contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "./components/FormInput";
import GoogleButton from "./components/GoogleButton";

export default function EntryPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, googleSignIn } = useUserAuth();
  const router = useRouter();

  const handleChange = (e, field) => {
    setCredentials({ ...credentials, [field]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error: loginError } = await login(credentials.email, credentials.password);
    if (!loginError) {
      router.push("/home");
    } else {
      setError(loginError);
    }
  };

  const handleGoogleLogin = async () => {
    const { error: googleError } = await googleSignIn();
    if (!googleError) {
      router.push("/home");
    } else {
      setError(googleError);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent py-12 px-4">
      <div className="max-w-md w-full bg-[#fdfcf7] p-10 rounded-lg shadow-[4px_4px_0px_rgba(28,46,28,0.1)] border border-stone-300">
        <h2 className="text-3xl font-serif font-bold text-emerald-900 text-center mb-2">Sign in to your Ledger</h2>
        <p className="text-stone-500 text-sm text-center mb-8 italic font-serif">Return to your personal archive.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-900/5 text-red-700 text-xs rounded border border-red-200/50 text-center font-serif italic">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <FormInput 
            type="email" 
            placeholder="Email Address" 
            value={credentials.email} 
            onChange={(e) => handleChange(e, "email")} 
          />
          <FormInput 
            type="password" 
            placeholder="Password" 
            value={credentials.password} 
            onChange={(e) => handleChange(e, "password")} 
          />
          
          <button className="w-full bg-emerald-900 text-white font-serif tracking-widest uppercase text-xs py-4 rounded hover:bg-emerald-800 transition-all shadow-md">
            Enter Library
          </button>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <hr className="border-stone-300/40" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fdfcf7] px-4 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">Or</span>
          </div>

          <GoogleButton onClick={handleGoogleLogin} text="Continue with Google" />
        </form>

        <div className="mt-8 pt-6 border-t border-stone-200 text-center">
          <p className="text-stone-600 text-sm font-serif">
            New to the archives?{" "}
            <Link href="/register" className="text-emerald-900 font-bold hover:underline">Start your account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}