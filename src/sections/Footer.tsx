import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const triggerEasterEgg = () => {
    setShowEasterEgg(true);
    setTimeout(() => setShowEasterEgg(false), 4000);
  };

  return (
    <footer
      className="relative py-12 px-4 overflow-hidden"
      style={{ backgroundColor: 'var(--graphite)' }}
    >
      <div className="max-w-[1200px] mx-auto text-center">
        {/* Main Footer Text */}
        <p className="font-body text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Hecho con{' '}
          <span style={{ color: 'var(--soft-pink)' }}>❤️</span>{' '}
          para Cami
        </p>
        <p className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          2024
        </p>
      </div>

      {/* Secret Stitch Button */}
      <button
        onClick={triggerEasterEgg}
        className="absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 hover:opacity-100"
        style={{ opacity: 0.3, color: 'rgba(255, 255, 255, 0.5)' }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.3'; }}
        title="?"
      >
        <Heart size={20} strokeWidth={1.5} />
      </button>

      {/* Stitch Easter Egg */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Quote */}
            <motion.div
              className="relative text-center px-6"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Stitch Paw Print */}
              <motion.div
                className="mb-6 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <img src="/images/stich.svg" alt="Stitch" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
              </motion.div>

              <motion.p
                className="font-display italic text-white"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                  lineHeight: 1.3,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                "Ohana significa familia
              </motion.p>
              <motion.p
                className="font-display italic text-white/80 mt-2"
                style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.75rem)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                y familia significa que..."
              </motion.p>
              <motion.p
                className="font-body text-white/60 mt-4"
                style={{ fontSize: '0.875rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                nadie se queda atrás
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
