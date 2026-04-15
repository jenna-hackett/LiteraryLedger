import Link from "next/link";

export default function EmptyShelf({ message }) {
  return (
    <div className="bg-[#fdfcf7] border border-stone-300 border-dashed p-12 rounded-lg text-center shadow-sm">
      <p className="text-stone-400 font-serif italic mb-4">{message}</p>
      <Link href="/search" className="inline-block px-6 py-2 bg-emerald-900 text-white text-[10px] uppercase tracking-widest font-bold rounded hover:bg-emerald-800 transition-all">
        Search the Ledger
      </Link>
    </div>
  );
}