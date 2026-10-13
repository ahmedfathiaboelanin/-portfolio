import { TABS } from '../constants'
import { cx } from '../utils'

export default function NavItems({ activeTab, onSelect, stats, compact, onNavigate }) {
  return (
    <div className="flex flex-col gap-1">
      {TABS.map((t) => {
        const active = activeTab === t.id
        const badge =
          t.id === 'messages' && stats.unread > 0
            ? stats.unread
            : t.id === 'projects'
              ? stats.projects
              : null
        return (
          <button
            key={t.id}
            onClick={() => {
              onSelect(t.id)
              onNavigate?.()
            }}
            title={compact ? t.label : undefined}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
              active
                ? 'bg-(--primary-soft) text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border-primary)]'
                : 'text-(--text-secondary) hover:bg-(--surface-2) hover:text-(--text-primary)',
              compact && 'justify-center px-0',
            )}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-(--surface-2) text-base group-[aria-current]:text-(--primary)">
              <t.icon />
            </span>
            {!compact && (
              <>
                <span className="min-w-0 flex-1 truncate font-medium">{t.label}</span>
                {badge !== null && (
                  <span
                    className={cx(
                      'shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]',
                      t.id === 'messages'
                        ? 'bg-red-500/15 text-red-300'
                        : 'bg-(--surface-2) text-(--text-secondary)',
                    )}
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
