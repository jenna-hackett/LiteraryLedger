"use client";
import Link from "next/link";
import { useUserAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, loading } = useUserAuth() || {};

  const logoHref = (!loading && user) ? "/home" : "/";
  
  return (
    <nav className="flex items-center justify-center py-10 bg-[#fdfcf7] border-b border-stone-300/60 shadow-sm">
      <Link href={logoHref} className="group text-center">
        <h1 className="text-4xl font-serif font-bold text-emerald-900 tracking-tighter transition group-hover:text-emerald-700">
          The <span className="italic text-emerald-800">Literary</span> Ledger
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold mt-2">
          Est. 2026 • Your Personal Archive
        </p>
      </Link>
    </nav>
  );
}