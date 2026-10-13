import { useMemo, useState } from 'react'
import { FaEdit, FaGlobe, FaPlus, FaTrash } from 'react-icons/fa'
import Shell from '../ui/Shell'
import EmptyState from '../ui/EmptyState'
import SearchInput from '../ui/SearchInput'

function SocialCard({ s, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-(--primary-soft) font-mono text-[11px] text-(--primary)">
        {s.icon.slice(0, 2).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {s.label} {!s.is_visible && <span className="font-mono text-[10px] text-(--text-secondary)">· hidden</span>}
        </p>
        <a href={s.href} target="_blank" rel="noreferrer" className="truncate font-mono text-[11px] text-(--primary) hover:underline">
          {s.href}
        </a>
      </div>
      <span className="flex shrink-0 gap-1.5">
        <button onClick={() => onEdit(s)} aria-label={`Edit ${s.label}`} className="btn-ghost rounded-full p-2.5 text-xs">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(s.id, s.label)} aria-label={`Delete ${s.label}`} className="rounded-full border border-red-500/40 p-2.5 text-xs text-red-300">
          <FaTrash />
        </button>
      </span>
    </div>
  )
}

export default function SocialsTab({ socials, onNew, onEdit, onDelete }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return socials.filter((s) => !q || `${s.label} ${s.href} ${s.icon}`.toLowerCase().includes(q))
  }, [socials, query])

  return (
    <Shell
      title={`Social links (${filtered.length})`}
      subtitle="Icon key: github, linkedin, facebook, gmail, twitter, instagram, globe."
      action={
        <button onClick={onNew} className="btn-primary rounded-full px-4 py-2.5 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5"><FaPlus /> NEW</span>
        </button>
      }
    >
      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search links…" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((s) => (
          <SocialCard key={s.id} s={s} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      {!filtered.length && (
        <EmptyState icon={FaGlobe} title="No social links" hint="Add GitHub, LinkedIn and email so visitors can reach you." />
      )}
    </Shell>
  )
}
