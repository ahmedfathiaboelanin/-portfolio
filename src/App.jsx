/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HomeSection from './sections/HomeSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import ContactSection from './sections/ContactSection'
import Footer from './components/Footer'


function App() {
  return (
    <main className="bg-(--neutral) w-full text-(--primary) font-(--heading-font)">
      <div className="fixed top-0 left-0 z-10 bg-(--neutral)/50 backdrop-blur-3xl shadow-2xl w-full h-screen"></div>

      <Navbar />
      <HomeSection />
      <SkillsSection />
      <ProjectsSection/>
      <ContactSection />
      <Footer/>
    </main>
  )
}

export default App
