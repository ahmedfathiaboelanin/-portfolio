import { FaClock, FaEnvelope, FaShieldAlt } from 'react-icons/fa'
import { timeAgo } from '../utils'

export default function StatusStrip({ lastSynced, unread, onOpenInbox }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-(--text-secondary)">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-(--card-border) bg-(--surface)/60 px-3 py-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Supabase connected
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-(--card-border) bg-(--surface)/60 px-3 py-1.5">
        <FaClock /> {lastSynced ? `Synced ${timeAgo(lastSynced.toISOString())}` : 'Not synced yet'}
      </span>
      {unread > 0 && (
        <button
          onClick={onOpenInbox}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-200"
        >
          <FaEnvelope /> {unread} unread — open inbox
        </button>
      )}
      <span className="ml-auto hidden items-center gap-1.5 font-mono sm:inline-flex">
        <FaShieldAlt /> RLS: writes require login
      </span>
    </div>
  )
}
