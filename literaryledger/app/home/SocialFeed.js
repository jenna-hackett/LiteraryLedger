"use client";
import { useEffect, useState } from "react";
import { getCircleActivity } from "../_services/dbActions";
import ScribeAvatar from "../components/ScribeAvatar";

export default function SocialFeed({ profileData }) {
  const [circleActivity, setCircleActivity] = useState([]);
  const [activeReview, setActiveReview] = useState(null); // Tracks the modal state

  useEffect(() => {
    async function loadActivity() {
      if (profileData?.following?.length > 0) {
        const activity = await getCircleActivity(profileData.following);
        setCircleActivity(activity);
      }
    }
    if (profileData) loadActivity();
  }, [profileData]);

  return (
    <section className="bg-[#fdfcf7] p-8 rounded-xl border border-stone-300 shadow-[6px_6px_0px_rgba(28,46,28,0.05)] relative">
      <h3 className="text-sm uppercase tracking-[0.4em] text-stone-400 font-bold mb-8">
        Recent Scribe Activity
      </h3>

      {circleActivity.length > 0 ? (
        <div className="space-y-10">
          {circleActivity.map((activity, index) => {
            const isReviewed = activity.status === 'reviewed';
            
            return (
              <div key={index} className="flex gap-5 border-b border-stone-100 pb-8 last:border-0 items-start">
                <ScribeAvatar 
                  photoURL={activity.scribePhoto} 
                  name={activity.scribeName} 
                  size="small" 
                />
                
                <div className="flex flex-col gap-1">
                  <p className="text-base font-serif leading-relaxed text-stone-800">
                    <span className="font-bold text-emerald-900">
                      {activity.scribeName}
                    </span> 
                    <span className="text-stone-500"> 
                      {isReviewed ? " recently reviewed " : " recently marked "} 
                    </span>
                    <span className="italic font-medium">&quot;{activity.title}&quot;</span>
                    
                    {isReviewed ? (
                      <span className="text-stone-500"> as {activity.rating}/5 Scrolls 📜</span>
                    ) : (
                      <>
                        <span className="text-stone-500"> as </span>
                        <span className="inline-block px-2 py-0.5 bg-emerald-900/5 text-emerald-800 font-bold rounded text-xs uppercase tracking-tighter">
                          {activity.status.replace(/-/g, ' ')}
                        </span>
                      </>
                    )}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-stone-400 uppercase tracking-[0.1em] font-bold">
                      {new Date(activity.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-stone-300 text-xs">•</span>
                    
                    {isReviewed ? (
                      <button 
                        onClick={() => setActiveReview(activity)}
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        View Review
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                        Archive Entry
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-stone-400 font-serif italic text-center py-10">Your circle is quiet.</p>
      )}

      {/* --- REVIEW MODAL --- */}
      {activeReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-[#fdfcf7] max-w-lg w-full rounded-2xl p-10 shadow-2xl border border-stone-300 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveReview(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 text-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-8">
              <ScribeAvatar photoURL={activeReview.scribePhoto} name={activeReview.scribeName} size="small" />
              <div>
                <h4 className="font-serif font-bold text-emerald-900 text-xl leading-none">
                  {activeReview.scribeName}
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Scribe Review</p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2 leading-tight">
              {activeReview.title}
            </h2>
            <div className="flex gap-1 mb-6 text-2xl">
              {"📜".repeat(activeReview.rating)}
            </div>

            <div className="bg-stone-800/5 p-6 rounded-xl border border-stone-200">
              <p className="font-serif italic text-stone-700 text-lg leading-relaxed">
                &quot;{activeReview.reviewText}&quot;
              </p>
            </div>

            <p className="mt-8 text-center text-[10px] text-stone-300 uppercase tracking-[0.4em] font-bold">
              Inked into the Ledger on {new Date(activeReview.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}