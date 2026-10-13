import { useMemo, useState } from 'react'
import { FaCheckDouble, FaCopy, FaDownload, FaInbox } from 'react-icons/fa'
import Shell from '../ui/Shell'
import EmptyState from '../ui/EmptyState'
import SearchInput from '../ui/SearchInput'
import { cx, timeAgo } from '../utils'

const FILTERS = ['all', 'unread', 'read']
const PAGE_SIZE = 12

function MessageCard({ m, onToggleRead, onDelete, onCopy }) {
  return (
    <article
      className={cx(
        'rounded-2xl border p-4',
        m.is_read ? 'border-(--card-border) opacity-80' : 'border-(--border-primary) bg-(--primary-soft)/40',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {!m.is_read && <span className="h-2 w-2 rounded-full bg-(--primary)" />}
        <p className="font-semibold">{m.name}</p>
        <a href={`mailto:${m.email}`} className="min-w-0 truncate font-mono text-[11px] text-(--primary) hover:underline">
          {m.email}
        </a>
        <span className="ml-auto shrink-0 font-mono text-[10px] text-(--text-secondary)">{timeAgo(m.created_at)}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{m.message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => onToggleRead(m.id, !m.is_read)} className="btn-ghost rounded-full px-3 py-1.5 text-xs">
          {m.is_read ? 'MARK UNREAD' : 'MARK READ'}
        </button>
        <a
          href={`mailto:${m.email}?subject=Re:%20Portfolio%20inquiry&body=${encodeURIComponent(`Hi ${m.name},\n\n`)}`}
          className="btn-ghost rounded-full px-3 py-1.5 text-xs"
        >
          REPLY
        </a>
        <button onClick={() => onCopy(m.email)} className="btn-ghost rounded-full px-3 py-1.5 text-xs">
          <span className="inline-flex items-center gap-1"><FaCopy /> COPY</span>
        </button>
        <button onClick={() => onDelete(m.id)} className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300">
          DELETE
        </button>
      </div>
    </article>
  )
}

export default function MessagesTab({
  messages,
  unread,
  onToggleRead,
  onDelete,
  onCopy,
  onMarkAllRead,
  onDeleteRead,
  onExportCSV,
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return messages.filter((m) => {
      if (filter === 'unread' && m.is_read) return false
      if (filter === 'read' && !m.is_read) return false
      return !q || `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(q)
    })
  }, [messages, query, filter])

  return (
    <Shell
      title={`Inbox (${filtered.length}/${messages.length})`}
      subtitle="Contact-form submissions. Reply opens your mail app."
      action={
        <>
          <button onClick={() => onExportCSV(filtered)} className="btn-ghost rounded-full px-4 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5"><FaDownload /> CSV</span>
          </button>
          <button onClick={onMarkAllRead} className="btn-ghost rounded-full px-4 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5"><FaCheckDouble /> READ ALL</span>
          </button>
        </>
      }
    >
      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search name, email, message…" />
        <div className="flex gap-1 rounded-xl border border-(--card-border) p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cx(
                'rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest',
                filter === f ? 'bg-(--primary-soft)' : 'text-(--text-secondary)',
              )}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {unread > 0 && (
        <button
          onClick={onDeleteRead}
          className="mb-3 text-xs text-(--text-secondary) underline underline-offset-2 hover:text-(--text-primary)"
        >
          Delete all read messages ({messages.length - unread})
        </button>
      )}
      <div className="grid gap-3">
        {filtered.slice(0, visible).map((m) => (
          <MessageCard key={m.id} m={m} onToggleRead={onToggleRead} onDelete={onDelete} onCopy={onCopy} />
        ))}
        {!filtered.length && (
          <EmptyState icon={FaInbox} title="Inbox zero" hint="New contact-form submissions will land here." />
        )}
      </div>
      {filtered.length > visible && (
        <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-ghost mt-4 w-full rounded-full py-3 text-xs font-semibold">
          SHOW MORE ({filtered.length - visible} left)
        </button>
      )}
    </Shell>
  )
}
