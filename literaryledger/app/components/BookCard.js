import Link from "next/link";

export default function BookCard({ book, small }) {
  return (
    <Link href={`/book/${book.id}`} className="group">
      <div className={`aspect-[2/3] bg-stone-100 rounded shadow-sm overflow-hidden mb-3 border border-stone-200 transition-transform group-hover:scale-[1.02] ${small ? 'max-w-[120px]' : ''}`}>
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2 text-center text-[9px] text-stone-400 italic">
            No Cover
          </div>
        )}
      </div>
      <p className={`font-serif font-bold text-emerald-900 line-clamp-1 group-hover:underline ${small ? 'text-xs' : 'text-sm'}`}>
        {book.title}
      </p>
      {!small && <p className="text-stone-500 text-[10px] italic">{book.authors?.join(", ")}</p>}
    </Link>
  );
}