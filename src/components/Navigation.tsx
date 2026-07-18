import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Clock, Sparkles, Compass, Mail } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  visible: boolean;
}

const navItems = [
  { id: 'hero', label: 'Inicio', icon: Home },
  { id: 'timeline', label: 'Historia', icon: Clock },
  { id: 'gallery', label: 'Galería', icon: Sparkles },
  { id: 'goals', label: 'Aventuras', icon: Compass },
  { id: 'letters', label: 'Cartas', icon: Mail },
];

export default function Navigation({ activeSection, onNavigate, visible }: NavigationProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className={`fixed z-[90] left-1/2 -translate-x-1/2 glass ${
            isDesktop ? 'top-6' : 'bottom-6'
          }`}
          style={{
            borderRadius: '999px',
            padding: '0.625rem 1.5rem',
            boxShadow: 'var(--shadow-nav)',
          }}
        >
          <ul className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-300"
                    style={{
                      color: isActive ? 'var(--graphite)' : 'var(--graphite)',
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: 'var(--soft-pink)' }}
                        transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                      />
                    )}
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="relative z-10"
                    />
                    <span
                      className={`relative z-10 font-body text-xs font-medium hidden sm:inline ${
                        isActive ? 'font-semibold' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
