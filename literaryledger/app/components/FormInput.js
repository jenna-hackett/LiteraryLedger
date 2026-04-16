export default function FormInput({ type, placeholder, value, onChange, required = true }) {
  return (
    <input 
      type={type} 
      placeholder={placeholder}
      value={value}
      required={required}
      onChange={onChange}
      className="w-full px-4 py-3 rounded border border-stone-300/60 focus:border-emerald-800 outline-none text-stone-900 placeholder-stone-400 bg-stone-800/5 font-serif"
    />
  );
}