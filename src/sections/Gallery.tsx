import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryPhoto } from '@/types';

interface GalleryProps {
  photos: GalleryPhoto[];
  onAddPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
}

export default function Gallery({ photos, onAddPhoto }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  }, [lightboxIndex, photos.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  }, [lightboxIndex, photos.length]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result as string;
      const ratios: Array<'3/4' | '4/3' | '1/1' | '16/9'> = ['3/4', '4/3', '1/1', '16/9' as const];
      onAddPhoto({
        src,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        note: 'Nueva foto',
        aspectRatio: ratios[Math.floor(Math.random() * ratios.length)],
      });
      setShowUpload(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="gallery"
      className="py-20 sm:py-28 px-4"
      style={{ backgroundColor: 'var(--cream)' }}
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
            Nuestros Instantes
          </h2>
          <p
            className="font-body mt-2"
            style={{
              fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
              fontWeight: 300,
              color: 'var(--champagne)',
            }}
          >
            Cada foto es un pedacito de nosotros
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid mb-4 relative group cursor-pointer overflow-hidden rounded-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.src}
                alt={photo.note}
                className="w-full object-cover transition-transform duration-600 group-hover:scale-[1.02]"
                style={{ aspectRatio: photo.aspectRatio }}
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                style={{
                  background: 'linear-gradient(transparent 50%, rgba(44, 44, 44, 0.6) 100%)',
                }}
              >
                <p className="font-body text-sm font-medium text-white">
                  {photo.date}
                </p>
                <p className="font-body text-xs text-white/80">
                  {photo.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Photo FAB */}
      <motion.button
        className="fixed bottom-24 right-6 z-[80] w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'var(--soft-pink)',
          color: 'var(--graphite)',
          boxShadow: 'var(--shadow-glow-pink)',
        }}
        onClick={() => setShowUpload(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Plus size={24} strokeWidth={1.5} />
      </motion.button>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpload(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative bg-white rounded-3xl p-8 max-w-md w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowUpload(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
              <h3
                className="font-display text-2xl mb-4"
                style={{ color: 'var(--graphite)' }}
              >
                Añadir foto
              </h3>
              <p className="font-body text-sm mb-6" style={{ color: 'var(--champagne)' }}>
                Selecciona una foto de tu dispositivo para añadirla a la galería.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-2xl border-2 border-dashed transition-colors font-body font-medium"
                style={{
                  borderColor: 'rgba(201, 184, 167, 0.5)',
                  color: 'var(--champagne)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--soft-pink)';
                  e.currentTarget.style.backgroundColor = 'rgba(243, 198, 209, 0.1)';
                  e.currentTarget.style.color = 'var(--graphite)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.5)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--champagne)';
                }}
              >
                <Plus size={24} className="mx-auto mb-2" />
                Seleccionar archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" />

            {/* Close button */}
            <button
              className="absolute top-6 right-6 z-10 p-3 text-white/80 hover:text-white transition-colors"
              onClick={closeLightbox}
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {/* Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  className="absolute left-4 sm:left-8 z-10 p-3 text-white/60 hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                >
                  <ChevronLeft size={36} strokeWidth={1.5} />
                </button>
                <button
                  className="absolute right-4 sm:right-8 z-10 p-3 text-white/60 hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                >
                  <ChevronRight size={36} strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].note}
              className="relative z-[1] max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
              <p className="font-body text-white text-sm font-medium">
                {photos[lightboxIndex].date}
              </p>
              <p className="font-body text-white/70 text-xs mt-1">
                {photos[lightboxIndex].note}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
