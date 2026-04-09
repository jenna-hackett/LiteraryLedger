"use client";
import { useUserAuth } from "../contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useUserAuth();

  return (
  <div className="min-h-screen bg-transparent py-12 px-6">
    <div className="max-w-6xl mx-auto">

      {/* --- PROFILE SECTION --- */}
      <header className="mb-16 bg-[#fdfcf7] border border-stone-300 rounded-lg p-8 shadow-[4px_4px_0px_rgba(28,46,28,0.1)] flex flex-col md:flex-row items-center gap-10">
        
        {/* Profile Photo */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-stone-200 overflow-hidden bg-emerald-900/5 flex items-center justify-center shadow-inner">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-serif font-bold text-emerald-900 uppercase">
                {user?.displayName ? user.displayName[0] : "S"}
              </span>
            )}
          </div>
          <button className="absolute bottom-1 right-1 bg-stone-100 border border-stone-300 p-1.5 rounded-full hover:bg-white transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-600">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* User Details */}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-serif font-bold text-emerald-900 mb-2">
            {user?.displayName || "Anonymous Scholar"}
          </h1>
          <p className="text-stone-500 font-serif italic text-sm mb-4">
            Member since {new Date().getFullYear()} • Curator of {user?.ledgerCount || 0} Volumes
          </p>
          <div className="max-w-xl">
            <p className="text-stone-700 font-serif leading-relaxed">
              {user?.bio || "This scholar has not yet inked their biography. A lover of quiet libraries and the scent of old paper."}
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="hidden lg:block border-l border-stone-200 pl-10">
          <button className="px-6 py-2 border border-emerald-900/30 text-emerald-900 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-900 hover:text-white transition-all">
            Update Profile
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Bookshelves */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6 border-b border-stone-200 pb-2">
              Currently Scribing
            </h3>
            <div className="bg-[#fdfcf7] border border-stone-300 border-dashed p-12 rounded-lg text-center shadow-sm">
              <p className="text-stone-400 font-serif italic mb-4">The desk is currently empty.</p>
              <Link href="/search" className="inline-block px-6 py-2 bg-emerald-900 text-white text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-800 transition-all">
                Search the Stacks
              </Link>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <aside className="space-y-10">
          {/* Stats Section */}
          <section className="bg-stone-800/5 p-6 rounded-lg border border-stone-300/40">
            <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-900 font-bold mb-4">
              Ledger Stats
            </h3>
            <div className="space-y-4 font-serif text-sm">
              <div className="flex justify-between border-b border-stone-300/30 pb-2">
                <span className="text-stone-600">Total Volumes</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between border-b border-stone-300/30 pb-2">
                <span className="text-stone-600">Active Friends</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </section>

          {/* Social Activity Section */}
          <section className="bg-[#fdfcf7] p-6 rounded-lg border border-stone-300 shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6">
              Recent Scribe Activity
            </h3>
            <p className="text-[11px] text-stone-400 italic font-serif mt-4 border-t border-stone-100 pt-4">
              Visit the <Link href="/search" className="text-emerald-800 hover:underline">Stacks</Link> to find other readers.
            </p>
          </section>
        </aside>

      </div>
    </div>
  </div>
);
}