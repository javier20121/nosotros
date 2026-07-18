import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import FlowerGarden from '@/sections/FlowerGarden';
import Hero from '@/sections/Hero';
import Timeline from '@/sections/Timeline';
import Gallery from '@/sections/Gallery';
import Goals from '@/sections/Goals';
import PersonalGoals from '@/sections/PersonalGoals';
import Journal from '@/sections/Journal';
import LoveLetters from '@/sections/LoveLetters';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import { useAppData } from '@/hooks/useLocalStorage';

const sectionIds = ['hero', 'timeline', 'gallery', 'goals', 'personal-goals', 'journal', 'letters'];

export default function App() {
  const {
    data,
    startDate,
    addGoal,
    updateGoal,
    addPhotoToGoal,
    deletePhotoFromGoal,
    deleteGoal,
    toggleObjectiveTask,
    addObjectiveCheckin,
    deleteObjective,
    addPhoto,
    addJournalEntry,
    openLetter,
  } = useAppData();

  const [showGarden, setShowGarden] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showNav, setShowNav] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Set up section refs
  useEffect(() => {
    sectionIds.forEach((id) => {
      sectionRefs.current[id] = document.getElementById(id);
    });
  }, []);

  // Scroll spy
  useEffect(() => {
    if (showGarden) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }

      setShowNav(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showGarden]);

  const handleGardenExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setShowGarden(false);
      setShowNav(true);
      window.scrollTo(0, 0);
    }, 800);
  }, [isExiting]);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative">
      {/* Flower Garden Opening Scene */}
      <AnimatePresence>
        {showGarden && (
          <FlowerGarden onExit={handleGardenExit} isExiting={isExiting} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-opacity duration-500 ${
          showGarden ? 'opacity-0 pointer-events-none fixed inset-0' : 'opacity-100'
        }`}
      >
        {/* Navigation */}
        <Navigation
          activeSection={activeSection}
          onNavigate={handleNavigate}
          visible={showNav}
        />

        {/* Sections */}
        <main>
          <Hero startDate={startDate} />

          <Timeline milestones={data.milestones} />

          <Gallery
            photos={data.photos}
            onAddPhoto={addPhoto}
          />

          <Goals
            goals={data.goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
            onAddPhotoToGoal={addPhotoToGoal}
            onDeletePhotoFromGoal={deletePhotoFromGoal}
          />

          <PersonalGoals
            objectives={data.personalObjectives}
            onToggleTask={toggleObjectiveTask}
            onAddCheckin={addObjectiveCheckin}
            onDeleteObjective={deleteObjective}
          />

          <Journal
            entries={data.journal}
            onAddEntry={addJournalEntry}
          />

          <LoveLetters
            letters={data.letters}
            onOpenLetter={openLetter}
          />

          <Footer />
        </main>
      </div>
    </div>
  );
}
