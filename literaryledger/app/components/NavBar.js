"use client";
import Link from "next/link";
import { useUserAuth } from "@/app/contexts/AuthContext";

export default function NavBar() {
  const { user, logout } = useUserAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-10 py-6 bg-stone-50 border-b border-stone-200 shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center">
        <Link href="/" className="group">
          <h1 className="text-2xl font-serif font-bold text-emerald-900 tracking-tight transition group-hover:text-emerald-700">
            The <span className="italic text-emerald-800">Literary</span> Ledger
          </h1>
        </Link>
      </div>

      {/* Navigation Links - Sage and Forest tones */}
      <ul className="hidden md:flex items-center gap-10 font-medium text-stone-600">
        <li>
          <Link href="/" className="hover:text-emerald-800 transition-colors underline-offset-4 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/search" className="hover:text-emerald-800 transition-colors underline-offset-4 hover:underline">
            Search
          </Link>
        </li>
        {user && (
          <li>
            <Link href="/profile" className="hover:text-emerald-800 transition-colors underline-offset-4 hover:underline">
              My Bookshelf
            </Link>
          </li>
        )}
      </ul>

      {/* Auth Section - Pine Green buttons */}
      <div className="flex items-center gap-5">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-widest">Reader</span>
              <span className="text-sm text-emerald-900 font-bold">{user.displayName || "Member"}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-5 py-2 text-sm font-semibold text-stone-100 bg-emerald-900 rounded-full hover:bg-emerald-800 transition-all shadow-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-stone-600 hover:text-emerald-900 transition">
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 text-sm font-semibold text-stone-50 bg-emerald-800 rounded-full hover:bg-emerald-900 transition-all shadow-md"
            >
              Join the Ledger
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}