import React from 'react'
import { FaPaintBrush, FaServer } from 'react-icons/fa'
import { MdTerminal } from 'react-icons/md'
import Tag from '../components/Tag'
import ServicesCard from '../components/ServicesCard'

function HomeSection() {
    return (
        <section className="w-full flex items-center justify-center overflow-x-hidden relative h-full" id='home' >
            <div className="w-100 h-100 rounded-full bg-(--primary) shadow-[180px_20px_1500px_rgba(0,240,255,.9)] absolute -left-100 top-40"></div>

            <div className="flex justify-evenly gap-10 flex-wrap lg:flex-nowrap w-full h-full  relative z-10  px-5 py-20 md:p-20">
                <div className="flex flex-3/2 flex-col gap-4">
                    <Tag title="Hello, I'm Ahmed" />
                    <h2 className="text-5xl font-semibold text-(--text-primary)">
                        Building the future,
                    </h2>
                    <h2 className="text-5xl font-semibold text-(--primary)">
                        one line at a time
                    </h2>
                    <p className="text-lg text-(--text-secondary) max-w-md">A passionate Frontend Developer with a knack for crafting engaging and user-friendly web experiences.</p>
                    <div className="flex flex-wrap gap-4">
                        <a href='#projects' className="hover:cursor-pointer border-(--border-secondary) border bg-(--btn-primary-bg) text-(--btn-primary-text) px-6 py-2 w-max">VIEW MY WORK</a>
                        <a href='#contact' className="hover:cursor-pointer border-(--border-secondary) border text-(--btn-secondary-text) px-6 py-2 w-max">LET'S CONNECT</a>
                    </div>

                    <div className="max-w-120 h-px bg-(--muted) mt-10"></div>
                    <div className="flex gap-4">
                        <div className="stats flex flex-col gap-1 pr-5 border-r border-(--muted) ">
                            <h3 className="text-2xl  text-(--text-primary)">1+</h3>
                            <p className="text-(--text-secondary) text-xs">YEARS EXP
                            </p>
                        </div>
                        <div className="stats flex flex-col gap-1 pr-5 border-r border-(--muted) ">
                            <h3 className="text-2xl text-(--text-primary)">10+</h3>
                            <p className="text-(--text-secondary) text-xs">PROJECTS</p>
                        </div>
                        <div className="stats flex flex-col gap-1 pr-5 ">
                            <h3 className="text-2xl text-(--text-primary)">3+</h3>
                            <p className="text-(--text-secondary) text-xs">CLIENTS</p>
                        </div>
                    </div>

                </div>
                <div className="relative">
                    <ServicesCard
                        title="Web developer"
                        description="Building modular, robust foundations for web-scale applications."
                        icon={MdTerminal}
                        bgText="JS"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 w-full">
                        <ServicesCard
                            title="Front-end Dev"
                            description="Crafting visually stunning and intuitive user interfaces that captivate and engage."
                            icon={FaPaintBrush}
                            bgText="UI"
                        />
                        <ServicesCard
                            title="BACK-END DEV"
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