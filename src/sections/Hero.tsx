import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTimeCounter } from '@/hooks/useLocalStorage';

interface HeroProps {
  startDate: Date;
}

const subtitles = [
  'Nuestro amor en cada detalle',
  'Juntos, siempre',
  'Eres mi persona favorita',
  'Contigo todo es mejor',
];

export default function Hero({ startDate }: HeroProps) {
  const time = useTimeCounter(startDate);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
        setIsFading(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { value: time.years, label: 'AÑOS' },
    { value: time.months, label: 'MES' },
    { value: time.days, label: 'DÍAS' },
    { value: time.hours, label: 'HORAS' },
    { value: time.minutes, label: 'MIN' },
    { value: time.seconds, label: 'SEG' },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative px-4"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Main Title */}
      <div className="text-center mb-6">
        <div className="overflow-hidden">
          <motion.h1
            className="font-display"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: 'var(--graphite)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Javi
          </motion.h1>
        </div>
        <div className="overflow-hidden -mt-2">
          <motion.span
            className="font-display block"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--blush)',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
            }}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            &
          </motion.span>
        </div>
        <div className="overflow-hidden -mt-2">
          <motion.h1
            className="font-display"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: 'var(--graphite)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Cami
          </motion.h1>
        </div>
      </div>

      {/* Rotating Subtitle */}
      <motion.p
        className="font-body text-center mb-10 h-8"
        style={{
          fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
          fontWeight: 300,
          color: 'var(--champagne)',
          transition: 'opacity 0.3s, transform 0.3s',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'translateY(-12px)' : 'translateY(0)',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        {subtitles[subtitleIndex]}
      </motion.p>

      {/* Time Counter Widget */}
      <motion.div
        className="glass rounded-3xl px-6 py-5 sm:px-10 sm:py-6 flex items-center gap-4 sm:gap-6"
        style={{ boxShadow: 'var(--shadow-card)' }}
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-3 sm:gap-6">
            <div className="text-center">
              <div
                className="font-display tabular-nums"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  color: 'var(--graphite)',
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {String(unit.value).padStart(2, '0')}
              </div>
              <div
                className="font-body mt-1"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--champagne)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {unit.label}
              </div>
            </div>
            {index < timeUnits.length - 1 && (
              <span
                className="text-lg sm:text-xl -mt-4"
                style={{ color: 'var(--soft-pink)' }}
              >
                ·
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
