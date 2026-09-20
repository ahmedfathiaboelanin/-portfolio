import { useState } from 'react'
import { FaFacebook, FaGithub, FaLinkedin, FaPaperPlane, FaCheck } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'
import Tag from '../components/Tag'

const SOCIALS = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmed-fathi-1a4593247/', icon: FaLinkedin },
    { label: 'GitHub', href: 'https://github.com/ahmedfathiaboelanin', icon: FaGithub },
    { label: 'Facebook', href: 'https://www.facebook.com/ahmed.fathi.912811', icon: FaFacebook },
]

export default function ContactSection() {
    const [sent, setSent] = useState(false);

    return (
        <section id='contact' className="relative flex h-full w-full flex-col overflow-x-clip" >
            <div className="container-x section-pad relative z-10">
                <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 xl:gap-12">
                    <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
                        <Tag title="GET IN TOUCH" />
                        <h2 className="h-section font-semibold">
                            <span className="text-(--text-primary)">Initiate </span>
                            <span className="text-gradient">Contact</span>
                        </h2>
                        <p className="max-w-2xl text-[15px] leading-relaxed text-pretty text-(--text-secondary) sm:text-base md:text-lg">
                            Currently open to front-end, back-end, or full-stack web development opportunities,
                            focused on building scalable, high-performance applications with modern technologies.
                        </p>

                        <form
                            action="mailto:ahmedfathiaboelanin@gmail.com"
                            method="post"
                            encType="text/plain"
                            onSubmit={() => setSent(true)}
                            className="glass mt-4 flex w-full min-w-0 flex-col gap-4 rounded-2xl p-5 sm:mt-6 sm:p-6 md:p-8"
                        >
                            <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2">
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <label htmlFor="contact-name" className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">YOUR NAME</label>
                                    <input id="contact-name" name="name" required autoComplete="name" type="text" placeholder="John Doe" className="field" />
                                </div>
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <label htmlFor="contact-email" className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">YOUR EMAIL</label>
                                    <input id="contact-email" name="email" required autoComplete="email" type="email" placeholder="john@example.com" className="field" />
                                </div>
                            </div>
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="contact-message" className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">YOUR MESSAGE</label>
                                <textarea id="contact-message" name="message" required rows={5} placeholder="Tell me about your project..." className="field min-h-32 resize-y"></textarea>
                            </div>
                            <button type="submit" className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-center text-xs font-semibold tracking-wider text-balance sm:text-sm">
                                <span className="shrink-0">{sent ? <FaCheck /> : <FaPaperPlane />}</span>
                                <span>{sent ? 'MESSAGE READY — CHECK YOUR MAIL APP' : 'SEND MESSAGE'}</span>
                            </button>
                        </form>
                    </div>

                    <aside className="glass h-max min-w-0 rounded-2xl p-5 sm:p-6 md:p-8 lg:sticky lg:top-24">
                        <p className="font-mono text-[10px] tracking-[0.24em] text-(--primary) sm:text-[11px] sm:tracking-[0.3em]">SOCIAL FOOTPRINT</p>
                        <h3 className="mt-2 text-xl font-semibold text-balance text-(--text-primary) sm:text-2xl">Let's connect</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-pretty text-(--text-secondary) sm:text-sm">Feel free to connect with me on any of the platforms below!</p>
                        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3">
                            {SOCIALS.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-(--card-border) bg-(--surface)/60 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-primary) hover:shadow-[0_10px_30px_-12px_var(--primary-glow)] sm:gap-4 sm:px-5"
                                >
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-(--primary-soft) text-lg text-(--primary) shadow-[inset_0_0_0_1px_var(--border-primary)] transition-transform duration-200 group-hover:scale-110">
                                        <Icon />
                                    </span>
                                    <span className="truncate font-medium text-(--text-primary)">{label}</span>
                                    <span aria-hidden="true" className="ml-auto shrink-0 text-(--text-secondary) transition-transform duration-200 group-hover:translate-x-1">→</span>
                                </a>
                            ))}
                            <a
                                href="mailto:ahmedfathiaboelanin@gmail.com"
                                className="group flex min-w-0 items-center gap-3 rounded-xl border border-(--card-border) bg-(--surface)/60 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-primary) hover:shadow-[0_10px_30px_-12px_var(--primary-glow)] sm:gap-4 sm:px-5"
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-(--primary-soft) text-lg text-(--primary) shadow-[inset_0_0_0_1px_var(--border-primary)] transition-transform duration-200 group-hover:scale-110">
                                    <SiGmail />
                                </span>
                                <span className="min-w-0 text-[13px] break-all text-(--text-primary) sm:text-sm">ahmedfathiaboelanin@gmail.com</span>
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}
