"use client";
import { useState } from "react";
import { searchBooks } from "../_services/openLibrary";
import { searchUsers, followUser } from "../_services/dbActions";
import { useUserAuth } from "../contexts/AuthContext";
import SearchCard from "../components/SearchCard";

export default function SearchPage() {
  const { user } = useUserAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState("books"); 
  const [loading, setLoading] = useState(false);

  // --- Search Logic ---
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    
    if (searchMode === "books") {
      const data = await searchBooks(query);
      setResults(data);
    } else {
      const data = await searchUsers(query);
      // Filter out the current user so you don't follow yourself
      setResults(data.filter(u => u.id !== user?.uid));
    }
    setLoading(false);
  };

  // --- Follow Action ---
  const handleFollowScribe = async (targetId, targetName) => {
    if (!user) {
      alert("You must be logged in to follow other scribes!");
      return;
    }

    const result = await followUser(user.uid, targetId);
    if (result.success) {
      alert(`${targetName} has been added to your circle of scribes.`);
    } else {
      alert("The archive failed to update: " + result.error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-transparent">
      <div className="max-w-4xl mx-auto">
        
        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 gap-4">
          <button 
            onClick={() => { setSearchMode("books"); setResults([]); }}
            className={`px-8 py-2 rounded-full font-serif transition border-2 ${
              searchMode === 'books' 
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-md' 
                : 'bg-[#fdfcf7] border-stone-300 text-stone-600 hover:border-emerald-800 shadow-sm'
            }`}
          >
            Find Books
          </button>
          <button 
            onClick={() => { setSearchMode("readers"); setResults([]); }}
            className={`px-8 py-2 rounded-full font-serif transition border-2 ${
              searchMode === 'readers' 
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-md' 
                : 'bg-[#fdfcf7] border-stone-300 text-stone-600 hover:border-emerald-800 shadow-sm'
            }`}
          >
            Find Scribes
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-16 relative">
          <input 
            type="text"
            placeholder={searchMode === 'books' ? "Search titles, authors..." : "Search by email or name..."}
            className="w-full p-6 pl-8 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-800 outline-none font-serif text-lg
                       text-stone-900 placeholder-stone-400 bg-[#fdfcf7] 
                       shadow-[4px_4px_0px_rgba(28,46,28,0.07)] transition-all"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-900 text-white px-8 py-3 rounded-xl hover:bg-emerald-800 transition-colors shadow-md uppercase text-xs tracking-widest font-bold disabled:opacity-50"
          >
            {loading ? "..." : "Search"}
          </button>
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <p className="col-span-full text-center italic text-stone-500 font-serif text-lg">Consulting the archives...</p>
          ) : (
            results.map((item) => (
              <SearchCard 
                key={item.bookId || item.id} 
                item={item} 
                mode={searchMode} 
                onFollow={handleFollowScribe} 
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <p className="text-center text-stone-400 font-serif italic mt-10">
            No entries found in the Ledger matching your search.
          </p>
        )}
      </div>
    </div>
  );
}