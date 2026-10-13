import { Link } from 'react-router-dom'
import { FaBars, FaSearch, FaSync } from 'react-icons/fa'
import { TABS } from '../constants'
import { cx } from '../utils'

export default function Topbar({ activeTab, onSelectTab, busy, unread, onOpenDrawer, onOpenPalette, onRefresh, onSignOut }) {
  const ActiveIcon = activeTab.icon

  return (
    <header className="sticky top-0 z-30 border-b border-(--card-border) bg-(--neutral)/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-3 py-3 sm:px-5">
        <button
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="btn-ghost grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden"
        >
          <FaBars />
        </button>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate font-mono text-[10px] tracking-[0.22em] text-(--text-secondary)">
            <ActiveIcon className="text-(--primary)" /> CMS / {activeTab.label.toUpperCase()}
            {busy && (
              <span className="ml-1 inline-flex items-center gap-1 text-(--primary)">
                <FaSync className="animate-spin" /> syncing
              </span>
            )}
          </p>
          <h1 className="truncate text-base font-semibold sm:text-lg">{activeTab.label}</h1>
        </div>
        <button
          onClick={onOpenPalette}
          className="btn-ghost hidden items-center gap-2 rounded-full px-4 py-2.5 text-xs md:flex"
        >
          <FaSearch /> <span className="text-(--text-secondary)">Search…</span>
          <kbd className="rounded border border-(--card-border) px-1.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <button
          onClick={onRefresh}
          disabled={busy}
          aria-label="Refresh data"
          title="Refresh data"
          className="btn-ghost grid h-11 w-11 shrink-0 place-items-center rounded-full disabled:opacity-60"
        >
          <FaSync className={busy ? 'animate-spin' : ''} />
        </button>
        <Link to="/" className="btn-ghost hidden shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wider sm:inline-flex">
          VIEW SITE
        </Link>
        <button
          onClick={onSignOut}
          className="btn-primary hidden shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wider lg:inline-flex"
        >
          SIGN OUT
        </button>
      </div>
      <nav aria-label="Quick tabs" className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-3 pb-3 lg:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTab(t.id)}
            aria-current={activeTab.id === t.id ? 'page' : undefined}
            className={cx(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap',
              activeTab.id === t.id
                ? 'bg-(--primary-soft) shadow-[inset_0_0_0_1px_var(--border-primary)]'
                : 'text-(--text-secondary)',
            )}
          >
            <t.icon className="text-xs" /> {t.label.toUpperCase()}
            {t.id === 'messages' && unread > 0 && (
              <span className="rounded-full bg-red-500/20 px-1.5 text-red-200">{unread}</span>
            )}
          </button>
        ))}
      </nav>
    </header>
  )
}
