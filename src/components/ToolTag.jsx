export default function ToolTag({ title }) {
    return (
        <div className="group inline-flex w-max cursor-default items-center gap-2.5 rounded-xl border border-(--card-border) bg-(--surface)/70 px-4 py-2.5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-primary) hover:shadow-[0_8px_24px_-10px_var(--primary-glow)]">
            <span className="h-1.5 w-1.5 rounded-full bg-(--primary) transition-transform duration-200 group-hover:scale-150"></span>
            <span className="text-xs font-medium tracking-[0.14em] text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">{title}</span>
        </div>
    )
}
