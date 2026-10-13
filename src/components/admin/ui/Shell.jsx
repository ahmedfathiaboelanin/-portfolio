export default function Shell({ children, title, subtitle, action }) {
  return (
    <section className="glass rounded-2xl p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
