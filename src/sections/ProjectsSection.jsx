import { FaCode, FaEye, FaArrowRight } from 'react-icons/fa'
import Tag from '../components/Tag'
import PROJECTS from '../static/constants/projects'

function ProjectCard({ project, featured = false }) {
    return (
        <article className={`card-hover glass group flex min-w-0 flex-col overflow-hidden rounded-2xl ${featured ? 'sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-2' : ''}`}>
            <div className="relative aspect-video w-full overflow-hidden bg-(--surface-2)">
                <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:p-6 lg:p-8">
                {project.tech && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.tech.map((tech) => (
                            <span key={tech} className="rounded-full border border-(--card-border) bg-(--primary-soft) px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-(--text-secondary) sm:px-3 sm:tracking-[0.14em]">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
                <h3 className="text-lg font-semibold tracking-wide text-balance text-(--text-primary) sm:text-xl">{project.title}</h3>
                <p className="line-clamp-4 text-[13px] leading-relaxed text-pretty text-(--text-secondary) sm:text-sm">{project.description}</p>
                <div className="mt-auto flex flex-wrap gap-2.5 pt-4 sm:gap-3">
                    <a target='_blank' rel="noreferrer" href={project.link} className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider min-[420px]:flex-none">
                        <FaEye /> VIEW
                    </a>
                    <a target='_blank' rel="noreferrer" href={project.code ?? project.conde} className="btn-ghost inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider min-[420px]:flex-none">
                        <FaCode /> CODE
                    </a>
                </div>
            </div>
        </article>
    )
}

export default function ProjectsSection() {
    if (!PROJECTS.length) return null;
    const [featured, ...rest] = PROJECTS;

    return (
        <section id='projects' className="relative flex h-full w-full flex-col items-center overflow-x-clip" >
            <div className="container-x section-pad relative z-10">
                <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
                    <Tag title="SELECTED WORK" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-5">
                        <h2 className="h-section font-semibold">
                            <span className="text-(--text-primary)">SOME OF MY </span>
                            <span className="text-gradient">PROJECTS</span>
                        </h2>
                        <a target='_blank' rel="noreferrer" href="https://github.com/ahmedfathiaboelanin" className="btn-ghost group inline-flex min-h-11 w-max items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider">
                            <FaEye /> VIEW ALL REPOS
                            <FaArrowRight className="text-[10px] transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-5 md:gap-6 lg:grid-cols-3">
                        <ProjectCard project={featured} featured />
                        {rest.map((project, index) => (
                            <ProjectCard key={project.title ?? index} project={project} />
                        ))}
                    </div>
                </div>

                <div className="glass card-hover relative mt-10 flex w-full min-w-0 flex-col items-center gap-3 overflow-hidden rounded-2xl p-6 text-center sm:mt-14 sm:gap-4 sm:rounded-3xl sm:p-8 md:p-12">
                    <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[min(36rem,130vw)] -translate-x-1/2 rounded-full bg-(--primary) opacity-15 blur-[100px]" />
                    <p className="relative font-mono text-[10px] tracking-[0.24em] text-(--primary) sm:text-[11px] sm:tracking-[0.3em]">INITIATE_COLLABORATION</p>
                    <h3 className="h-card relative max-w-2xl font-semibold text-(--text-primary)">Have a complex digital challenge? Let's architect the solution.</h3>
                    <p className="relative max-w-2xl text-[13px] leading-relaxed text-pretty text-(--text-secondary) sm:text-sm md:text-base">
                        Interested in architectural solutions for complex digital challenges? Let's
                        discuss your next high-performance system.
                    </p>
                    <div className="relative mt-1 flex w-full flex-col gap-2.5 min-[480px]:w-auto min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:justify-center sm:mt-2 sm:gap-3">
                        <a href="#contact" className='btn-primary inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-center text-[13px] font-semibold tracking-wider sm:px-7 sm:text-sm'>ESTABLISH_CONTACT</a>
                        <a href="Ahmed_Fathi.pdf" target="_blank" rel="noreferrer" className='btn-ghost inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-center text-[13px] font-semibold tracking-wider sm:px-7 sm:text-sm'>VIEW RESUME</a>
                    </div>
                </div>
            </div>
        </section>
    )
}
