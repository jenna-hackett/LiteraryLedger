export default function ScribeAvatar({ photoURL, name, size = "small" }) {
  const sizeClasses = size === "large" ? "w-32 h-32 text-4xl" : "w-12 h-12 text-lg";

  return (
    <div className={`${sizeClasses} rounded-full border-4 border-stone-200 overflow-hidden bg-emerald-900/5 flex items-center justify-center shadow-inner flex-shrink-0`}>
      {photoURL ? (
        <img src={photoURL} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-serif font-bold text-emerald-900 uppercase">
          {name ? name[0] : "S"}
        </span>
      )}
    </div>
  );
}