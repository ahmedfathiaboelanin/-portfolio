import { useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function CommandPalette({ open, query, setQuery, results, onClose, onPick }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40)
  }, [open ])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[92] flex items-start justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Quick actions"
    >
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="modal-in relative mt-[6dvh] flex max-h-[80dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-(--card-border) bg-(--surface) shadow-2xl">
        <div className="flex items-center gap-2 border-b border-(--card-border) p-3">
          <FaSearch className="ml-2 shrink-0 text-(--text-secondary)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills, messages, actions…  (Esc to close)"
            className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-(--text-secondary)/70"
          />
          <kbd className="hidden shrink-0 rounded-md border border-(--card-border) px-2 py-1 font-mono text-[10px] text-(--text-secondary) sm:block">
            CTRL K
          </kbd>
        </div>
        <div className="overflow-y-auto p-2">
          {!results.length && (
            <p className="px-3 py-6 text-center text-sm text-(--text-secondary)">
              No matches. Try “inbox”, “new project”, or a title.
            </p>
          )}
          {results.map((r) => (
            <button
              key={r.key}
              onClick={() => onPick(r)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-(--primary-soft)"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--surface-2) text-(--primary)">
                <r.icon />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{r.label}</span>
                <span className="block truncate font-mono text-[11px] text-(--text-secondary)">{r.hint}</span>
              </span>
              <span className="shrink-0 rounded-full border border-(--card-border) px-2 py-0.5 font-mono text-[10px] text-(--text-secondary)">
                {r.type}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
