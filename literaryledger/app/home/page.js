"use client";
import { useUserAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "../_services/dbActions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function Home() {
  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();

  // States
  const [profileData, setProfileData] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
  firstName: "",
  lastName: "",
  bio: "",
  photoURL: ""
});

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
        // Refresh to show the Librarian the new data
        window.location.reload(); 
      } else {
        alert("The archive failed to save: " + result.error);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
    setSaving(false);
  };

  // Security Guard: If auth state is done loading and there's no user, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Librarian: Fetch the user's profile data from Firestore when they log in
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

  if (authLoading || (user && dbLoading)) {
    return <div className="p-20 text-center italic text-stone-500 font-serif">Consulting the Ledger...</div>;
  }

  if (!user) return null;

  return (
  <div className="min-h-screen bg-transparent py-12 px-6">
    <div className="max-w-6xl mx-auto">

      {/* --- DYNAMIC PROFILE SECTION --- */}
      <header className="mb-16 bg-[#fdfcf7] border border-stone-300 rounded-lg p-8 shadow-[4px_4px_0px_rgba(28,46,28,0.1)]">
        {!isEditing ? (
          /* VIEW MODE: Drawing from profileData */
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
                Member since {new Date().getFullYear()} • Curator of {user?.ledgerCount || 0} Volumes
              </p>
              <div className="max-w-xl">
                <p className="text-stone-700 font-serif leading-relaxed italic">
                  &quot;{profileData?.bio || "This scribe has not yet inked their biography. A lover of quiet libraries and the scent of old paper."}&quot;
                </p>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-4 text-[10px] uppercase tracking-widest font-bold text-emerald-800 lg:hidden"
              >
                Edit Profile
              </button>
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
          /* EDIT MODE: URL Method Version */
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

            {/* PORTRAIT URL INPUT */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Portrait URL (Image Link)</label>
              <input 
                type="text"
                value={editData.photoURL}
                onChange={(e) => setEditData({...editData, photoURL: e.target.value})}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full p-3 rounded border border-stone-300 bg-stone-800/5 font-serif outline-none focus:border-emerald-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Scribe&apos;s Biography</label>
              <textarea 
                rows="3"
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                className="w-full p-3 rounded border border-stone-300 bg-stone-800/5 font-serif outline-none focus:border-emerald-800"
                placeholder="Tell other scribes about your literary tastes, favorite genres, or the last great book you read."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 text-stone-500 font-serif italic hover:text-stone-800 transition-colors"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-8 py-2 bg-emerald-900 text-white font-serif uppercase text-xs tracking-widest rounded hover:bg-emerald-800 shadow-md transition-all"
              >
                {saving ? "Inking..." : "Save to Ledger"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Bookshelf */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6 border-b border-stone-200 pb-2">
              Currently Reading
            </h3>
            <div className="bg-[#fdfcf7] border border-stone-300 border-dashed p-12 rounded-lg text-center shadow-sm">
              <p className="text-stone-400 font-serif italic mb-4">The shelf is currently empty.</p>
              <Link href="/search" className="inline-block px-6 py-2 bg-emerald-900 text-white text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-800 transition-all">
                Search the Stacks
              </Link>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <aside className="space-y-10">
          {/* Stats Section */}
          <section className="bg-[#fdfcf7] p-6 rounded-lg border border-stone-300 shadow-[2px_2px_0px_rgba(28,46,28,0.05)]">
            <h3 className="text-xs uppercase tracking-[0.3em] text-emerald-900 font-bold mb-6 border-b border-stone-100 pb-2">
              Ledger Stats
            </h3>
            <div className="space-y-4 font-serif text-sm">
              <div className="flex justify-between border-b border-stone-300/30 pb-2">
                <span className="text-stone-600">Total Volumes</span>
                <span className="font-bold text-emerald-900">0</span>
              </div>
              <div className="flex justify-between border-b border-stone-300/30 pb-2">
                <span className="text-stone-600">Active Scribes</span>
                <span className="font-bold text-emerald-900">0</span>
              </div>
            </div>
          </section>

          {/* Social Activity Section */}
          <section className="bg-[#fdfcf7] p-6 rounded-lg border border-stone-300 shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold mb-6">
              Recent Scribe Activity
            </h3>
            <p className="text-[11px] text-stone-400 italic font-serif mt-4 border-t border-stone-100 pt-4">
              Visit the <Link href="/search" className="text-emerald-800 hover:underline">Stacks</Link> to find other scribes.
            </p>
          </section>
        </aside>

      </div>
    </div>
  </div>
);
}