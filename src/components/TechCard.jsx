export default function TechCard({ title, percentage }) {
    return (
        <div className="group flex flex-col gap-2.5 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-(--card-border) hover:bg-(--surface)/60">
            <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
                <h4 className='text-sm font-semibold tracking-wider text-(--text-primary)'>{title}</h4>
                <span className='font-mono text-xs text-(--text-secondary)'>{percentage}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--muted)">
                <div
                    className="animate-bar h-full rounded-full bg-gradient-to-r from-(--primary) to-(--secondary)"
                    style={{ width: percentage }}
                ></div>
            </div>
        </div>
    )
}
