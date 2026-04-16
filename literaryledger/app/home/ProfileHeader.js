"use client";
import { useState } from "react";
import { updateUserProfile } from "../_services/dbActions";
import ScribeAvatar from "../components/ScribeAvatar";

export default function ProfileHeader({ profileData, user, totalVolumes }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    bio: profileData?.bio || "",
    photoURL: profileData?.photoURL || ""
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const result = await updateUserProfile(user.uid, editData);
      if (result.success) {
        setIsEditing(false);
        window.location.reload(); // Refresh to show new data
      } else {
        alert("The archive failed to save: " + result.error);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
    setSaving(false);
  };

  return (
    <header className="mb-16 bg-[#fdfcf7] border border-stone-300 rounded-lg p-8 shadow-[4px_4px_0px_rgba(28,46,28,0.1)]">
      {!isEditing ? (
        /* --- VIEW MODE --- */
        <div className="flex flex-col md:flex-row items-center gap-10">
          <ScribeAvatar photoURL={profileData?.photoURL} name={profileData?.firstName} size="large" />

          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold text-emerald-900 mb-2">
              {profileData?.firstName ? `${profileData.firstName} ${profileData.lastName}` : (user?.displayName || "Anonymous Scribe")}
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
        /* --- EDIT MODE --- */
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
            <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-stone-500 font-serif italic">Discard</button>
            <button onClick={handleSaveProfile} disabled={saving} className="px-8 py-2 bg-emerald-900 text-white font-serif uppercase text-xs tracking-widest rounded shadow-md">
              {saving ? "Inking..." : "Save to Archive"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}