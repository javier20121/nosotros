import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FlowerGardenProps {
  onExit: () => void;
  isExiting: boolean;
}

const bubbleConfigs = [
  { position: '10%', time: '7s', delay: '0s', size: '24px' },
  { position: '20%', time: '6s', delay: '1s', size: '18px' },
  { position: '30%', time: '8s', delay: '2s', size: '20px' },
  { position: '40%', time: '5s', delay: '0.5s', size: '16px' },
  { position: '50%', time: '7s', delay: '1.5s', size: '22px' },
  { position: '60%', time: '6s', delay: '3s', size: '14px' },
  { position: '70%', time: '8s', delay: '2.5s', size: '20px' },
  { position: '80%', time: '5s', delay: '0.8s', size: '18px' },
  { position: '90%', time: '7s', delay: '1.8s', size: '16px' },
  { position: '15%', time: '6s', delay: '4s', size: '22px' },
  { position: '25%', time: '8s', delay: '3.5s', size: '14px' },
  { position: '35%', time: '5s', delay: '2.2s', size: '20px' },
  { position: '45%', time: '7s', delay: '1.2s', size: '18px' },
  { position: '55%', time: '6s', delay: '0.3s', size: '24px' },
  { position: '65%', time: '8s', delay: '4.5s', size: '16px' },
  { position: '75%', time: '5s', delay: '3.8s', size: '20px' },
  { position: '85%', time: '7s', delay: '2.8s', size: '14px' },
  { position: '95%', time: '6s', delay: '1s', size: '22px' },
  { position: '5%', time: '8s', delay: '5s', size: '18px' },
  { position: '50%', time: '9s', delay: '0s', size: '26px' },
];

export default function FlowerGarden({ onExit, isExiting }: FlowerGardenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.deltaY > 20) {
      onExit();
    }
  }, [onExit]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const deltaY = touchStartY.current - e.touches[0].clientY;
    if (deltaY > 50) {
      onExit();
    }
  }, [onExit]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isExiting) return;

    el.addEventListener('wheel', handleWheel, { passive: true });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, isExiting]);

  return (
    <div
      ref={containerRef}
      className={`flower-garden ${isExiting ? 'exiting' : ''}`}
    >
      <div className="night" />

      {/* Flower structures */}
      <div className="flowers">
        {/* Flower 1 */}
        <div className="flower flower--1">
          <div className="flower__leafs flower__leafs--1">
            <div className="flower__leaf flower__leaf--1" />
            <div className="flower__leaf flower__leaf--2" />
            <div className="flower__leaf flower__leaf--3" />
            <div className="flower__leaf flower__leaf--4" />
            <div className="flower__white-circle" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`} />
            ))}
          </div>
          <div className="flower__line">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Flower 2 */}
        <div className="flower flower--2">
          <div className="flower__leafs flower__leafs--2">
            <div className="flower__leaf flower__leaf--1" />
            <div className="flower__leaf flower__leaf--2" />
            <div className="flower__leaf flower__leaf--3" />
            <div className="flower__leaf flower__leaf--4" />
            <div className="flower__white-circle" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`} />
            ))}
          </div>
          <div className="flower__line">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Flower 3 */}
        <div className="flower flower--3">
          <div className="flower__leafs flower__leafs--3">
            <div className="flower__leaf flower__leaf--1" />
            <div className="flower__leaf flower__leaf--2" />
            <div className="flower__leaf flower__leaf--3" />
            <div className="flower__leaf flower__leaf--4" />
            <div className="flower__white-circle" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`} />
            ))}
          </div>
          <div className="flower__line">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Flower 4 */}
        <div className="flower flower--4">
          <div className="flower__leafs flower__leafs--3">
            <div className="flower__leaf flower__leaf--1" />
            <div className="flower__leaf flower__leaf--2" />
            <div className="flower__leaf flower__leaf--3" />
            <div className="flower__leaf flower__leaf--4" />
            <div className="flower__white-circle" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`} />
            ))}
          </div>
          <div className="flower__line">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Grass and decorative elements */}
        <div className="growing-grass">
          <div className="flower__grass flower__grass--1">
            <div className="flower__grass--top" />
            <div className="flower__grass--bottom" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i + 1}`} />
            ))}
            <div className="flower__grass__overlay" />
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--2">
            <div className="flower__grass--top" />
            <div className="flower__grass--bottom" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i + 1}`} />
            ))}
            <div className="flower__grass__overlay" />
          </div>
        </div>

        <div className="flower__g-long">
          <div className="flower__g-long__top" />
          <div className="flower__g-long__bottom" />
        </div>

        <div className="flower__g-right flower__g-right--1">
          <div className="leaf" />
        </div>

        <div className="flower__g-right flower__g-right--2">
          <div className="leaf" />
        </div>

        <div className="flower__g-front">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${i + 1}`}>
              <div className="flower__g-front__leaf" />
            </div>
          ))}
          <div className="flower__g-front__line" />
        </div>

        <div className="flower__g-fr">
          <div className="leaf" />
        </div>
      </div>

      {/* Click overlay to exit */}
      <div
        className="absolute inset-0 z-[60] cursor-pointer"
        onClick={onExit}
        aria-label="Entrar al sitio"
      />

      {/* Title Overlay */}
      <motion.div
        className="absolute inset-0 z-[50] flex flex-col items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.h1
          className="font-display text-white text-center"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            textShadow: '0 2px 40px rgba(0,0,0,0.3)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isExiting ? -40 : 0, opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Javi & Cami
        </motion.h1>
        <motion.p
          className="font-body text-white/80 mt-2"
          style={{ fontSize: '1.25rem', fontWeight: 300 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isExiting ? -20 : 0, opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          Nuestra Isla
        </motion.p>
      </motion.div>

      {/* Bubbles */}
      <div className="bubbles">
        {bubbleConfigs.map((config, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              '--position': config.position,
              '--time': config.time,
              '--delay': config.delay,
              '--size': config.size,
            } as React.CSSProperties}
          >
            <svg className="heart" viewBox="0 0 32 32">
              <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Scroll Arrow */}
      <motion.button
        className="scroll-arrow z-[50] cursor-pointer bg-transparent border-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ delay: 2 }}
        onClick={onExit}
        aria-label="Entrar al sitio"
      >
        <span /><span /><span />
      </motion.button>
    </div>
  );
}
