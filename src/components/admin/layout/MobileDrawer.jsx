import { Link } from 'react-router-dom'
import { FaExternalLinkAlt, FaMoon, FaSearch, FaSun, FaSync, FaTimes } from 'react-icons/fa'
import NavItems from './NavItems'

export default function MobileDrawer({
  open,
  onClose,
  email,
  activeTab,
  onSelectTab,
  stats,
  isLight,
  onToggleTheme,
  onRefresh,
  busy,
  onSignOut,
  onOpenPalette,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="drawer-in absolute inset-y-0 left-0 flex w-[86vw] max-w-80 flex-col border-r border-(--card-border) bg-(--surface) p-4">
        <div className="flex items-center gap-3 pb-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-(--btn-primary-bg) font-bold text-(--btn-primary-text)">
            A
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-none">Portfolio CMS</p>
            <p className="mt-1 truncate font-mono text-[11px] text-(--text-secondary)">{email}</p>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="btn-ghost grid h-10 w-10 place-items-center rounded-full">
            <FaTimes />
          </button>
        </div>
        <button
          onClick={onOpenPalette}
          className="mb-3 flex items-center gap-2 rounded-xl border border-(--card-border) px-3 py-2.5 text-xs text-(--text-secondary)"
        >
          <FaSearch /> Quick search…
          <kbd className="ml-auto rounded border border-(--card-border) px-1.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <nav aria-label="Dashboard sections" className="flex-1 overflow-y-auto">
          <NavItems activeTab={activeTab} onSelect={onSelectTab} stats={stats} onNavigate={onClose} />
        </nav>
        <div className="flex gap-2 border-t border-(--card-border) pt-3">
          <button onClick={onToggleTheme} aria-label="Toggle theme" className="btn-ghost grid h-11 w-11 place-items-center rounded-full">
            {isLight ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/" className="btn-ghost grid h-11 w-11 place-items-center rounded-full" aria-label="View site">
            <FaExternalLinkAlt />
          </Link>
          <button onClick={onRefresh} className="btn-ghost grid h-11 w-11 place-items-center rounded-full" aria-label="Refresh">
            <FaSync className={busy ? 'animate-spin' : ''} />
          </button>
          <button onClick={onSignOut} className="btn-primary ml-auto rounded-full px-5 text-xs font-semibold">
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  )
}
