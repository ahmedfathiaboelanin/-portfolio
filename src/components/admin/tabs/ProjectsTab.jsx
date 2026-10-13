import { useMemo, useState } from 'react'
import { FaCopy, FaEdit, FaEye, FaEyeSlash, FaFolderOpen, FaImage, FaPlus, FaStar, FaTrash } from 'react-icons/fa'
import Shell from '../ui/Shell'
import EmptyState from '../ui/EmptyState'
import SearchInput from '../ui/SearchInput'
import { cx } from '../utils'

function ProjectCard({ p, onEdit, onTogglePublish, onDuplicate, onDelete }) {
  return (
    <article className="card-hover glass flex flex-col overflow-hidden rounded-2xl">
      {p.image_url ? (
        <img src={p.image_url} alt="" loading="lazy" className="aspect-video w-full object-cover" />
      ) : (
        <div className="grid aspect-video place-items-center bg-(--surface-2) text-(--text-secondary)">
          <FaImage className="text-2xl" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {p.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[10px] text-amber-200">
              <FaStar /> FEATURED
            </span>
          )}
          <span
            className={cx(
              'rounded-full px-2 py-0.5 font-mono text-[10px]',
              p.is_published ? 'bg-emerald-500/15 text-emerald-200' : 'bg-(--surface-2) text-(--text-secondary)',
            )}
          >
            {p.is_published ? 'LIVE' : 'DRAFT'}
          </span>
          <span className="ml-auto font-mono text-[10px] text-(--text-secondary)">#{p.sort_order}</span>
        </div>
        <h3 className="font-semibold">{p.title}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-(--text-secondary)">{p.description || 'No description.'}</p>
        <p className="truncate font-mono text-[11px] text-(--primary)">{(p.tech ?? []).join(' · ')}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          <button onClick={() => onEdit(p)} className="btn-ghost flex-1 rounded-full px-3 py-2 text-[11px]">
            <span className="inline-flex items-center gap-1"><FaEdit /> EDIT</span>
          </button>
          <button onClick={() => onTogglePublish(p)} title={p.is_published ? 'Unpublish' : 'Publish'} className="btn-ghost rounded-full px-3 py-2 text-[11px]">
            {p.is_published ? <FaEyeSlash /> : <FaEye />}
          </button>
          <button onClick={() => onDuplicate(p)} title="Duplicate as draft" className="btn-ghost rounded-full px-3 py-2 text-[11px]">
            <FaCopy />
          </button>
          <button onClick={() => onDelete(p)} title="Delete" className="rounded-full border border-red-500/40 px-3 py-2 text-[11px] text-red-300 hover:bg-red-500/10">
            <FaTrash />
          </button>
        </div>
      </div>
    </article>
  )
}

function ProjectRow({ p, onEdit, onTogglePublish, onDelete }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3">
      {p.image_url ? (
        <img src={p.image_url} alt="" loading="lazy" className="h-12 w-20 rounded-lg object-cover" />
      ) : (
        <span className="grid h-12 w-20 place-items-center rounded-lg bg-(--surface-2) text-(--text-secondary)">
          <FaImage />
        </span>
      )}
      <div className="min-w-40 flex-1">
        <p className="font-semibold">
          {p.title} {p.featured && <FaStar className="inline text-amber-300" />}
        </p>
        <p className="truncate font-mono text-[11px] text-(--text-secondary)">
          #{p.sort_order} · {(p.tech ?? []).join(', ')} · {p.is_published ? 'published' : 'hidden'}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => onEdit(p)} className="btn-ghost rounded-full px-4 py-2 text-xs">EDIT</button>
        <button onClick={() => onTogglePublish(p)} className="btn-ghost rounded-full px-3 py-2 text-xs">
          {p.is_published ? <FaEyeSlash /> : <FaEye />}
        </button>
        <button onClick={() => onDelete(p)} className="rounded-full border border-red-500/40 px-4 py-2 text-xs text-red-300">
          DELETE
        </button>
      </div>
    </div>
  )
}

export default function ProjectsTab({ projects, onNew, onEdit, onTogglePublish, onDuplicate, onDelete }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('order')
  const [view, setView] = useState('grid')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = projects.filter((p) => {
      if (status === 'published' && !p.is_published) return false
      if (status === 'draft' && p.is_published) return false
      if (status === 'featured' && !p.featured) return false
      if (!q) return true
      return [p.title, p.description, (p.tech ?? []).join(' ')].join(' ').toLowerCase().includes(q)
    })
    if (sort === 'title') return [...rows].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'newest') return [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  }, [projects, query, status, sort])

  return (
    <Shell
      title={`Projects (${filtered.length}/${projects.length})`}
      subtitle="Starred = large on homepage. Drafts stay hidden from visitors."
      action={
        <button onClick={onNew} className="btn-primary rounded-full px-4 py-2.5 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5"><FaPlus /> NEW</span>
        </button>
      }
    >
      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_auto_auto_auto]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search title, tech, description…" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field !w-auto py-2.5 text-xs" aria-label="Filter projects">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !w-auto py-2.5 text-xs" aria-label="Sort projects">
          <option value="order">Sort: manual</option>
          <option value="newest">Sort: newest</option>
          <option value="title">Sort: A–Z</option>
        </select>
        <div className="flex rounded-xl border border-(--card-border) p-1" role="group" aria-label="View mode">
          {['grid', 'list'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cx(
                'rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest',
                view === v ? 'bg-(--primary-soft)' : 'text-(--text-secondary)',
              )}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {!filtered.length && (
        <EmptyState
          icon={FaFolderOpen}
          title="No projects match"
          hint="Try clearing the search or add a new project."
          action={
            <button onClick={onNew} className="btn-primary rounded-full px-5 py-2.5 text-xs font-semibold">
              + NEW PROJECT
            </button>
          }
        />
      )}

      {view === 'grid' ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              p={p}
              onEdit={onEdit}
              onTogglePublish={onTogglePublish}
              onDuplicate={onDuplicate}
              onDelete={(row) => onDelete(row.id, row.title)}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((p) => (
            <ProjectRow
              key={p.id}
              p={p}
              onEdit={onEdit}
              onTogglePublish={onTogglePublish}
              onDelete={(row) => onDelete(row.id, row.title)}
            />
          ))}
        </div>
      )}
    </Shell>
  )
}
