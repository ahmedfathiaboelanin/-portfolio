export default function Tag({ title }) {
    return (
        <p className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-(--card-border) bg-(--surface)/70 px-3.5 py-1.5 shadow-sm backdrop-blur-xl sm:px-4">
            <span className="animate-pulse-dot h-2 w-2 shrink-0 rounded-full bg-(--primary)"></span>
            <span className="min-w-0 truncate text-[11px] font-medium tracking-[0.14em] text-(--text-secondary) uppercase sm:text-xs sm:tracking-[0.18em]">{title}</span>
        </p>
    )
}
