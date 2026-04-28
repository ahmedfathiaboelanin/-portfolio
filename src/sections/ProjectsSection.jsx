import React from 'react'
import { FaCode, FaEye } from 'react-icons/fa'
import Tag from '../components/Tag'
import PROJECTS from '../static/constants/projects'


export default function ProjectsSection() {
    return (
        <section id='projects' className="w-full flex flex-col relative h-full items-center overflow-x-hidden p-5 md:p-20 z-10" >
            <div className="w-100 h-100 rounded-full bg-(--primary) shadow-[180px_20px_300px_rgba(0,240,255,.2)] absolute -left-100 bottom-50"></div>
            <div className="w-full flex flex-col gap-5 ">
                <div className="flex flex-wrap gap-5 justify-between items-center">
                    <h2 className="text-3xl font-semibold text-(--text-primary)">
                        SOME OF MY <span className="text-(--primary)">PROJECTS</span>
                    </h2>
                    <a target='_lank' href="https://github.com/ahmedfathiaboelanin" className="text-(--text-secondary) border border-(--muted) px-5 py-1 rounded-xs bg-(--btn-secondary-bg) flex gap-2 items-center"><FaEye /> VIEW ALL REPOS</a>
                </div>
                <div className="flex flex-wrap md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    <div key={PROJECTS[0].title} className="w-full col-span-2 bg-(--muted)/60 backdrop-blur-2xl p-5 rounded-sm shadow-xl">
                        <img src={PROJECTS[0].image} alt={PROJECTS[0].title} className="w-full h-50 object-contain rounded" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">{PROJECTS[0].title}</h3>
                            <p className="text-(--text-secondary) mt-2">{PROJECTS[0].description}</p>
                        </div>
                        <div className="links flex gap-4">
                            <a target='_lank' href={PROJECTS[0].link} className="bg-(--btn-secondary-bg) px-5 py-1 flex gap-2 items-center rounded-xs text-(--btn-secondary-text) border border-(--muted)"><FaEye />View </a>
                            <a target='_lank' href={PROJECTS[0].code} className="bg-(--btn-secondary-bg) px-5 py-1 flex gap-2 items-center rounded-xs text-(--btn-secondary-text) border border-(--muted)"><FaCode /> Code</a>
                        </div>
                    </div>
                    {PROJECTS.slice(1).map((project, index) => (
                        <div key={index} className="w-full bg-(--muted)/60  p-5 rounded-sm shadow-xl">
                            <img src={project.image} alt={project.title} className="w-full h-37.5 object-cover rounded" />
                            <div className="my-3">
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <p className="text-(--text-secondary) mt-2">{project.description}</p>
                            </div>
                            {/* <div className="flex gap-2">
                                {
                                    project.tech.map(tech=> <Tag title={tech}/>)
                                }
                            </div> */}
                            <div className="links flex gap-4">
                                <a target='_lank' href={project.link} className="bg-(--btn-secondary-bg) px-5 py-1 flex gap-2 items-center rounded-xs text-(--btn-secondary-text) border border-(--muted)"><FaEye />View </a>
                                <a target='_lank' href={project.code} className="bg-(--btn-secondary-bg) px-5 py-1 flex gap-2 items-center rounded-xs text-(--btn-secondary-text) border border-(--muted)"><FaCode /> Code</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex w-full flex-col items-center border-(--muted) border mt-20 p-10 rounded gap-5 relative bg-(--muted)/15 backdrop-blur-xl">
                <h3 className="text-xl md:text-4xl text-(--text-primary)">INITIATE_COLLABORATION</h3>
                <p className="text-(--text-secondary) mt-3 text-center max-w-2xl">
                    Interested in architectural solutions for complex digital challenges? Let's
                    discuss your next high-performance system.
                </p>
                <div className="flex flex-wrap justify-center gap-5">
                    <a href="#contact" className='bg-(--btn-primary-bg) px-5 py-3 flex gap-2 items-center rounded-xs text-(--btn-primary-text) border border-(--muted)'>ESTABLISH_CONTACT</a>
                    <a href="" className='bg-(--btn-secondary-bg) px-5 py-3 flex gap-2 items-center rounded-xs text-(--btn-secondary-text) border border-(--muted)'>VIEW RESUME</a>
                </div>
            </div>
        </section>
    )
}
