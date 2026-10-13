import { useMemo, useState } from 'react'
import { FaCode, FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import Shell from '../ui/Shell'
import EmptyState from '../ui/EmptyState'
import SearchInput from '../ui/SearchInput'
import { cx } from '../utils'

const FILTERS = ['all', 'frontend', 'backend', 'tool']

function SkillCard({ s, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-(--primary-soft) px-2 py-0.5 font-mono text-[10px] tracking-widest text-(--primary)">
          {s.category.toUpperCase()}
        </span>
        {!s.is_visible && (
          <span className="rounded-full bg-(--surface-2) px-2 py-0.5 font-mono text-[10px] text-(--text-secondary)">
            HIDDEN
          </span>
        )}
        <span className="ml-auto flex gap-1.5">
          <button onClick={() => onEdit(s)} aria-label={`Edit ${s.title}`} className="btn-ghost rounded-full p-2 text-xs">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(s.id, s.title)} aria-label={`Delete ${s.title}`} className="rounded-full border border-red-500/40 p-2 text-xs text-red-300">
            <FaTrash />
          </button>
        </span>
      </div>
      <p className="mt-2 font-semibold">{s.title}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-(--surface-2)">
          <div className="h-full rounded-full bg-gradient-to-r from-(--primary) to-emerald-400" style={{ width: `${s.percentage}%` }} />
        </div>
        <span className="font-mono text-xs text-(--text-secondary)">{s.percentage}%</span>
      </div>
    </div>
  )
}

export default function SkillsTab({ skills, onNew, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return skills.filter((s) => {
      if (cat !== 'all' && s.category !== cat) return false
      return !q || s.title.toLowerCase().includes(q)
    })
  }, [skills, query, cat])

  return (
    <Shell
      title={`Skills (${filtered.length})`}
      subtitle="Frontend / backend render as cards, tools as pills."
      action={
        <button onClick={onNew} className="btn-primary rounded-full px-4 py-2.5 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5"><FaPlus /> NEW</span>
        </button>
      }
    >
      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search skills…" />
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-(--card-border) p-1">
          {FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cx(
                'shrink-0 rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest whitespace-nowrap',
                cat === c ? 'bg-(--primary-soft)' : 'text-(--text-secondary)',
              )}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {!filtered.length && (
        <EmptyState icon={FaCode} title="No skills found" hint="Add your first skill to fill the homepage section." />
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((s) => (
          <SkillCard key={s.id} s={s} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </Shell>
  )
}
