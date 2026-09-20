export default function ServicesCard({ title, description, icon: Icon, bgText }) {
    return (
        <div className="card-hover glass group relative flex flex-col justify-center gap-2.5 overflow-hidden rounded-2xl p-5 sm:gap-3 sm:p-7 md:p-8">
            <div className="absolute -top-10 -right-6 bg-gradient-to-br from-(--primary) to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" style={{ width: '12rem', height: '12rem' }} />
            <div className="relative z-10 grid h-11 w-11 place-items-center rounded-xl bg-(--primary-soft) text-(--primary) shadow-[inset_0_0_0_1px_var(--border-primary)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 sm:h-12 sm:w-12">
                <Icon className='text-xl sm:text-2xl' />
            </div>
            <h2 className='relative z-10 text-lg font-semibold tracking-wide text-(--text-primary) text-balance sm:text-xl'>{title}</h2>
            <p className="relative z-10 text-sm leading-relaxed text-pretty text-(--text-secondary)">{description}</p>
            <span aria-hidden="true" className='pointer-events-none absolute right-3 bottom-0 z-0 text-7xl font-bold tracking-tighter text-(--text-primary) opacity-[0.05] transition-opacity duration-300 select-none group-hover:opacity-[0.09] sm:right-4 sm:bottom-1 sm:text-8xl'>{bgText}</span>
        </div>
    )
}
