import React, { useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { IoIosMenu } from 'react-icons/io';

export default function Navbar() {
    const [isLightMode, setIsLightMode] = useState(false);
    const [activeTab, setActiveTab] = useState('home')
    const [isMenueOpen, setIsMenueOpen] = useState(false)
    const handleActiveTab = (tab) => {
        setActiveTab(tab)
    }

    const toggleTheme = () => {
        document.body.classList.toggle('light-mode');
        setIsLightMode(!isLightMode);
    }

    const toggleMenue = () => {
        setIsMenueOpen(!isMenueOpen)
    }

    return (
        <header className="w-full shadow-[0px_10px_10px_rgba(0,0,0,0.1)] sticky bg-(--neutral)/30 backdrop-blur-2xl border-b-(--muted) border-b  top-0 left-0 z-50">
            <nav className="flex items-center justify-between py-4 px-8">
                <div className="text-(--text-primary) text-xl">
                    Ahmed Fathi
                </div>
                <div className="links hidden lg:flex gap-6">
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'home' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={()=>{ setActiveTab('home')}} href="#home">HOME</a>
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'skills' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={()=>{ setActiveTab('skills')}} href="#skills">SKILLS</a>
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'projects' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={()=>{ setActiveTab('projects')}} href="#projects">PROJECTS</a>
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'contact' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={()=>{ setActiveTab('contact')}} href="#contact">CONTACT</a>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-xl" onClick={toggleTheme}>
                        {
                            isLightMode ? <FaSun className='text-(--tertiary)' /> : <FaMoon className='text-(--btn-secondary-text)' />
                        }
                    </button>
                    <a href='Ahmed-Fathi-ATS.pdf' target='_blank' className="bg-(--btn-primary-bg) text-(--btn-primary-text) hidden lg:flex text-sm px-6 py-2">RESUME</a>
                    <button onClick={toggleMenue} className='flex lg:hidden items-center justify-center hover:cursor-pointer'>
                        <IoIosMenu className='text-(--text-primary) text-2xl'/>
                    </button>
                </div>
                <div className={`absolute top-15 left-0 w-full flex flex-col lg:hidden gap-2 bg-(--neutral)/90 backdrop-blur-2xl overflow-hidden transition-all shadow-2xl ${isMenueOpen ? 'h-max p-5' : 'h-0 p-0'}`}>
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'home' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={() => { setIsMenueOpen(false); setActiveTab('home') }} href="#home">HOME</a>
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'skills' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={() => { setIsMenueOpen(false); setActiveTab('skills') }} href="#skills">SKILLS</a>
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'projects' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={() => { setIsMenueOpen(false); setActiveTab('projects') }} href="#projects">PROJECTS</a>
                    <a className={`text-md hover:text-(--link-primary-text) ${activeTab == 'contact' ? 'text-(--link-primary-text)' : 'text-(--link-secondary-text)'}`} onClick={() => { setIsMenueOpen(false); setActiveTab('contact') }} href="#contact">CONTACT</a>
                </div>
            </nav>
        </header>
    )
}
