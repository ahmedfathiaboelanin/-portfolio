import { FaTimes } from 'react-icons/fa'
import { cx } from '../utils'

/** Responsive modal sheet: bottom-sheet on phones, centered dialog on sm+ */
export default function ModalSheet({ title, subtitle, onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={cx(
          'modal-in relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-(--card-border) bg-(--surface) sm:rounded-3xl',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg',
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-(--card-border) p-4 sm:p-5">
          <div className="min-w-0">
            <h3 className="truncate font-semibold sm:text-lg">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-(--text-secondary)">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="btn-ghost grid h-10 w-10 shrink-0 place-items-center rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  )
}
