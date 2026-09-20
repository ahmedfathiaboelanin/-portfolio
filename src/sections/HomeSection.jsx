import { FaPaintBrush, FaServer, FaArrowRight } from 'react-icons/fa'
import { MdTerminal } from 'react-icons/md'
import Tag from '../components/Tag'
import ServicesCard from '../components/ServicesCard'

const STATS = [
    { value: '1+', label: 'YEARS EXP' },
    { value: '10+', label: 'PROJECTS' },
    { value: '3+', label: 'CLIENTS' },
]

function HomeSection() {
    return (
        <section className="relative flex h-full w-full items-center justify-center overflow-x-clip" id='home' >
            <div className="container-x section-pad relative z-10 flex w-full flex-col items-stretch justify-between gap-10 sm:gap-12 lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
                    <div className="animate-rise min-w-0">
                        <Tag title="Hello, I'm Ahmed — Frontend Developer" />
                    </div>
                    <h1 className="h-display animate-rise animate-rise-1 font-semibold">
                        <span className="block text-(--text-primary)">Building the future,</span>
                        <span className="text-gradient block">one line at a time</span>
                    </h1>
                    <p className="animate-rise animate-rise-2 max-w-md text-[15px] leading-relaxed text-pretty text-(--text-secondary) sm:text-base md:text-lg">
                        A passionate Frontend Developer with a knack for crafting engaging,
                        fast and user-friendly web experiences.
                    </p>
                    <div className="animate-rise animate-rise-3 flex flex-col gap-3 pt-1 min-[420px]:flex-row min-[420px]:flex-wrap">
                        <a href='#projects' className="btn-primary group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-[13px] font-semibold tracking-wider sm:w-max sm:px-7 sm:text-sm">
                            VIEW MY WORK
                            <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                        <a href='#contact' className="btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-center text-[13px] font-semibold tracking-wider sm:w-max sm:px-7 sm:text-sm">LET'S CONNECT</a>
                    </div>

                    <div className="animate-rise animate-rise-4 mt-6 max-w-md sm:mt-8">
                        <div className="h-px w-full bg-gradient-to-r from-(--border-primary) via-(--muted) to-transparent"></div>
                        <dl className="grid grid-cols-3 gap-4 pt-5 sm:gap-8 sm:pt-6">
                            {STATS.map((stat) => (
                                <div key={stat.label} className="flex min-w-0 flex-col gap-1">
                                    <dt className="order-2 font-mono text-[10px] tracking-[0.16em] text-(--text-secondary) sm:text-[11px] sm:tracking-[0.2em]">{stat.label}</dt>
                                    <dd className="order-1 text-2xl font-semibold text-(--text-primary) tabular-nums sm:text-3xl">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div className="animate-rise animate-rise-2 w-full min-w-0 flex-1 lg:max-w-md xl:max-w-lg">
                    <div className="animate-float-slow">
                        <ServicesCard
                            title="Web Developer"
                            description="Building modular, robust foundations for web-scale applications."
                            icon={MdTerminal}
                            bgText="JS"
                        />
                    </div>
                    <div className="mt-4 grid w-full grid-cols-1 gap-4 min-[560px]:grid-cols-2 sm:mt-5 sm:gap-5">
                        <ServicesCard
                            title="Front-end Dev"
                            description="Crafting visually stunning and intuitive user interfaces that captivate and engage."
                            icon={FaPaintBrush}
                            bgText="UI"
                        />
                        <ServicesCard
                            title="Back-end Dev"
                            description="Designing and implementing scalable backend systems and APIs."
                            icon={FaServer}
                            bgText="API"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeSection
