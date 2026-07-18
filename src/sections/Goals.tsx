import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target, GripVertical, Trash2, Camera } from 'lucide-react';
import type { Goal, GoalStatus, GoalTask } from '@/types';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  onAddPhotoToGoal: (id: string, photoSrc: string) => void;
  onDeletePhotoFromGoal: (goalId: string, photoIndex: number) => void;
}

const columns: { status: GoalStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Pendientes', color: 'var(--champagne)' },
  { status: 'in-progress', label: 'En Proceso', color: 'var(--soft-pink)' },
  { status: 'completed', label: 'Logrado', color: 'var(--blush)' },
];

function getStatusFromTasks(tasks: GoalTask[]) {
  if (!tasks || tasks.length === 0 || tasks.every(task => !task.done)) {
    return 'pending';
  }

  if (tasks.every(task => task.done)) {
    return 'completed';
  }

  return 'in-progress';
}

const dragonTitles = [
  { min: 0, max: 0, title: 'Aprendiz de Vikingo' },
  { min: 1, max: 2, title: 'Primer Vuelo' },
  { min: 3, max: 4, title: 'Domador Novato' },
  { min: 5, max: 6, title: 'Protector de Berk' },
  { min: 7, max: Infinity, title: 'Jinete de Dragón Legendario' },
];

function getDragonTitle(completed: number) {
  return dragonTitles.find(t => completed >= t.min && completed <= t.max)?.title || 'Aprendiz de Vikingo';
}

// Dragon SVG component
function DragonIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" style={style}>
      <path d="M16 2C12 2 8 5 8 9c0 1.5.5 3 1.5 4L6 18h4l-1 4 4-2v4h4v-4l4 2-1-4h4l-3.5-5c1-1 1.5-2.5 1.5-4 0-4-4-7-8-7zm-2 8a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}

export default function Goals({ goals, onAddGoal, onUpdateGoal, onDeleteGoal, onAddPhotoToGoal, onDeletePhotoFromGoal }: GoalsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', tasks: [] as GoalTask[] });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newGoalPhotos, setNewGoalPhotos] = useState<string[]>([]);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedCount = useMemo(() => goals.filter(g => g.status === 'completed').length, [goals]);
  const totalCount = goals.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    const status = getStatusFromTasks(newGoal.tasks);
    onAddGoal({
      title: newGoal.title,
      description: newGoal.description,
      status,
      photos: newGoalPhotos,
      tasks: newGoal.tasks,
    });
    setNewGoal({ title: '', description: '', tasks: [] });
    setNewGoalPhotos([]);
    setNewTaskTitle('');
    setShowAdd(false);
  };

  const updateGoalTasks = (goalId: string, tasks: GoalTask[]) => {
    onUpdateGoal(goalId, {
      tasks,
      status: getStatusFromTasks(tasks),
    });
  };

  const handleDelete = (id: string) => {
    onDeleteGoal(id);
    setDeleteConfirm(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, goalId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (goalId) {
          onAddPhotoToGoal(goalId, base64);
        } else {
          setNewGoalPhotos(prev => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow the same file again
    if (e.target) e.target.value = '';
  };

  const removePhotoFromNewGoal = (index: number) => {
    setNewGoalPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const [activePhotoGoal, setActivePhotoGoal] = useState<string | null>(null);
  const selectedGoal = selectedGoalId ? goals.find(g => g.id === selectedGoalId) : null;

  return (
    <section
      id="goals"
      className="py-20 sm:py-28 px-4"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-10"
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
            Nuestro Libro de Aventuras
          </h2>
          <p
            className="font-body mt-2"
            style={{
              fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
              fontWeight: 300,
              color: 'var(--champagne)',
            }}
          >
            Metas, sueños y locuras juntos
          </p>
        </motion.div>

        {/* Dragon Progress Widget */}
        <motion.div
          className="card-romantic p-5 sm:p-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="font-body text-sm font-semibold"
                style={{ color: 'var(--graphite)' }}
              >
                Progreso del Dragón
              </h3>
              <p className="font-body text-xs mt-0.5" style={{ color: 'var(--champagne)' }}>
                {getDragonTitle(completedCount)}
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(243, 198, 209, 0.2)' }}
            >
              <DragonIcon className="w-5 h-5" style={{ color: 'var(--blush)' }} />
              <span
                className="font-body text-xs font-semibold"
                style={{ color: 'var(--blush)' }}
              >
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(243, 198, 209, 0.2)' }}
          >
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: 'linear-gradient(90deg, var(--soft-pink), var(--blush))',
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {progressPercent > 0 && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                  style={{ animation: 'dragon-pulse 2s infinite' }}
                >
                  <DragonIcon
                    className="w-5 h-5"
                    style={{ color: 'var(--blush)', filter: 'drop-shadow(0 0 6px rgba(226, 154, 167, 0.5))' }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colGoals = goals.filter(g => g.status === col.status);

            return (
              <div key={col.status} className="flex-1 min-w-[280px]">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${col.status === 'in-progress' ? 'pulse-soft' : ''}`}
                    style={{ backgroundColor: col.color }}
                  />
                  <h3
                    className="font-body text-sm font-semibold"
                    style={{ color: 'var(--graphite)' }}
                  >
                    {col.label}
                  </h3>
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center font-body text-xs font-semibold"
                    style={{
                      backgroundColor: 'rgba(243, 198, 209, 0.2)',
                      color: 'var(--blush)',
                    }}
                  >
                    {colGoals.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {colGoals.map((goal) => (
                      <motion.div
                        key={goal.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                        style={{ boxShadow: 'var(--shadow-card)' }}
                        onClick={() => setSelectedGoalId(goal.id)}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical
                            size={16}
                            className="mt-0.5 opacity-0 group-hover:opacity-30 flex-shrink-0"
                            style={{ color: 'var(--champagne)' }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-body text-sm font-medium truncate"
                              style={{ color: 'var(--graphite)' }}
                            >
                              {goal.title}
                            </h4>
                            <p
                              className="font-body text-xs mt-2 leading-relaxed"
                              style={{ color: 'rgba(44, 44, 44, 0.6)', maxHeight: '3rem', overflow: 'hidden' }}
                            >
                              {goal.description}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                style={{
                                  backgroundColor: goal.status === 'pending' ? 'rgba(201, 184, 167, 0.15)' : goal.status === 'in-progress' ? 'rgba(243, 198, 209, 0.2)' : 'rgba(226, 154, 167, 0.2)',
                                  color: goal.status === 'pending' ? 'var(--champagne)' : goal.status === 'in-progress' ? 'var(--soft-pink)' : 'var(--blush)',
                                }}
                              >
                                {goal.status === 'pending' ? 'Pendiente' : goal.status === 'in-progress' ? 'En proceso' : 'Logrado'}
                              </span>
                              {goal.photos && goal.photos.length > 0 && (
                                <span className="text-[11px] text-gray-500">📸 {goal.photos.length} recuerdos</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Empty state */}
                  {colGoals.length === 0 && (
                    <div className="text-center py-8">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="mx-auto mb-2"
                        style={{ color: 'rgba(201, 184, 167, 0.3)' }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <p className="font-body text-xs" style={{ color: 'var(--champagne)' }}>
                        Aún no hay sueños aquí
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Goal FAB */}
      <motion.button
        className="fixed bottom-24 right-6 z-[80] w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'var(--soft-pink)',
          color: 'var(--graphite)',
          boxShadow: 'var(--shadow-glow-pink)',
        }}
        onClick={() => setShowAdd(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Target size={24} strokeWidth={1.5} />
      </motion.button>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdd(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <h3
                className="font-display text-2xl mb-6"
                style={{ color: 'var(--graphite)' }}
              >
                Nueva meta
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs font-medium mb-1.5 block" style={{ color: 'var(--graphite)' }}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="¿Qué sueño quieres cumplir?"
                    className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all"
                    style={{
                      borderColor: 'rgba(201, 184, 167, 0.4)',
                      color: 'var(--graphite)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--soft-pink)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(243, 198, 209, 0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.4)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label className="font-body text-xs font-medium mb-1.5 block" style={{ color: 'var(--graphite)' }}>
                    Descripción
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Cuéntame más sobre este sueño..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all resize-none"
                    style={{
                      borderColor: 'rgba(201, 184, 167, 0.4)',
                      color: 'var(--graphite)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--soft-pink)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(243, 198, 209, 0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.4)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label className="font-body text-xs font-medium mb-1.5 block" style={{ color: 'var(--graphite)' }}>
                    Lista de tareas
                  </label>
                  <div className="space-y-3">
                    {newGoal.tasks.length > 0 ? (
                      <ul className="space-y-2">
                        {newGoal.tasks.map((task, index) => (
                          <li
                            key={task.id}
                            className="flex items-center justify-between gap-3 rounded-2xl border px-3 py-2"
                            style={{ borderColor: 'rgba(201, 184, 167, 0.3)' }}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={task.done}
                                readOnly
                                className="h-4 w-4 rounded"
                                style={{ accentColor: 'var(--blush)' }}
                              />
                              <span className="font-body text-sm" style={{ color: task.done ? 'var(--blush)' : 'var(--graphite)', textDecoration: task.done ? 'line-through' : 'none' }}>
                                {task.title}
                              </span>
                            </div>
                            <button
                              onClick={() => setNewGoal(prev => ({
                                ...prev,
                                tasks: prev.tasks.filter((_, i) => i !== index),
                              }))}
                              className="text-red-500 text-xs"
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-xs" style={{ color: 'var(--champagne)' }}>
                        Añade las etapas necesarias para cumplir esta meta.
                      </p>
                    )}

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Nueva tarea"
                        className="flex-1 px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all"
                        style={{ borderColor: 'rgba(201, 184, 167, 0.4)', color: 'var(--graphite)' }}
                      />
                      <button
                        onClick={() => {
                          const title = newTaskTitle.trim();
                          if (!title) return;
                          setNewGoal(prev => ({
                            ...prev,
                            tasks: [...prev.tasks, { id: crypto.randomUUID(), title, done: false }],
                          }));
                          setNewTaskTitle('');
                        }}
                        className="px-4 py-3 rounded-2xl text-white text-sm"
                        style={{ backgroundColor: 'var(--soft-pink)' }}
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-medium mb-1.5 block" style={{ color: 'var(--graphite)' }}>
                    Fotos y Recuerdos
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newGoalPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo} className="w-16 h-16 object-cover rounded-lg border" />
                        <button
                          onClick={() => removePhotoFromNewGoal(index)}
                          className="absolute -top-1 -right-1 bg-white rounded-full shadow-md text-red-500 p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setActivePhotoGoal(null);
                        fileInputRef.current?.click();
                      }}
                      className="w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors"
                      style={{ borderColor: 'rgba(201, 184, 167, 0.4)', color: 'var(--champagne)' }}
                    >
                      <Plus size={20} />
                      <span className="text-[10px]">Añadir</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddGoal}
                  className="w-full pill-btn pill-btn-primary mt-4 flex items-center justify-center gap-2"
                  disabled={!newGoal.title.trim()}
                  style={{ opacity: newGoal.title.trim() ? 1 : 0.5 }}
                >
                  <Plus size={18} />
                  Añadir meta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stitch Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* Stitch Paw Print */}
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(78, 205, 196, 0.15)' }}
              >
                <img src="/images/stich.svg" alt="Stitch" className="w-12 h-12 object-contain" />
              </div>

              <h4
                className="font-body text-base font-medium mb-2"
                style={{ color: 'var(--graphite)' }}
              >
                ¿Estás seguro?
              </h4>
              <p className="font-body text-sm mb-6" style={{ color: 'var(--champagne)' }}>
                Stitch dice que romper promesas no es de Ohana
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 rounded-full font-body text-sm font-medium border transition-colors"
                  style={{
                    borderColor: 'var(--champagne)',
                    color: 'var(--champagne)',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-5 py-2.5 rounded-full font-body text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: 'var(--blush)' }}
                >
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedGoal && (
          <motion.div
              className="fixed inset-0 z-[105] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGoalId(null)}
            >
              <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" />
              <motion.div
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedGoalId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
                    <div>
                      <h3
                        className="font-display text-3xl"
                        style={{ color: 'var(--graphite)', fontWeight: 500 }}
                      >
                        {selectedGoal.title}
                      </h3>
                      <p
                        className="font-body text-sm leading-relaxed mt-3"
                        style={{ color: 'rgba(44, 44, 44, 0.75)' }}
                      >
                        {selectedGoal.description}
                      </p>

                      {selectedGoal.photos && selectedGoal.photos.length > 0 && (
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          {selectedGoal.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={photo}
                                alt={`Recuerdo ${index + 1}`}
                                className="w-full h-52 object-cover rounded-3xl shadow-sm"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeletePhotoFromGoal(selectedGoal.id, index);
                                }}
                                className="absolute top-3 right-3 bg-white/90 rounded-full p-2 text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[2rem] border border-[rgba(201,184,167,0.2)] bg-[rgba(255,255,255,0.95)] p-5 shadow-sm min-h-[26rem] flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-body text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--champagne)' }}>
                                Tareas
                              </p>
                              <p className="font-body text-[11px] mt-1" style={{ color: 'var(--graphite)' }}>
                                {selectedGoal.tasks.filter(task => task.done).length}/{selectedGoal.tasks.length} completadas
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold uppercase" style={{ color: selectedGoal.status === 'completed' ? 'var(--blush)' : selectedGoal.status === 'in-progress' ? 'var(--soft-pink)' : 'var(--champagne)' }}>
                              {selectedGoal.status === 'pending' ? 'Pendiente' : selectedGoal.status === 'in-progress' ? 'En proceso' : 'Logrado'}
                            </span>
                          </div>

                          {selectedGoal.tasks.length > 0 ? (
                            <ul className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
                              {selectedGoal.tasks.map((task) => (
                                <li
                                  key={task.id}
                                  className="flex items-center justify-between gap-3 rounded-3xl border px-4 py-3"
                                  style={{ borderColor: 'rgba(201, 184, 167, 0.25)' }}
                                >
                                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={task.done}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        const updatedTasks = selectedGoal.tasks.map((item) =>
                                          item.id === task.id ? { ...item, done: e.target.checked } : item
                                        );
                                        updateGoalTasks(selectedGoal.id, updatedTasks);
                                      }}
                                      className="h-4 w-4 rounded"
                                      style={{ accentColor: 'var(--blush)' }}
                                    />
                                    <span
                                      className="font-body text-sm"
                                      style={{
                                        color: task.done ? 'var(--blush)' : 'var(--graphite)',
                                        textDecoration: task.done ? 'line-through' : 'none',
                                      }}
                                    >
                                      {task.title}
                                    </span>
                                  </label>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateGoalTasks(
                                        selectedGoal.id,
                                        selectedGoal.tasks.filter((item) => item.id !== task.id)
                                      );
                                    }}
                                    className="text-red-500 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-body text-xs" style={{ color: 'var(--champagne)' }}>
                              Agrega tareas para empezar a avanzar con esta meta.
                            </p>
                          )}
                        </div>

                        <div className="mt-4">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={selectedTaskTitle}
                              onChange={(e) => setSelectedTaskTitle(e.target.value)}
                              placeholder="Agregar nueva tarea"
                              className="flex-1 px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all"
                              style={{ borderColor: 'rgba(201, 184, 167, 0.4)', color: 'var(--graphite)' }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const title = selectedTaskTitle.trim();
                                if (!title) return;
                                updateGoalTasks(selectedGoal.id, [
                                  ...selectedGoal.tasks,
                                  { id: crypto.randomUUID(), title, done: false },
                                ]);
                                setSelectedTaskTitle('');
                              }}
                              className="px-4 py-3 rounded-3xl text-white text-sm"
                              style={{ backgroundColor: 'var(--soft-pink)' }}
                            >
                              Añadir
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePhotoGoal(selectedGoal.id);
                            fileInputRef.current?.click();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-3xl font-body text-sm"
                          style={{
                            backgroundColor: 'rgba(243, 198, 209, 0.15)',
                            color: 'var(--blush)',
                          }}
                        >
                          <Camera size={16} />
                          Añadir recuerdo
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(selectedGoal.id);
                            setSelectedGoalId(null);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-3xl font-body text-sm"
                          style={{
                            backgroundColor: 'rgba(255, 237, 237, 0.9)',
                            color: '#ef4444',
                          }}
                        >
                          <Trash2 size={16} />
                          Eliminar meta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, activePhotoGoal || undefined)}
      />
    </section>
  );
}
