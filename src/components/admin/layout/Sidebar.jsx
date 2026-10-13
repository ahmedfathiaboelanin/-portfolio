import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaClock, FaDownload, FaExternalLinkAlt, FaMoon, FaSearch, FaSignOutAlt, FaSun } from 'react-icons/fa'
import NavItems from './NavItems'
import { cx, timeAgo } from '../utils'

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  email,
  lastSynced,
  isLight,
  onToggleTheme,
  onSignOut,
  onOpenPalette,
  onExportBackup,
  activeTab,
  onSelectTab,
  stats,
}) {
  return (
    <aside
      className={cx(
        'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-(--card-border) bg-(--surface)/80 backdrop-blur-xl lg:flex',
        collapsed ? 'w-[84px]' : 'w-[264px]',
      )}
    >
      <div className={cx('flex items-center gap-3 px-4 pt-5 pb-4', collapsed && 'justify-center px-2')}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-(--btn-primary-bg) text-lg font-bold text-(--btn-primary-text)">
          A
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-semibold leading-none">Portfolio CMS</p>
            <p className="mt-1 truncate font-mono text-[11px] text-(--text-secondary)">{email}</p>
          </div>
        )}
      </div>

      <div className={cx('px-4 pb-3', collapsed && 'px-2')}>
        <button
          onClick={onOpenPalette}
          className={cx(
            'flex w-full items-center gap-2 rounded-xl border border-(--card-border) bg-(--surface-2)/60 px-3 py-2.5 text-xs text-(--text-secondary) hover:border-(--border-primary)',
            collapsed && 'justify-center px-0',
          )}
        >
          <FaSearch className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Quick search…</span>
              <kbd className="rounded border border-(--card-border) px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      <nav aria-label="Dashboard sections" className={cx('flex-1 overflow-y-auto px-3 pb-3', collapsed && 'px-2')}>
        <NavItems activeTab={activeTab} onSelect={onSelectTab} stats={stats} compact={collapsed} />
      </nav>

      <div className={cx('border-t border-(--card-border) p-3', collapsed && 'flex flex-col items-center gap-2')}>
        {!collapsed && (
          <div className="mb-3 rounded-xl border border-(--card-border) bg-(--surface-2)/50 p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-(--text-secondary)">
              <FaClock /> LAST SYNC
            </p>
            <p className="mt-1 text-xs">{lastSynced ? timeAgo(lastSynced.toISOString()) : '—'}</p>
            <button
              onClick={onExportBackup}
              className="btn-ghost mt-2 flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold"
            >
              <FaDownload /> BACKUP JSON
            </button>
          </div>
        )}
        <div className={cx('flex gap-2', collapsed ? 'flex-col' : 'flex-row')}>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="btn-ghost grid h-10 w-10 place-items-center rounded-full"
          >
            {isLight ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/" title="View site" className="btn-ghost grid h-10 w-10 place-items-center rounded-full">
            <FaExternalLinkAlt />
          </Link>
          <button
            onClick={onSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="grid h-10 w-10 place-items-center rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10"
          >
            <FaSignOutAlt />
          </button>
        </div>
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="btn-ghost mt-2 hidden w-full items-center justify-center gap-1 rounded-full py-2 text-[11px] lg:flex"
        >
          {collapsed ? <FaChevronRight /> : <><FaChevronLeft /> COLLAPSE</>}
        </button>
      </div>
    </aside>
  )
}
