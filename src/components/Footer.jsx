import { FaGithub, FaLinkedin, FaArrowUp } from 'react-icons/fa'

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className='relative z-10 w-full overflow-hidden border-t border-(--card-border) bg-(--surface)/50 backdrop-blur-xl'>
            <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-center sm:py-7 min-[640px]:flex-row min-[640px]:text-left">
                <p className='max-w-full font-mono text-[11px] leading-relaxed tracking-[0.14em] text-balance text-(--text-secondary) sm:text-xs sm:tracking-[0.18em]'>
                    © {year} <span className="font-semibold text-(--text-primary)">AHMED FATHI</span> — CRAFTED WITH PRECISION
                </p>
                <div className="flex shrink-0 items-center gap-2.5">
                    <a
                        href="https://github.com/ahmedfathiaboelanin"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="grid h-11 w-11 place-items-center rounded-full border border-(--card-border) text-(--text-secondary) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-primary) hover:text-(--text-primary)"
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/ahmed-fathi-1a4593247/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="grid h-11 w-11 place-items-center rounded-full border border-(--card-border) text-(--text-secondary) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-primary) hover:text-(--text-primary)"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="#home"
                        aria-label="Back to top"
                        className="btn-primary grid h-11 w-11 place-items-center rounded-full text-sm"
                    >
                        <FaArrowUp />
                    </a>
                </div>
            </div>
        </footer>
    )
}
