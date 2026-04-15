"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookDetails } from "../../_services/openLibrary";
import { updateBookStatus } from "../../_services/dbActions"; // Updated import
import { useUserAuth } from "../../contexts/AuthContext";

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUserAuth();
  const [isAdding, setIsAdding] = useState(false);

  // Handler for updating status (Read, Reading, Want to Read)
  const handleStatusUpdate = async (selectedStatus) => {
    if (!user) {
      alert("You must be logged in to save books!");
      return;
    }

    setIsAdding(true);
    
    // Formatting the data for Firestore
    const bookToSave = {
      id: id,
      volumeInfo: {
        title: book.title,
        authors: book.authors || ["Unknown Author"],
        imageLinks: { thumbnail: book.coverUrl || "" }
      }
    };

    const result = await updateBookStatus(user.uid, bookToSave, selectedStatus);
    
    if (result.success) {
      alert(`"${book.title}" is now marked as ${selectedStatus.replace(/-/g, ' ')} in your archive!`);
    } else {
      alert("The librarian encountered an error: " + result.error);
    }
    setIsAdding(false);
  };

  useEffect(() => {
    async function loadBook() {
      const details = await getBookDetails(id);
      setBook(details);
      setLoading(false);
    }
    loadBook();
  }, [id]);

  if (loading) return <div className="p-20 text-center italic text-stone-500">Unlocking the ledger...</div>;
  if (!book) return <div className="p-20 text-center">Book not found in the ledger.</div>;

  return (
    <div className="min-h-screen bg-transparent">
      
      <nav className="p-6">
        <button 
          onClick={() => router.back()} 
          className="text-stone-500 hover:text-emerald-900 font-serif italic text-sm transition-colors"
        >
          ← Back to Search
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          {/* Left Side: Cover Image & Status Actions */}
          <div className="w-full md:w-1/3 sticky top-10 flex flex-col gap-6">
            <div className="bg-stone-800/5 p-1 rounded-sm shadow-sm">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-auto object-contain shadow-md" 
                />
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center bg-stone-800/5 text-stone-500 font-serif italic border border-stone-300/30">
                  Image Missing
                </div>
              )}
            </div>
            
            {/* Categorized Buttons */}
            <div className="flex flex-col gap-3 w-full">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Update Ledger Status</p>
              
              <button 
                onClick={() => handleStatusUpdate('want-to-read')}
                disabled={isAdding}
                className="w-full py-3 border border-emerald-900/30 text-emerald-900 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-900 hover:text-white transition-all disabled:opacity-50"
              >
                Want to Read
              </button>

              <button 
                onClick={() => handleStatusUpdate('reading')}
                disabled={isAdding}
                className="w-full py-3 bg-stone-200 text-stone-800 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-stone-300 transition-all disabled:opacity-50"
              >
                Currently Reading
              </button>

              <button 
                onClick={() => handleStatusUpdate('read')}
                disabled={isAdding}
                className="w-full py-4 bg-emerald-900 text-white text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-800 transition-all shadow-md disabled:opacity-50"
              >
                {isAdding ? "Updating Archive..." : "Mark as Finished"}
              </button>
            </div>
          </div>

          {/* Right Side: Description */}
          <div className="w-full md:w-2/3 border-l border-stone-300/60 pl-0 md:pl-16">
            <header className="mb-10">
              <h1 className="text-5xl font-serif font-bold text-emerald-900 mb-2 leading-tight">
                {book.title}
              </h1>
              <p className="text-stone-700 italic font-serif text-xl mb-1">
                {book.authors?.join(", ")}
              </p>
              <p className="text-stone-400 italic font-serif text-sm">Official Ledger Record</p>
            </header>

            <section className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-6 border-b border-stone-300/60 pb-2">
                Synopsis
              </h3>
              <p className="text-stone-800 leading-relaxed font-serif text-lg whitespace-pre-line">
                {book.description || "No synopsis available for this volume in the ledger archives."}
              </p>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}