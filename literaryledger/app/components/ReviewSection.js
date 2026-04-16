"use client";
import { useState, useEffect } from "react";
import { saveReview, getBookReviews, deleteReview } from "../_services/dbActions";
import ScribeAvatar from "./ScribeAvatar";

export default function ReviewSection({ bookId, user, profileData, bookTitle, bookStatus }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 1, text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  useEffect(() => {
    async function loadReviews() {
      const data = await getBookReviews(bookId);
      setReviews(data);
      
      const existing = data.find(r => r.userId === user?.uid);
      if (existing) {
        setUserReview({ rating: existing.rating, text: existing.text });
        setIsEditing(false);
      } else {
        setIsEditing(true); 
      }
    }
    if (bookId) loadReviews();
  }, [bookId, user?.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const reviewData = {
      ...userReview,
      userName: `${profileData?.firstName} ${profileData?.lastName}`,
      scribePhoto: profileData?.photoURL || null,
      title: bookTitle
    };

    const result = await saveReview(user.uid, bookId, reviewData);
    if (result.success) {
      const updated = await getBookReviews(bookId);
      setReviews(updated);
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you wish to strike this review from the Ledger?")) {
      await deleteReview(user.uid, bookId);
      const updated = await getBookReviews(bookId);
      setReviews(updated);
      setUserReview({ rating: 1, text: "" });
      setIsEditing(true);
    }
  };

  return (
    <div className="mt-16 border-t border-stone-200 pt-12 max-w-4xl mx-auto">
      
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <h3 className="font-serif text-3xl text-emerald-900 font-bold uppercase tracking-widest">
          The Public Archive
        </h3>
        <div className="bg-white/90 px-8 py-4 rounded-full border border-stone-300 shadow-md flex items-center gap-6 min-w-fit">
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] uppercase tracking-tighter text-stone-400 font-bold mb-1">Scribes Rating</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-900 font-bold text-2xl">{averageRating} / 5</span>
              <span className="text-2xl">📜</span>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-stone-200" /> 
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] uppercase tracking-tighter text-stone-400 font-bold mb-1">Ledger Count</span>
            <span className="text-emerald-900 font-bold text-xl">{reviews.length} Reviews</span>
          </div>
        </div>
      </div>

      {/* REVIEW FORM / USER CRITIQUE CARD */}
      {bookStatus === 'read' || bookStatus === 'reviewed' ? (
        isEditing ? (
          <form onSubmit={handleSubmit} className="mb-16 bg-[#faf9f6] p-10 rounded-xl border border-stone-300 shadow-[8px_8px_0px_rgba(28,46,28,0.08)]">
            <h4 className="font-serif text-xl text-emerald-900 mb-6 italic border-b border-stone-200 pb-2">Ink your thoughts for other scribes...</h4>
            
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Award Scrolls</label>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setUserReview({ ...userReview, rating: num })}
                      className={`text-3xl cursor-pointer transition-all duration-300 transform hover:scale-125 active:scale-95 ${
                        userReview.rating >= num 
                          ? 'grayscale-0 opacity-100 drop-shadow-md' 
                          : 'grayscale opacity-20 hover:opacity-50'
                      }`}
                    >
                      📜
                    </button>
                  ))}
                </div>
                <span className="font-serif font-bold text-emerald-900 bg-emerald-900/5 px-4 py-1 rounded-full text-sm border border-emerald-900/10">
                  {userReview.rating} / 5 Scrolls
                </span>
              </div>
            </div>

            <textarea
              className="w-full p-5 rounded-lg border border-stone-300 focus:border-emerald-800 outline-none font-serif min-h-[150px] bg-white shadow-inner text-lg"
              placeholder="What did this volume reveal to you?"
              value={userReview.text}
              onChange={(e) => setUserReview({ ...userReview, text: e.target.value })}
              required
            />
            
            <div className="flex justify-end mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-3 bg-emerald-900 text-white font-serif uppercase text-xs tracking-[0.2em] font-bold rounded shadow-lg hover:bg-emerald-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
              >
                {loading ? "Inking..." : "Commit to Ledger"}
              </button>
            </div>
          </form>
        ) : (
          /* --- UPDATED DISPLAY CARD --- */
          <div className="mb-16 bg-white p-10 rounded-xl border border-stone-300 shadow-[8px_8px_0px_rgba(6,78,59,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-900/5 -rotate-45 translate-x-8 -translate-y-8" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <ScribeAvatar photoURL={profileData?.photoURL} name={profileData?.firstName} size="small" />
                <div>
                  <h4 className="font-serif font-bold text-emerald-900 uppercase tracking-[0.2em] text-xs">Your Public Entry</h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">By {profileData?.firstName} {profileData?.lastName}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <button onClick={() => setIsEditing(true)} className="text-[10px] uppercase font-bold text-emerald-700 hover:text-emerald-900 transition-colors">Edit Entry</button>
                <button onClick={handleDelete} className="text-[10px] uppercase font-bold text-red-700 hover:text-red-900 transition-colors">Delete</button>
              </div>
            </div>
            <div className="flex gap-1 mb-6">
              {Array.from({ length: userReview.rating || 0 }).map((_, i) => (
                <span key={i} className="text-3xl drop-shadow-sm">📜</span>
              ))}
            </div>
            <p className="font-serif italic text-stone-700 text-xl leading-relaxed relative z-10">
              &quot;{userReview.text}&quot;
            </p>
          </div>
        )
      ) : (
        <div className="mb-16 p-10 bg-[#faf9f6] rounded-xl border border-dashed border-stone-300 text-center shadow-inner">
          <p className="font-serif italic text-stone-500 text-lg">
            A Scribe must finish this volume and move it to the &quot;Completed Volumes&quot; shelf before inking a review.
          </p>
        </div>
      )}

      {/* LIST OF OTHER REVIEWS */}
      <div className="space-y-12">
        {reviews.filter(r => r.userId !== user?.uid).map((rev) => (
          <div key={rev.id} className="flex gap-6 items-start border-b border-stone-100 pb-10 last:border-0">
            <ScribeAvatar photoURL={rev.scribePhoto} name={rev.userName} size="small" />
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-serif font-bold text-emerald-900 text-lg">{rev.userName}</span>
                <span className="text-sm">
                  {Array.from({ length: rev.rating || 0 }).map((_, i) => (
                    <span key={i}>📜</span>
                  ))}
                </span>
              </div>
              <p className="font-serif text-stone-700 leading-relaxed italic text-lg">&quot;{rev.text}&quot;</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-4 font-bold">
                {rev.updatedAt?.toDate() ? new Date(rev.updatedAt.toDate()).toLocaleDateString() : "Newly Archived"}
              </p>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-stone-400 font-serif italic py-16 text-lg">
            No other Scribes have inked their thoughts yet.
          </p>
        )}
      </div>
    </div>
  );
}