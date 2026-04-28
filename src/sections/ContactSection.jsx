import React from 'react'
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'

export default function ContactSection() {
    return (
        <section id='contact' className="w-full flex flex-col relative h-full overflow-x-hidden p-5 md:p-20 z-10" >
            <div className="w-100 h-100 rounded-full bg-(--primary) shadow-[180px_20px_300px_rgba(0,240,255,.2)] absolute -left-100 bottom-50"></div>
            <div className="flex flex-wrap gap-10 items-start justify-center lg:justify-between w-full h-full relative z-10">
                <div className="flex flex-col gap-4 mt-10 relative z-10">
                    <h2 className="text-4xl text-(--text-primary) mb-5 relative z-10">INITIATE CONTACT</h2>
                    <p className="text-lg text-(--text-secondary) max-w-2xl relative z-10">
                        Currently open to front-end, back-end, or full-stack web development opportunities, focused on building scalable, high-performance applications with modern technologies.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-10 relative z-10">
                        <form action="mailto:ahmedfathiaboelanin@gmail.com" method="post" encType="multipart/form-data" className="flex flex-col gap-4 w-full">
                            <input type="text" placeholder="Your Name" className="bg-(--muted)/80 backdrop-blur-2xl p-3 outline-none border-b-3 border-(--muted) text-(--text-secondary)" />
                            <input type="email" placeholder="Your Email" className="bg-(--muted)/80 backdrop-blur-2xl p-3 outline-none border-b-3 border-(--muted) text-(--text-secondary)" />
                            <textarea placeholder="Your Message" className="bg-(--muted)/80 backdrop-blur-2xl p-3 outline-none border-b-3 border-(--muted) text-(--text-secondary)"></textarea>
                            <button type="submit" className="text-(--text-secondary) text-center border-3 border-(--muted) px-5 py-3 rounded bg-(--btn-secondary-bg)">
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
                <div className="p-5 border-3 border-(--muted) rounded bg-(--btn-secondary-bg)">
                    <h4>SOCIAL FOOTPRINT</h4>
                    <p className="text-(--text-secondary)">Feel free to connect with me on any of the platforms below!</p>
                    <div className="flex flex-col gap-4 mt-5">
                        <a href="https://www.linkedin.com/in/ahmed-fathi-1a4593247/" target="_blank" rel="noopener noreferrer" className="text-(--text-secondary) border-3 border-(--muted) px-5 py-3 rounded bg-(--btn-secondary-bg) flex flex-1 items-center gap-2 text-xl">
                            <FaLinkedin />LinkedIn
                        </a>
                        <a href="https://github.com/ahmedfathiaboelanin" target="_blank" rel="noopener noreferrer" className="text-(--text-secondary) border-3 border-(--muted) px-5 py-3 rounded bg-(--btn-secondary-bg) flex flex-1 items-center gap-2 text-xl">
                            <FaGithub />GitHub
                        </a>
                        <a href="https://www.facebook.com/ahmed.fathi.912811" target="_blank" rel="noopener noreferrer" className="text-(--text-secondary) border-3 border-(--muted) px-5 py-3 rounded bg-(--btn-secondary-bg) flex flex-1 items-center gap-2 text-xl">
                            <FaFacebook />Facebook
                        </a>
                        <span className="text-(--text-secondary) border-3 border-(--muted) px-5 py-3 rounded bg-(--btn-secondary-bg) flex  items-center gap-2 text-sm md:text-xl flex-wrap">
                            <SiGmail />
                            <span>ahmedfathiaboelanin@gmail.com</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
