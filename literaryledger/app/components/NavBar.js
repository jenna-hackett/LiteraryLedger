"use client";
import Link from "next/link";
import { useUserAuth } from "../contexts/AuthContext";

export default function NavBar() {

  const { user, loading } = useUserAuth() || {};

  const logoHref = (!loading && user) ? "/home" : "/";
  
  return (
    <nav className="flex items-center justify-center py-8 bg-stone-50 border-b border-stone-200 shadow-sm">
      <Link href={logoHref} className="group text-center">
        <h1 className="text-3xl font-serif font-bold text-emerald-900 tracking-tight transition group-hover:text-emerald-700">
          The <span className="italic text-emerald-800">Literary</span> Ledger
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold mt-1">
          Est. 2026 • Your Personal Archive
        </p>
      </Link>
    </nav>
  );
}