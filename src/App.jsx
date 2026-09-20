/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import Navbar from './components/Navbar'
import HomeSection from './sections/HomeSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import ContactSection from './sections/ContactSection'
import Footer from './components/Footer'


function App() {
  return (
    <main className="relative min-h-screen w-full overflow-clip bg-(--neutral) text-(--text-primary)">
      {/* Ambient background — grid + soft glows, non-interactive.
          Widths use min() so glows never exceed the viewport on phones. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-24 left-1/2 h-56 w-[min(42rem,120vw)] -translate-x-1/2 rounded-full bg-(--primary) opacity-10 blur-[100px] sm:-top-32 sm:h-72 sm:opacity-15 sm:blur-[120px]" />
        <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-(--primary) opacity-10 blur-[90px] sm:-left-40 sm:h-96 sm:w-96 sm:blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-(--primary) opacity-10 blur-[100px] sm:-right-40 sm:h-[28rem] sm:w-[28rem] sm:blur-[130px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HomeSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

export default App
