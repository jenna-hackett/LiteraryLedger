"use client"; // 1. Must be at the very top!

import { useEffect } from "react";
import { searchBooks } from "../_services/openLibrary";

export default function Home() {
  
  useEffect(() => {
    const testSearch = async () => {
      console.log("Searching for books...");
      const books = await searchBooks("The Great Gatsby");
      console.log("Found these books:", books);
    };

    testSearch();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-50">
      <h1 className="text-3xl font-serif font-bold text-emerald-900">
        Home Page - Coming Soon!
      </h1>
      <p className="text-stone-500 mt-4 italic">
        Check your browser console (F12) to see the API results.
      </p>
    </div>
  );
}