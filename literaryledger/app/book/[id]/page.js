"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookDetails } from "../../_services/openLibrary";
import { useRouter } from "next/navigation";

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadBook() {
      const details = await getBookDetails(id);
      setBook(details);
      setLoading(false);
    }
    loadBook();
  }, [id]);

  if (loading) return <div className="p-20 text-center italic text-stone-500">Unlocking the vault...</div>;
  if (!book) return <div className="p-20 text-center">Book not found.</div>;

  return (
  <div className="min-h-screen bg-stone-50">
    {/* Back to Search Navigation */}
    <nav className="p-6">
      <button 
        onClick={() => router.back()} // This now goes back to /search?q=harry+potter
        className="text-stone-400 hover:text-emerald-900 font-serif italic text-sm transition-colors"
      >
        ← Back to Search Results
      </button>
    </nav>

    <main className="max-w-6xl mx-auto px-6 pb-20">
      <div className="flex flex-col md:flex-row gap-16 items-start">
        
        {/* Left Side: Cover Image */}
        <div className="w-full md:w-1/3 sticky top-10">
          <div className="bg-stone-200 p-1 rounded-sm shadow-sm">
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="aspect-[3/4] flex items-center justify-center bg-stone-100 text-stone-400 font-serif italic">
                Image Missing
              </div>
            )}
          </div>
          
          <button className="mt-8 w-full py-4 bg-emerald-900 text-white font-serif tracking-widest uppercase text-xs hover:bg-emerald-800 transition-all shadow-md">
            Add to My Ledger
          </button>
        </div>

        {/* Right Side: Description */}
        <div className="w-full md:w-2/3 border-l border-stone-200 pl-0 md:pl-16">
          <header className="mb-10">
            <h1 className="text-5xl font-serif font-bold text-emerald-900 mb-2 leading-tight">
              {book.title}
            </h1>
          </header>

          <section className="mb-12">
            <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-6 border-b border-stone-100 pb-2">
              Synopsis
            </h3>
            <p className="text-stone-800 leading-relaxed font-serif text-lg whitespace-pre-line">
              {book.description}
            </p>
          </section>
        </div>

      </div>
    </main>
  </div>
);
}