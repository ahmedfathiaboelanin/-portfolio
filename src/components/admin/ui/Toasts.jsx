import { FaBolt, FaCheck, FaTimes } from 'react-icons/fa'
import { cx } from '../utils'

export default function Toasts({ toasts, dismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-20 z-[90] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96 lg:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-in pointer-events-auto flex items-start gap-3 rounded-2xl border border-(--card-border) bg-(--surface)/95 p-3.5 text-sm shadow-2xl backdrop-blur-xl"
        >
          <span
            className={cx(
              'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs',
              t.type === 'error'
                ? 'bg-red-500/15 text-red-300'
                : t.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-(--primary-soft) text-(--primary)',
            )}
          >
            {t.type === 'error' ? <FaTimes /> : t.type === 'success' ? <FaCheck /> : <FaBolt />}
          </span>
          <p className="min-w-0 flex-1 text-xs leading-relaxed">{t.msg}</p>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            className="rounded-full p-1.5 text-(--text-secondary) hover:text-(--text-primary)"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  )
}
