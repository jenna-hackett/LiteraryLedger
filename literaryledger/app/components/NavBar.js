"use client";
import Link from "next/link";
import { useUserAuth } from "../contexts/AuthContext";
import { usePathname } from "next/navigation"; 

export default function NavBar() {
  const { user, logout, loading } = useUserAuth() || {};
  const pathname = usePathname();

  const logoHref = (!loading && user) ? "/home" : "/";
  
  const navLinks = [
    { name: "Your Archive", href: "/home" },
    { name: "Search Stacks", href: "/search" },
  ];

  return (
    <nav className="bg-[#fdfcf7] border-b border-stone-300/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo Section */}
        <Link href={logoHref} className="group text-center md:text-left">
          <h1 className="text-3xl font-serif font-bold text-emerald-900 tracking-tighter transition group-hover:text-emerald-700">
            The <span className="italic text-emerald-800">Literary</span> Ledger
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold mt-1">
            Est. 2026 • Your Personal Archive
          </p>
        </Link>

        {/* Navigation Links */}
        {!loading && user && (
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-serif text-sm tracking-widest uppercase transition-colors ${
                  pathname === link.href 
                    ? "text-emerald-900 font-bold border-b-2 border-emerald-900 pb-1" 
                    : "text-stone-500 hover:text-emerald-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="ml-4 px-4 py-1.5 border border-stone-300 text-stone-500 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}