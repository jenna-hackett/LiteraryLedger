"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCircleActivity } from "../_services/dbActions";
import ScribeAvatar from "../components/ScribeAvatar";

export default function SocialFeed({ profileData }) {
  const [circleActivity, setCircleActivity] = useState([]);

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
    <section className="bg-[#fdfcf7] p-8 rounded-xl border border-stone-300 shadow-[6px_6px_0px_rgba(28,46,28,0.05)]">
      <h3 className="text-sm uppercase tracking-[0.4em] text-stone-400 font-bold mb-8">
        Recent Scribe Activity
      </h3>

      {circleActivity.length > 0 ? (
        <div className="space-y-10">
          {circleActivity.map((activity, index) => (
            <div key={index} className="flex gap-5 border-b border-stone-100 pb-8 last:border-0 items-start">
              <ScribeAvatar 
                photoURL={activity.scribePhoto} 
                name={activity.scribeName} 
                size="small" 
              />
              
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
  );
}