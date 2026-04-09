"use client";
import { useState } from "react";
import { searchBooks } from "../_services/openLibrary";
import { searchUsers } from "../_services/dbActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState("books"); 
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    
    if (searchMode === "books") {
      const data = await searchBooks(query);
      setResults(data);
    } else {
      const data = await searchUsers(query);
      setResults(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Tab Switcher */}
        <div className="flex justify-center mb-8 gap-4">
          <button 
            onClick={() => { setSearchMode("books"); setResults([]); }}
            className={`px-6 py-2 rounded-full font-serif transition ${searchMode === 'books' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'}`}
          >
            Find Books
          </button>
          <button 
            onClick={() => { setSearchMode("readers"); setResults([]); }}
            className={`px-6 py-2 rounded-full font-serif transition ${searchMode === 'readers' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'}`}
          >
            Find Readers
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12 relative">
          <input 
            type="text"
            placeholder={searchMode === 'books' ? "Search titles, authors..." : "Search by email or name..."}
            className="w-full p-5 pl-8 rounded-2xl border-2 border-stone-200 focus:border-emerald-800 outline-none shadow-sm font-serif text-stone-900 placeholder-stone-500 bg-white"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-900 text-white px-6 py-2 rounded-xl">
            Search
          </button>
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <p className="col-span-full text-center italic text-stone-400">Consulting the archives...</p>
          ) : (
            results.map((item) => (
              <div 
                key={item.bookId || item.id} 
                className="group flex flex-col bg-white p-5 rounded-2xl border border-stone-100 shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {searchMode === 'books' ? (
                  <>
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-stone-100 flex items-center justify-center">
                      {item.coverUrl ? (
                        <img 
                          src={item.coverUrl} 
                          alt={item.title}
                          className="w-full h-full object-contain shadow-sm" 
                        />
                      ) : (
                        <div className="text-xs text-stone-400 font-serif italic">No Cover Found</div>
                      )}
                    </div>
                    
                    <div className="text-left px-1 flex-grow">
                      <h3 className="font-serif font-bold text-emerald-900 text-lg leading-tight line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-stone-500 italic text-sm">
                        {item.author}
                      </p>
                    </div>
                    
                    <Link 
                      href={`/book/${item.bookId}`} 
                      className="mt-4 w-full py-2 bg-stone-50 hover:bg-emerald-50 text-emerald-800 text-xs uppercase tracking-widest font-bold rounded-lg border border-stone-200 transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </>
                ) : (
                  /* Reader cards logic */
                  <div className="py-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-2xl uppercase shadow-inner">
                      {item.firstName ? item.firstName[0] : "?"}
                    </div>
                    <h3 className="font-serif font-bold text-emerald-900 text-xl">
                      {item.firstName} {item.lastName}
                    </h3>
                    <button className="mt-4 px-6 py-2 bg-emerald-800 text-white text-xs uppercase tracking-widest font-bold rounded-full hover:bg-emerald-900 transition-all">
                      Add Friend +
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}