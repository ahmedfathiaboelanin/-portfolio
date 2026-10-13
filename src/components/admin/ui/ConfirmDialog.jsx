export default function ConfirmDialog({ confirm, onCancel, onConfirm }) {
  if (!confirm) return null
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center p-4" role="alertdialog" aria-modal="true">
      <button aria-label="Close dialog" onClick={onCancel} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="modal-in relative w-full max-w-sm rounded-2xl border border-(--card-border) bg-(--surface) p-5 sm:p-6">
        <p className="font-semibold">{confirm.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{confirm.message}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="btn-ghost flex-1 rounded-full px-4 py-2.5 text-xs font-semibold">
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full border border-red-500/50 bg-red-500/15 px-4 py-2.5 text-xs font-semibold text-red-200 hover:bg-red-500/25"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  )
}
