"use client";
import { useState } from "react";
import { useUserAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "../components/FormInput";

export default function RegisterPage() {
  const { signUp } = useUserAuth();
  const router = useRouter();

  // --- Combined State ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to update state
  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    const nameRegex = /^[A-Za-z\s-]+$/;
    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
      return setError("Names must only contain letters, spaces, or hyphens.");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    const { error: signUpError } = await signUp(
      formData.email, 
      formData.password, 
      formData.firstName, 
      formData.lastName
    );
    
    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      router.push("/"); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4">
      <div className="max-w-md w-full bg-[#fdfcf7] p-10 rounded-lg shadow-[4px_4px_0px_rgba(28,46,28,0.1)] border border-stone-300">
        <h2 className="text-3xl font-serif font-bold text-emerald-900 text-center mb-2">Join the Ledger</h2>
        <p className="text-stone-500 text-sm text-center mb-8 italic font-serif">
          Scribe your name to begin your personal archive.
        </p>

        {error && (
          <p className="mb-4 p-3 bg-red-900/5 text-red-700 text-xs rounded border border-red-200/50 text-center font-serif italic">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              placeholder="First Name" 
              value={formData.firstName} 
              onChange={(e) => handleChange(e, 'firstName')} 
            />
            <FormInput 
              placeholder="Last Name" 
              value={formData.lastName} 
              onChange={(e) => handleChange(e, 'lastName')} 
            />
          </div>
          
          <FormInput 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={(e) => handleChange(e, 'email')} 
          />
          <FormInput 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={(e) => handleChange(e, 'password')} 
          />
          <FormInput 
            type="password" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword} 
            onChange={(e) => handleChange(e, 'confirmPassword')} 
          />

          <button 
            disabled={loading}
            className={`w-full font-serif tracking-widest uppercase text-xs py-4 rounded transition-all shadow-md mt-2 ${
              loading ? "bg-stone-300 cursor-not-allowed text-stone-500" : "bg-emerald-900 text-white hover:bg-emerald-800"
            }`}
          >
              {loading ? "Scribing your entry..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-200 text-center">
          <p className="text-stone-600 text-sm font-serif">
            Already have an account? <Link href="/" className="text-emerald-900 font-bold hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}