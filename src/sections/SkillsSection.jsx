import React from 'react'
import Tag from '../components/Tag'
import TechCard from '../components/TechCard'
import { FaTools } from 'react-icons/fa'
import ToolTag from '../components/ToolTag'

const tools = [
    "REACT ICONS",
    "ZUSTAND",
    "MONGOOSE",
    "JWT",
    "VS CODE",
    "POSTMAN",
    "XAMMP",
    "GIT"
]

const frontendSkills = [
    { title: "HTML", percentage: '95%' },
    { title: "CSS", percentage: '90%' },
    { title: "JS", percentage: '90%' },
    { title: "REACt JS", percentage: '90%' },
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

export default function SkillsSection() {
    return (
        <section id='skills' className="w-full flex flex-col relative h-full overflow-x-hidden  px-5 p-20 md:p-20 z-10" >
            <div className="w-100 h-100 rounded-full bg-(--primary) shadow-[-180px_20px_300px_rgba(0,240,255,.2)] absolute -right-100 bottom-50"></div>
            <div className="w-full flex flex-col gap-5">
                <Tag title="TECHNICAL ARSENAL" />
                <h2 className="text-5xl font-semibold text-(--text-primary)">
                    Expertise &
                    <span className="text-5xl font-semibold text-(--primary)">
                        {" "}Stack
                    </span>
                </h2>
                <p className="text-lg text-(--text-secondary) max-w-3xl">
                    A meticulous assembly of modern tools and frameworks used to architect
                    high-performance digital experiences. Focused on scalability, type-safety, and
                    precision.
                </p>
            </div>
            <div className="flex gap-5 mt-10 flex-wrap xl:flex-nowrap ">
                <div className="flex flex-col flex-1 justify-center border-(--muted) border shadow-2xl p-10 rounded gap-2 relative bg-(--muted)/15 backdrop-blur-xl">
                    <h3 className='text-2xl'>Frontend Engineering</h3>
                    <p className="text-(--text-secondary) max-w-112.5 relative z-10">Building immersive, responsive, and accessible interfaces.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-5 mt-5">
                        {frontendSkills.map((skill, index) => (
                            <TechCard key={index} title={skill.title} percentage={skill.percentage} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col flex-1 justify-center border-(--muted) border shadow-2xl p-10 rounded gap-2 relative bg-(--muted)/15 backdrop-blur-xl">
                    <h3 className='text-2xl'>Backend Engineering</h3>
                    <p className="text-(--text-secondary) max-w-112.5 relative z-10">Designing robust and scalable server-side solutions.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5 mt-5">
                        {backendSkills.map((skill, index) => (
                            <TechCard key={index} title={skill.title} percentage={skill.percentage} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 mt-5 justify-center border-(--muted) border shadow-2xl p-10 rounded gap-2 relative bg-(--muted)/15 backdrop-blur-xl">
                <h3 className='text-2xl text-(--text-primary) flex items-center gap-3'>
                    <FaTools />
                    WORKING TOOLS
                </h3>
                <div className="flex libs mt-5 gap-2 md:gap-5 flex-wrap">
                    {tools.map((tool, index) => (
                        <ToolTag key={index} title={tool} />
                    ))}
                </div>
            </div>
        </section>
    )
}
