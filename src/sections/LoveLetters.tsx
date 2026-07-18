import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { LoveLetter } from '@/types';

interface LoveLettersProps {
  letters: LoveLetter[];
  onOpenLetter: (id: string) => void;
}

// Envelope SVG component
function EnvelopeSVG({ color = '#F3C6D1' }: { color?: string }) {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="mx-auto">
      {/* Body */}
      <rect x="0" y="0" width="120" height="80" rx="8" fill={color} opacity="0.3" />
      {/* Flap */}
      <path d="M0 0 L60 40 L120 0" fill={color} opacity="0.5" />
      {/* Seal */}
      <circle cx="60" cy="28" r="8" fill="#FFD700" />
      <circle cx="60" cy="28" r="5" fill="#FFE44D" />
    </svg>
  );
}

function LetterCard({ letter, onOpen }: { letter: LoveLetter; onOpen: (id: string) => void }) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = useCallback(() => {
    if (letter.opened) {
      onOpen(letter.id);
      return;
    }
    setIsHolding(true);
    startTimeRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / 2000, 1);
      setProgress(newProgress);
      if (newProgress >= 1) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setIsHolding(false);
        setProgress(0);
        onOpen(letter.id);
      }
    }, 16);
  }, [letter.opened, letter.id, onOpen]);

  const endHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setIsHolding(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      whileHover={{ rotate: letter.opened ? 0 : -2 }}
    >
      <div
        className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center transition-shadow duration-300"
        style={{
          aspectRatio: '3/4',
          boxShadow: isHolding ? 'var(--shadow-glow-pink)' : 'var(--shadow-card)',
        }}
      >
        {letter.opened ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--soft-pink)" strokeWidth="1.5" className="mx-auto mb-3">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p className="font-body text-xs font-medium" style={{ color: 'var(--blush)' }}>
              Leída
            </p>
          </motion.div>
        ) : (
          <>
            <EnvelopeSVG />
            <p
              className="font-body text-sm mt-4"
              style={{ color: 'var(--champagne)' }}
            >
              {letter.date}
            </p>
            <p
              className="font-body text-base font-medium mt-1"
              style={{ color: 'var(--graphite)' }}
            >
              {letter.label}
            </p>
            {isHolding && (
              <p className="font-body text-xs mt-2" style={{ color: 'var(--soft-pink)' }}>
                Mantén para abrir...
              </p>
            )}
          </>
        )}
      </div>

      {/* Progress Ring */}
      <AnimatePresence>
        {isHolding && progress > 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg width="60" height="60" className="-rotate-90">
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="rgba(243, 198, 209, 0.2)"
                strokeWidth="3"
              />
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="var(--soft-pink)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress)}`}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Letter Reading Modal
function LetterModal({ letter, onClose }: { letter: LoveLetter; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />

      <motion.div
        className="relative bg-white rounded-3xl max-w-[560px] w-full max-h-[85vh] overflow-y-auto"
        style={{
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(201, 184, 167, 0.02) 0px, rgba(201, 184, 167, 0.02) 1px, transparent 1px, transparent 12px)',
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-12">
          {/* Date */}
          <p
            className="font-body text-sm mb-3"
            style={{ color: 'var(--champagne)' }}
          >
            {letter.date}
          </p>

          {/* Salutation */}
          <p
            className="font-display text-lg mb-6 italic"
            style={{ color: 'var(--graphite)' }}
          >
            Mi amor,
          </p>

          {/* Body */}
          <div
            className="font-display text-base leading-[1.8] mb-8 whitespace-pre-line"
            style={{ color: 'var(--graphite)' }}
          >
            {letter.content}
          </div>

          {/* Decorative flourish */}
          <div className="flex justify-center my-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--soft-pink)">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          {/* Closing */}
          <div className="text-right">
            <p
              className="font-display text-base italic mb-2"
              style={{ color: 'var(--graphite)' }}
            >
              Con todo mi amor,
            </p>
            <p
              className="font-display text-lg italic"
              style={{ color: 'var(--blush)' }}
            >
              Javi
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LoveLetters({ letters, onOpenLetter }: LoveLettersProps) {
  const [readingLetter, setReadingLetter] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    onOpenLetter(id);
    setReadingLetter(id);
  };

  const activeLetter = letters.find(l => l.id === readingLetter);

  return (
    <section
      id="letters"
      className="py-20 sm:py-28 px-4"
      style={{
        background: 'linear-gradient(180deg, var(--cream) 0%, rgba(243, 198, 209, 0.15) 100%)',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--graphite)',
              fontWeight: 400,
            }}
          >
            Baúl de Secretos
          </h2>
          <p
            className="font-body mt-2"
            style={{
              fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
              fontWeight: 300,
              color: 'var(--champagne)',
            }}
          >
            Cartas que el tiempo no borra
          </p>
        </motion.div>

        {/* Letters Grid */}
        {letters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {letters.map((letter) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                onOpen={handleOpen}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="mx-auto mb-4"
              style={{ color: 'rgba(201, 184, 167, 0.3)' }}
            >
              <path d="M21 8v13H3V8" />
              <path d="M1 3h22v5H1z" />
              <path d="M10 12h4" />
            </svg>
            <p className="font-body text-sm" style={{ color: 'var(--champagne)' }}>
              Nuestro primer baúl está esperando...
            </p>
          </div>
        )}
      </div>

      {/* Letter Modal */}
      <AnimatePresence>
        {activeLetter && (
          <LetterModal
            letter={activeLetter}
            onClose={() => setReadingLetter(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
