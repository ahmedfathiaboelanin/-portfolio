import { useEffect, useState } from 'react'
import { FaMoon, FaSun, FaTimes } from 'react-icons/fa'
import { IoIosMenu } from 'react-icons/io';

const LINKS = [
    { id: 'home', label: 'HOME' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'contact', label: 'CONTACT' },
]

export default function Navbar() {
    const [isLightMode, setIsLightMode] = useState(false);
    const [activeTab, setActiveTab] = useState('home')
    const [isMenueOpen, setIsMenueOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [])

    // Scroll-spy: highlight the section currently in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveTab(entry.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        LINKS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [])

    // Close the mobile menu when resizing up to desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) setIsMenueOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [])

    const toggleTheme = () => {
        document.body.classList.toggle('light-mode');
        setIsLightMode(!isLightMode);
    }

    const toggleMenue = () => {
        setIsMenueOpen(!isMenueOpen)
    }

    return (
        <header className={`sticky top-0 left-0 z-50 w-full border-b transition-all duration-300 ${scrolled
            ? 'border-(--card-border) bg-(--neutral)/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.4)] backdrop-blur-xl'
            : 'border-transparent bg-(--neutral)/40 backdrop-blur-md'
            }`}>
            <nav className="container-x flex min-h-16 items-center justify-between gap-2 py-3 sm:min-h-[4.5rem]">
                <a href="#home" onClick={() => setActiveTab('home')} className="group flex min-w-0 shrink items-center gap-2 text-lg font-semibold tracking-wide text-(--text-primary) sm:text-xl">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(--btn-primary-bg) font-bold text-(--btn-primary-text) transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">A</span>
                    <span className="truncate">Ahmed Fathi<span className="text-(--primary)">.</span></span>
                </a>
                <div className="hidden items-center gap-1 rounded-full border border-(--card-border) bg-(--surface)/60 px-2 py-1.5 backdrop-blur-xl lg:flex">
                    {LINKS.map((link) => (
                        <a
                            key={link.id}
                            onClick={() => { setActiveTab(link.id) }}
                            href={`#${link.id}`}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium tracking-wider transition-all duration-200 ${activeTab === link.id
                                ? 'bg-(--primary-soft) text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border-primary)]'
                                : 'text-(--link-secondary-text) hover:bg-(--muted)/40 hover:text-(--text-primary)'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="grid h-11 w-11 place-items-center rounded-full border border-(--card-border) bg-(--surface)/70 text-lg backdrop-blur-xl hover:-translate-y-0.5 hover:border-(--border-primary)"
                    >
                        {isLightMode ? <FaSun className='text-(--tertiary)' /> : <FaMoon className='text-(--btn-secondary-text)' />}
                    </button>
                    <a href='Ahmed_Fathi.pdf' target='_blank' rel="noreferrer" className="btn-primary hidden rounded-full px-6 py-2.5 text-sm font-semibold tracking-wider lg:inline-flex">RESUME</a>
                    <button
                        onClick={toggleMenue}
                        aria-label={isMenueOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenueOpen}
                        className='grid h-11 w-11 place-items-center rounded-full border border-(--card-border) bg-(--surface)/70 hover:cursor-pointer hover:border-(--border-primary) lg:hidden'
                    >
                        {isMenueOpen ? <FaTimes className='text-xl text-(--text-primary)' /> : <IoIosMenu className='text-2xl text-(--text-primary)' />}
                    </button>
                </div>
            </nav>
            <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden ${isMenueOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="container-x flex flex-col gap-1 pb-5">
                    {LINKS.map((link) => (
                        <a
                            key={link.id}
                            onClick={() => { setIsMenueOpen(false); setActiveTab(link.id) }}
                            href={`#${link.id}`}
                            aria-current={activeTab === link.id ? 'true' : undefined}
                            className={`rounded-xl px-4 py-3.5 text-sm font-medium tracking-wider transition-colors ${activeTab === link.id
                                ? 'bg-(--primary-soft) text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border-primary)]'
                                : 'text-(--link-secondary-text) hover:bg-(--muted)/40 hover:text-(--text-primary)'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a href='Ahmed_Fathi.pdf' target='_blank' rel="noreferrer" className="btn-primary mt-2 rounded-xl px-4 py-3.5 text-center text-sm font-semibold tracking-wider">RESUME</a>
                </div>
            </div>
        </header>
    )
}
