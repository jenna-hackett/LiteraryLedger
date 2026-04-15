"use client";
import { useUserAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile, getCircleActivity } from "../_services/dbActions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import BookCard from "../components/BookCard";
import EmptyShelf from "../components/EmptyShelf";

export default function Home() {
  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();

  // --- States ---
  const [profileData, setProfileData] = useState(null);
  const [circleActivity, setCircleActivity] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    photoURL: ""
  });

  // --- Profile Actions ---
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const result = await updateUserProfile(user.uid, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        bio: editData.bio,
        photoURL: editData.photoURL
      });

      if (result.success) {
        setIsEditing(false);
        window.location.reload();
      } else {
        alert("The archive failed to save: " + result.error);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
    setSaving(false);
  };

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
          const data = docSnap.data();
          setProfileData(data);
          setEditData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            bio: data.bio || "",
            photoURL: data.photoURL || ""
          });
        }
        setDbLoading(false);
      }
    }
    if (!authLoading && user) fetchProfile();
  }, [user, authLoading]);

  // --- Journalist: Fetch Social Feed Activity ---
  useEffect(() => {
    async function loadActivity() {
      if (profileData?.following?.length > 0) {
        const activity = await getCircleActivity(profileData.following);
        setCircleActivity(activity);
      }
    }
    if (profileData) loadActivity();
  }, [profileData]);

  // --- Archive & Social Logic Calculations ---
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

        {/* --- PROFILE SECTION --- */}
        <header className="mb-16 bg-[#fdfcf7] border border-stone-300 rounded-lg p-8 shadow-[4px_4px_0px_rgba(28,46,28,0.1)]">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 rounded-full border-4 border-stone-200 overflow-hidden bg-emerald-900/5 flex items-center justify-center shadow-inner">
                {profileData?.photoURL ? (
                  <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-serif font-bold text-emerald-900 uppercase">
                    {profileData?.firstName ? profileData.firstName[0] : (user?.displayName ? user.displayName[0] : "S")}
                  </span>
                )}
              </div>

              <div className="flex-grow text-center md:text-left">
                <h1 className="text-4xl font-serif font-bold text-emerald-900 mb-2">
                  {profileData?.firstName 
                    ? `${profileData.firstName} ${profileData.lastName}` 
                    : (user?.displayName || "Anonymous Scribe")}
                </h1>
                <p className="text-stone-500 font-serif italic text-sm mb-4">
                  Member since {new Date().getFullYear()} • Curator of {totalVolumes} Finished Volumes
                </p>
                <div className="max-w-xl">
                  <p className="text-stone-700 font-serif leading-relaxed italic">
                    &quot;{profileData?.bio || "This scribe has not yet inked their biography."}&quot;
                  </p>
                </div>
              </div>

              <div className="hidden lg:block border-l border-stone-200 pl-10">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 border border-emerald-900/30 text-emerald-900 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-900 hover:text-white transition-all"
                >
                  Update Profile
                </button>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-emerald-900 font-bold border-b border-stone-200 pb-2">Update Your Entry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">First Name</label>
                  <input 
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="w-full p-3 rounded border border-stone-300 bg-stone-800/5 font-serif outline-none focus:border-emerald-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Last Name</label>
                  <input 
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    className="w-full p-3 rounded border border-stone-300 bg-stone-800/5 font-serif outline-none focus:border-emerald-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Portrait URL</label>
                <input 
                  type="text"
                  value={editData.photoURL}
                  onChange={(e) => setEditData({...editData, photoURL: e.target.value})}
                  className="w-full p-3 rounded border border-stone-300 bg-stone-800/5 font-serif outline-none focus:border-emerald-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Scribe Biography</label>
                <textarea 
                  rows="3"
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  className="w-full p-3 rounded border border-stone-300 bg-stone-800/5 font-serif outline-none focus:border-emerald-800"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-stone-500 font-serif italic hover:text-stone-800 transition-colors">Discard</button>
                <button onClick={handleSaveProfile} disabled={saving} className="px-8 py-2 bg-emerald-900 text-white font-serif uppercase text-xs tracking-widest rounded shadow-md transition-all">
                  {saving ? "Inking..." : "Save to Archive"}
                </button>
              </div>
            </div>
          )}
        </header>

        {/* --- MAIN CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="lg:col-span-1 space-y-16">
            {/* CURRENTLY READING */}
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

            {/* FUTURE VOLUMES */}
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

            {/* COMPLETED ARCHIVES */}
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

          {/* SIDEBAR - Prominent Social Feed */}
          <aside className="space-y-12">
            {/* STATS */}
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

            {/* SOCIAL FEED */}
            <section className="bg-[#fdfcf7] p-8 rounded-xl border border-stone-300 shadow-[6px_6px_0px_rgba(28,46,28,0.05)]">
              <h3 className="text-sm uppercase tracking-[0.4em] text-stone-400 font-bold mb-8">
                Recent Scribe Activity
              </h3>
              
              {circleActivity.length > 0 ? (
                <div className="space-y-10">
                  {circleActivity.map((activity, index) => (
                    <div key={index} className="flex gap-5 border-b border-stone-100 pb-8 last:border-0 items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-900/10 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-stone-200 shadow-sm">
                        {activity.scribePhoto ? (
                          <img src={activity.scribePhoto} className="w-full h-full object-cover" alt="Scribe" />
                        ) : (
                          <span className="text-lg font-bold text-emerald-900">{activity.scribeName[0]}</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-serif leading-relaxed text-stone-800">
                          <span className="font-bold text-emerald-900 hover:underline cursor-pointer">
                            {activity.scribeName}
                          </span> 
                          <span className="text-stone-500"> recently marked </span>
                          <span className="italic font-medium">&quot;{activity.title}&quot;</span>
                          <span className="text-stone-500"> as </span>
                          <span className="inline-block px-2 py-0.5 bg-emerald-900/5 text-emerald-800 font-bold rounded text-xs uppercase tracking-tighter">
                            {activity.status.replace(/-/g, ' ')}
                          </span>
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-stone-400 uppercase tracking-[0.1em] font-bold">
                            {new Date(activity.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                          </span>
                          <span className="text-stone-300 text-xs">•</span>
                          <Link href={`/book/${activity.id}`} className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-widest transition-colors">
                            View Volume
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-stone-400 font-serif italic mb-6">Your circle is quiet. The archives are still.</p>
                  <Link href="/search" className="text-[10px] bg-stone-100 px-4 py-2 rounded text-stone-600 uppercase tracking-widest font-bold hover:bg-emerald-900 hover:text-white transition-all">
                    Find More Scribes
                  </Link>
                </div>
              )}
            </section>
          </aside>

        </div>
      </div>
    </div>
  );
}