"use client";
import { useUserAuth } from "../contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useUserAuth();

  return (
    <div className="min-h-screen bg-transparent py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Header */}
        <header className="mb-12 border-b border-stone-300/60 pb-8">
          <h1 className="text-4xl font-serif font-bold text-emerald-900">
            Welcome back, <span className="italic">{user?.displayName || "Scholar"}</span>.
          </h1>
          <p className="text-stone-500 font-serif italic mt-2">
            Your personal archive is ready for consultation.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Shelf */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6">
                Currently Reading
              </h3>
              {/* Empty State Card */}
              <div className="bg-[#fdfcf7] border border-stone-300 border-dashed p-12 rounded-lg text-center shadow-sm">
                <p className="text-stone-400 font-serif italic mb-4">No volumes currently on your desk.</p>
                <Link 
                  href="/search" 
                  className="inline-block px-6 py-2 bg-emerald-900 text-white text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-800 transition-all"
                >
                  Visit the Stacks (Search)
                </Link>
              </div>
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6">
                Recent Ledger Entries
              </h3>
              <div className="bg-[#fdfcf7] border border-stone-300 p-8 rounded-lg shadow-sm h-48 flex items-center justify-center">
                 <p className="text-stone-300 font-serif italic">Your recent history will appear here.</p>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="space-y-10">
            <section className="bg-stone-800/5 p-6 rounded-lg border border-stone-300/40">
              <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-900 font-bold mb-4">
                Ledger Stats
              </h3>
              <div className="space-y-4 font-serif">
                <div className="flex justify-between border-b border-stone-300/30 pb-2">
                  <span className="text-stone-600">Total Volumes:</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between border-b border-stone-300/30 pb-2">
                  <span className="text-stone-600">Friends:</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </section>

            <section className="bg-[#fdfcf7] p-6 rounded-lg border border-stone-300 shadow-sm">
              <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-4">
                Social Activity
              </h3>
              <p className="text-xs text-stone-500 italic">Find readers in the Search tab to see their updates here.</p>
            </section>
          </aside>

        </div>
      </div>
    </div>
  );
}