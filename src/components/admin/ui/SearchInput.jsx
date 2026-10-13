import { FaSearch, FaTimes } from 'react-icons/fa'

export default function SearchInput({ value, onChange, placeholder, ariaLabel }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-(--card-border) bg-(--surface)/60 px-3">
      <FaSearch className="shrink-0 text-(--text-secondary)" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="w-full bg-transparent py-2.5 text-sm outline-none"
      />
      {value && (
        <button onClick={() => onChange('')} aria-label="Clear search">
          <FaTimes className="text-(--text-secondary)" />
        </button>
      )}
    </label>
  )
}
