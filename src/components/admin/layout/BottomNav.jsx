import { FaBars } from 'react-icons/fa'
import { TABS } from '../constants'
import { cx } from '../utils'

const VISIBLE = [TABS[0], TABS[1], TABS[2], TABS[5]]

export default function BottomNav({ activeTabId, unread, onSelectTab, onOpenMenu }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-(--card-border) bg-(--surface)/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {VISIBLE.map((t) => {
          const active = activeTabId === t.id
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              aria-current={active ? 'page' : undefined}
              className={cx(
                'flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] font-mono tracking-wider',
                active ? 'text-(--primary)' : 'text-(--text-secondary)',
              )}
            >
              <span className="relative text-lg">
                <t.icon />
                {t.id === 'messages' && unread > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </span>
              {t.short.toUpperCase()}
            </button>
          )
        })}
        <button
          onClick={onOpenMenu}
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] font-mono tracking-wider text-(--text-secondary)"
        >
          <span className="text-lg"><FaBars /></span>
          MENU
        </button>
      </div>
    </nav>
  )
}
