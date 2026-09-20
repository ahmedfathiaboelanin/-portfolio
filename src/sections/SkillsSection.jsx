import Tag from '../components/Tag'
import TechCard from '../components/TechCard'
import { FaTools, FaCode, FaServer } from 'react-icons/fa'
import ToolTag from '../components/ToolTag'

const tools = [
    "REACT ICONS",
    "ZUSTAND",
    "MONGOOSE",
    "JWT",
    "VS CODE",
    "POSTMAN",
    "XAMPP",
    "GIT"
]

const frontendSkills = [
    { title: "HTML", percentage: '95%' },
    { title: "CSS", percentage: '90%' },
    { title: "JS", percentage: '90%' },
    { title: "REACT JS", percentage: '90%' },
    { title: "TAILWIND CSS", percentage: '90%' },
    { title: "NEXT JS", percentage: '80%' },
]

const backendSkills = [
    { title: "NODE JS", percentage: '85%' },
    { title: "EXPRESS JS", percentage: '80%' },
    { title: "MONGODB", percentage: '80%' },
    { title: "LARAVEL", percentage: '80%' },
    { title: "MYSQL", percentage: '75%' },
]

function SkillPanel({ icon: Icon, title, subtitle, children }) {
    return (
        <div className="glass card-hover flex min-w-0 flex-1 flex-col rounded-2xl p-5 sm:p-6 md:p-9">
            <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-(--primary-soft) text-base text-(--primary) shadow-[inset_0_0_0_1px_var(--border-primary)] sm:h-11 sm:w-11 sm:text-lg">
                    <Icon />
                </span>
                <div className="min-w-0">
                    <h3 className='truncate text-lg font-semibold text-(--text-primary) sm:text-xl'>{title}</h3>
                    <p className="truncate text-xs text-(--text-secondary) sm:text-sm">{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    )
}

export default function SkillsSection() {
    return (
        <section id='skills' className="relative flex h-full w-full flex-col overflow-x-clip" >
            <div className="container-x section-pad relative z-10">
                <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4">
                    <Tag title="TECHNICAL ARSENAL" />
                    <h2 className="h-section font-semibold">
                        <span className="text-(--text-primary)">Expertise & </span>
                        <span className="text-gradient">Stack</span>
                    </h2>
                    <p className="max-w-3xl text-[15px] leading-relaxed text-pretty text-(--text-secondary) sm:text-base md:text-lg">
                        A meticulous assembly of modern tools and frameworks used to architect
                        high-performance digital experiences. Focused on scalability, type-safety, and
                        precision.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2">
                    <SkillPanel icon={FaCode} title="Frontend Engineering" subtitle="Immersive, responsive, accessible interfaces.">
                        <div className="mt-5 grid w-full grid-cols-1 gap-1.5 min-[560px]:grid-cols-2 sm:mt-6 sm:gap-2 xl:grid-cols-3 min-[560px]:xl:grid-cols-2 2xl:grid-cols-3">
                            {frontendSkills.map((skill, index) => (
                                <TechCard key={index} title={skill.title} percentage={skill.percentage} />
                            ))}
                        </div>
                    </SkillPanel>
                    <SkillPanel icon={FaServer} title="Backend Engineering" subtitle="Robust, scalable server-side solutions.">
                        <div className="mt-5 grid w-full grid-cols-1 gap-1.5 min-[560px]:grid-cols-2 sm:mt-6 sm:gap-2">
                            {backendSkills.map((skill, index) => (
                                <TechCard key={index} title={skill.title} percentage={skill.percentage} />
                            ))}
                        </div>
                    </SkillPanel>
                </div>

                <div className="glass card-hover mt-4 flex flex-1 flex-col rounded-2xl p-5 sm:mt-5 sm:p-6 md:p-9">
                    <h3 className='flex min-w-0 items-center gap-3 text-base font-semibold tracking-wider text-(--text-primary) sm:text-lg'>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(--primary-soft) text-sm text-(--primary) shadow-[inset_0_0_0_1px_var(--border-primary)] sm:h-10 sm:w-10 sm:text-base">
                            <FaTools />
                        </span>
                        <span className="truncate">WORKING TOOLS</span>
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
                        {tools.map((tool, index) => (
                            <ToolTag key={index} title={tool} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
