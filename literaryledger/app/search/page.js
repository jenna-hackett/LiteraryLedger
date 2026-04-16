"use client";
import { useState, useEffect } from "react";
import { searchBooks } from "../_services/openLibrary";
import { searchUsers, followUser } from "../_services/dbActions";
import { useUserAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import Link from "next/link";

export default function SearchPage() {
  const { user } = useUserAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState("books"); 
  const [loading, setLoading] = useState(false);
  
  // State to track who the current user already follows
  const [followingList, setFollowingList] = useState([]);

  // Fetch the user's following list when the page loads
  useEffect(() => {
    async function fetchUserFollowing() {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFollowingList(docSnap.data().following || []);
        }
      }
    }
    fetchUserFollowing();
  }, [user?.uid]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    
    if (searchMode === "books") {
      const data = await searchBooks(query);
      setResults(data);
    } else {
      const data = await searchUsers(query);
      // Filter out the current user so you don't find yourself in the archives
      setResults(data.filter(u => u.id !== user?.uid));
    }
    setLoading(false);
  };

  const handleFollowScribe = async (targetId, targetName) => {
    if (!user) {
      alert("You must be logged in to follow other scribes!");
      return;
    }

    const result = await followUser(user.uid, targetId);
    if (result.success) {
      setFollowingList([...followingList, targetId]);
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
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-900 text-white px-8 py-3 rounded-xl hover:bg-emerald-800 transition-colors shadow-md uppercase text-xs tracking-widest font-bold"
          >
            {loading ? "..." : "Search"}
          </button>
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <p className="col-span-full text-center italic text-stone-500 font-serif text-lg">Consulting the archives...</p>
          ) : (
            results.map((item) => {
              // Check if this specific user is already in our following list
              const isFollowing = searchMode === 'readers' && followingList.includes(item.id);

              return (
                <div 
                  key={item.bookId || item.id} 
                  className="group flex flex-col p-5 rounded-lg transition-all hover:-translate-y-1
                             bg-[#fdfcf7] border border-stone-300
                             shadow-[2px_2px_0px_rgba(28,46,28,0.05)]
                             hover:shadow-[4px_4px_0px_rgba(28,46,28,0.1)]"
                >
                  {searchMode === 'books' ? (
                    /* BOOK RESULT UI */
                    <>
                      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-stone-800/5 flex items-center justify-center border border-stone-200/50">
                        {item.coverUrl ? (
                          <img 
                            src={item.coverUrl} 
                            alt={item.title}
                            className="w-full h-full object-contain shadow-sm" 
                          />
                        ) : (
                          <div className="text-xs text-stone-400 font-serif italic uppercase tracking-tighter">No Cover Found</div>
                        )}
                      </div>
                      
                      <div className="text-left px-1 flex-grow">
                        <h3 className="font-serif font-bold text-emerald-900 text-lg leading-tight line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-stone-500 italic text-sm font-serif">
                          {item.author}
                        </p>
                      </div>
                      
                      <Link 
                        href={`/book/${item.bookId}`} 
                        className="mt-6 w-full py-2 bg-emerald-900/5 hover:bg-emerald-900 text-emerald-900 hover:text-white 
                                   text-xs uppercase tracking-[0.2em] font-bold rounded border border-emerald-900/20 
                                   transition-all text-center"
                      >
                        View Details
                      </Link>
                    </>
                  ) : (
                    /* READER RESULT UI */
                    <div className="py-8 text-center flex flex-col h-full">
                      <div className="w-20 h-20 bg-emerald-900/10 text-emerald-900 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-2xl uppercase border border-emerald-900/20 shadow-inner overflow-hidden">
                        {item.photoURL ? (
                          <img src={item.photoURL} alt={item.firstName} className="w-full h-full object-cover" />
                        ) : (
                          item.firstName ? item.firstName[0] : "?"
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-serif font-bold text-emerald-900 text-xl">
                          {item.firstName} {item.lastName}
                        </h3>
                        <p className="text-stone-500 text-xs italic font-serif mt-1">{item.email}</p>
                      </div>

                      {/* Button Logic */}
                      <button 
                        onClick={() => handleFollowScribe(item.id, item.firstName)}
                        disabled={isFollowing}
                        className={`mt-6 px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full transition-all shadow-md ${
                          isFollowing 
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300' 
                            : 'bg-emerald-900 text-white hover:bg-emerald-800 active:scale-95'
                        }`}
                      >
                        {isFollowing ? "Following ✓" : "Follow Scribe +"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
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