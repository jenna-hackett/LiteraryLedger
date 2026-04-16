"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import ScribeAvatar from "../../components/ScribeAvatar";
import BookCard from "../../components/BookCard";

export default function ScribeProfilePage() {
  const { id } = useParams();
  const [scribeData, setScribeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchScribe() {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setScribeData(docSnap.data());
      }
      setLoading(false);
    }
    fetchScribe();
  }, [id]);

  if (loading) return <div className="p-20 text-center italic text-stone-500 font-serif">Opening the Scribe&apos;s Ledger...</div>;
  if (!scribeData) return <div className="p-20 text-center font-serif">Scribe not found in the archives.</div>;

  const library = scribeData.library ? Object.values(scribeData.library) : [];
  
  // All finished books for the shelf
  const finished = library.filter(b => b.status === 'read' || b.status === 'reviewed');
  
  const reviewedBooks = library
    .filter(b => b.status === 'reviewed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="min-h-screen bg-transparent py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={() => router.back()}
          className="mb-8 text-stone-500 hover:text-emerald-900 font-serif italic text-sm transition-colors"
        >
          ← Return to Library
        </button>

        {/* --- SCRIBE HEADER --- */}
        <div className="bg-[#fdfcf7] p-10 rounded-2xl border border-stone-300 shadow-[8px_8px_0px_rgba(28,46,28,0.05)] mb-16 flex flex-col md:flex-row items-center gap-8">
          <ScribeAvatar photoURL={scribeData.photoURL} name={scribeData.firstName} size="large" />
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl font-serif font-bold text-emerald-900 mb-2">
              {scribeData.firstName} {scribeData.lastName}
            </h1>          
            <p className="text-stone-700 max-w-lg leading-relaxed font-serif">
              {scribeData.bio || "This scribe has not yet inked a bio into their profile."}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-xl border border-stone-200 text-center">
              <span className="block text-2xl font-bold text-emerald-900">{reviewedBooks.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Reviews</span>
            </div>
            <div className="bg-white px-6 py-4 rounded-xl border border-stone-200 text-center">
              <span className="block text-2xl font-bold text-emerald-900">{finished.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Volumes</span>
            </div>
          </div>
        </div>

        {/* --- RECENT REVIEWS SECTION --- */}
        {reviewedBooks.length > 0 && (
          <section className="mb-16">
            <h3 className="text-xs uppercase tracking-[0.4em] text-emerald-900 font-bold mb-8 border-b border-stone-200 pb-2">
              {scribeData.firstName}&apos;s Recent Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviewedBooks.slice(0, 4).map((book) => (
                <div key={book.id} className="bg-white p-8 rounded-xl border border-stone-300 shadow-[6px_6px_0px_rgba(6,78,59,0.04)] relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-900/5 -rotate-45 translate-x-6 -translate-y-6" />

                  <h4 className="font-serif font-bold text-stone-800 text-xl leading-tight mb-3 pr-6">
                    {book.title}
                  </h4>
                  
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: book.rating || 0 }).map((_, i) => (
                      <span key={i} className="text-xl drop-shadow-sm">📜</span>
                    ))}
                  </div>
                  
                  <div className="bg-stone-800/5 p-4 rounded-lg border border-stone-200/60 flex-grow">
                    <p className="font-serif italic text-stone-700 leading-relaxed line-clamp-4">
                      &quot;{book.reviewText}&quot;
                    </p>
                  </div>
                  
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-6">
                    Inked on {new Date(book.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- SCRIBE'S COMPLETED VOLUMES --- */}
        <section>
          <h3 className="text-xs uppercase tracking-[0.4em] text-stone-400 font-bold mb-8 border-b border-stone-200 pb-2">
            {scribeData.firstName}&apos;s Completed Volumes
          </h3>
          {finished.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {finished.map((book) => (
                <BookCard key={book.id} book={book} small />
              ))}
            </div>
          ) : (
            <p className="text-stone-400 font-serif italic text-center py-10">This scribe&apos;s finished archives are currently empty.</p>
          )}
        </section>

      </div>
    </div>
  );
}