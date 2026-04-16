"use client";
import { useUserAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

// --- Components ---
import BookCard from "../components/BookCard";
import EmptyShelf from "../components/EmptyShelf";
import ProfileHeader from "./ProfileHeader";
import SocialFeed from "./SocialFeed";

export default function Home() {
  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();

  // --- States ---
  const [profileData, setProfileData] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);

  // --- Security Guard: Redirect if not logged in ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // --- Librarian: Fetch Personal Profile ---
  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
        setDbLoading(false);
      }
    }
    if (!authLoading && user) fetchProfile();
  }, [user, authLoading]);

  // --- Archive Calculations ---
  const libraryArray = profileData?.library ? Object.values(profileData.library) : [];
  
  const currentlyReading = libraryArray.filter(book => book.status === 'reading');
  const wantToRead = libraryArray.filter(book => book.status === 'want-to-read');
  const finishedBooks = libraryArray.filter(book => book.status === 'read');
  
  const totalVolumes = finishedBooks.length;
  const followingCount = profileData?.following?.length || 0;

  // --- Loading Guard ---
  if (authLoading || (user && dbLoading)) {
    return (
      <div className="p-20 text-center italic text-stone-500 font-serif">
        Consulting the Ledger...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* --- PROFILE HEADER --- */}
        <ProfileHeader 
          profileData={profileData} 
          user={user} 
          totalVolumes={totalVolumes} 
        />

        {/* --- MAIN CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT COLUMN: Archive Displays */}
          <div className="lg:col-span-1 space-y-16">
            
            <section>
              <h3 className="text-xs uppercase tracking-[0.3em] text-emerald-900 font-bold mb-6 border-b border-stone-200 pb-2">Currently Reading</h3>
              {currentlyReading.length > 0 ? (
                <div className="grid grid-cols-2 gap-8">
                  {currentlyReading.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
              ) : (
                <EmptyShelf message="Your desk is currently clear." />
              )}
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6 border-b border-stone-200 pb-2">Future Volumes</h3>
              {wantToRead.length > 0 ? (
                <div className="grid grid-cols-3 gap-6 opacity-80">
                  {wantToRead.map((book) => <BookCard key={book.id} book={book} small />)}
                </div>
              ) : (
                <p className="text-stone-400 font-serif italic text-sm">No future volumes added.</p>
              )}
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6 border-b border-stone-200 pb-2">Completed Volumes</h3>
              {finishedBooks.length > 0 ? (
                <div className="grid grid-cols-3 gap-6 grayscale-[0.5]">
                  {finishedBooks.map((book) => <BookCard key={book.id} book={book} small />)}
                </div>
              ) : (
                <p className="text-stone-400 font-serif italic text-sm">The completed archives are currently empty.</p>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <aside className="space-y-12">
            
            {/* STATS SECTION */}
            <section className="bg-[#fdfcf7] p-8 rounded-xl border border-stone-300 shadow-[4px_4px_0px_rgba(28,46,28,0.05)]">
              <h3 className="text-sm uppercase tracking-[0.4em] text-emerald-900 font-bold mb-8 border-b border-stone-100 pb-3">
                Archive Statistics
              </h3>
              <div className="space-y-6 font-serif text-lg">
                <div className="flex justify-between border-b border-stone-300/30 pb-3">
                  <span className="text-stone-600">Total Volumes</span>
                  <span className="font-bold text-emerald-900">{totalVolumes}</span>
                </div>
                <div className="flex justify-between border-b border-stone-300/30 pb-3">
                  <span className="text-stone-600">Scribes in Circle</span>
                  <span className="font-bold text-emerald-900">{followingCount}</span>
                </div>
              </div>
            </section>

            {/* --- SOCIAL FEED --- */}
            <SocialFeed profileData={profileData} />

          </aside>

        </div>
      </div>
    </div>
  );
}