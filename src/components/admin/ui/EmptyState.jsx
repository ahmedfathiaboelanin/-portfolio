export default function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-(--card-border) px-6 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-(--primary-soft) text-xl text-(--primary)">
        <Icon />
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      {hint && (
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-(--text-secondary) sm:text-sm">{hint}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
