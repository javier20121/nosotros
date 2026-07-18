import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, X } from 'lucide-react';
import type { JournalEntry } from '@/types';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
}

export default function Journal({ entries, onAddEntry }: JournalProps) {
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    location: '',
    body: '',
    moodTags: '',
  });

  const handleSubmit = () => {
    if (!newEntry.title.trim() || !newEntry.body.trim()) return;

    onAddEntry({
      title: newEntry.title,
      date: new Date().toISOString().split('T')[0],
      location: newEntry.location || 'Sin ubicación',
      body: newEntry.body,
      photos: [],
      moodTags: newEntry.moodTags ? newEntry.moodTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });

    setNewEntry({ title: '', location: '', body: '', moodTags: '' });
    setShowForm(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section
      id="journal"
      className="py-20 sm:py-28 px-4"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[720px] mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-12"
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
            Bitácora de Viaje
          </h2>
          <p
            className="font-body mt-2"
            style={{
              fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
              fontWeight: 300,
              color: 'var(--champagne)',
            }}
          >
            Nuestras aventuras, en palabras
          </p>
        </motion.div>

        {/* Entries */}
        <div className="space-y-6">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.article
                key={entry.id}
                className="card-romantic p-6 sm:p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Entry Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span
                    className="font-body text-sm font-semibold"
                    style={{ color: 'var(--soft-pink)' }}
                  >
                    {formatDate(entry.date)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(243, 198, 209, 0.15)',
                      color: 'var(--blush)',
                    }}
                  >
                    <MapPin size={12} />
                    {entry.location}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-display text-xl sm:text-2xl mb-4"
                  style={{ color: 'var(--graphite)', fontWeight: 500 }}
                >
                  {entry.title}
                </h3>

                {/* Body */}
                <div
                  className="font-body text-sm sm:text-base leading-relaxed whitespace-pre-line"
                  style={{ color: 'rgba(44, 44, 44, 0.8)', lineHeight: 1.7 }}
                >
                  {entry.body}
                </div>

                {/* Mood Tags */}
                {entry.moodTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {entry.moodTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full font-body text-xs"
                        style={{
                          backgroundColor: 'var(--cream)',
                          border: '1px solid rgba(201, 184, 167, 0.3)',
                          color: 'var(--champagne)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Entry Button / Form */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="add-btn"
                className="w-full py-5 rounded-3xl border-2 border-dashed font-body font-medium flex items-center justify-center gap-2 transition-colors"
                style={{
                  borderColor: 'rgba(201, 184, 167, 0.5)',
                  color: 'var(--champagne)',
                }}
                onClick={() => setShowForm(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{
                  borderColor: 'var(--soft-pink)',
                  backgroundColor: 'rgba(243, 198, 209, 0.1)',
                  color: 'var(--graphite)',
                }}
              >
                <Plus size={20} />
                Escribir nueva entrada
              </motion.button>
            ) : (
              <motion.div
                key="form"
                className="card-romantic p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3
                    className="font-display text-xl"
                    style={{ color: 'var(--graphite)' }}
                  >
                    Nueva entrada
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título de la aventura..."
                    className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all"
                    style={{
                      borderColor: 'rgba(201, 184, 167, 0.4)',
                      color: 'var(--graphite)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--soft-pink)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(243, 198, 209, 0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.4)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />

                  <input
                    type="text"
                    value={newEntry.location}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="¿Dónde fue?"
                    className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all"
                    style={{
                      borderColor: 'rgba(201, 184, 167, 0.4)',
                      color: 'var(--graphite)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--soft-pink)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(243, 198, 209, 0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.4)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />

                  <textarea
                    value={newEntry.body}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Cuéntame la historia..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all resize-none"
                    style={{
                      borderColor: 'rgba(201, 184, 167, 0.4)',
                      color: 'var(--graphite)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--soft-pink)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(243, 198, 209, 0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.4)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />

                  <input
                    type="text"
                    value={newEntry.moodTags}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, moodTags: e.target.value }))}
                    placeholder="Etiquetas de humor (separadas por comas): Aventura, Romance..."
                    className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all"
                    style={{
                      borderColor: 'rgba(201, 184, 167, 0.4)',
                      color: 'var(--graphite)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--soft-pink)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(243, 198, 209, 0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.4)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-full font-body text-sm font-medium transition-colors"
                      style={{ color: 'var(--champagne)' }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="pill-btn pill-btn-primary"
                      disabled={!newEntry.title.trim() || !newEntry.body.trim()}
                      style={{ opacity: newEntry.title.trim() && newEntry.body.trim() ? 1 : 0.5 }}
                    >
                      Guardar entrada
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
