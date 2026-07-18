import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, MessageSquare, Flame, X, Plus, Trash2 } from 'lucide-react';
import type { PersonalObjective, ObjectiveCheckin } from '@/types';

interface PersonalGoalsProps {
  objectives: PersonalObjective[];
  onToggleTask: (objectiveId: string, taskId: string) => void;
  onAddCheckin: (objectiveId: string, note: string) => void;
  onDeleteObjective: (id: string) => void;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getStreak(checkins: ObjectiveCheckin[]): number {
  if (!checkins.length) return 0;
  const sorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
  const today = getToday();
  let streak = 0;
  let currentDate = new Date(today + 'T12:00:00');

  // Check if there's a check-in today or yesterday to start the streak
  const latestDate = sorted[0].date;
  const diffDays = Math.floor((new Date(today + 'T12:00:00').getTime() - new Date(latestDate + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (sorted.some(c => c.date === dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (i === 0) {
      // Today might not have a check-in yet, skip
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getLast30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return `${days[d.getDay()]} ${d.getDate()}`;
}

export default function PersonalGoals({
  objectives,
  onToggleTask,
  onAddCheckin,
  onDeleteObjective,
}: PersonalGoalsProps) {
  const [activeTab, setActiveTab] = useState<'javi' | 'cami'>('javi');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkinId, setCheckinId] = useState<string | null>(null);
  const [checkinNote, setCheckinNote] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredObjectives = useMemo(
    () => objectives.filter(o => o.owner === activeTab).sort((a, b) => a.priority - b.priority),
    [objectives, activeTab]
  );

  const today = getToday();
  const todayCheckins = useMemo(
    () => filteredObjectives.filter(o => o.checkins.some(c => c.date === today)).length,
    [filteredObjectives, today]
  );

  const totalTasks = useMemo(
    () => filteredObjectives.reduce((acc, o) => acc + o.tasks.length, 0),
    [filteredObjectives]
  );
  const doneTasks = useMemo(
    () => filteredObjectives.reduce((acc, o) => acc + o.tasks.filter(t => t.done).length, 0),
    [filteredObjectives]
  );

  const last30 = useMemo(() => getLast30Days(), []);

  // Get all check-in dates across all objectives for this owner
  const allCheckinDates = useMemo(() => {
    const dates = new Set<string>();
    filteredObjectives.forEach(o => o.checkins.forEach(c => dates.add(c.date)));
    return dates;
  }, [filteredObjectives]);

  const handleCheckin = (objectiveId: string) => {
    onAddCheckin(objectiveId, checkinNote);
    setCheckinNote('');
    setCheckinId(null);
  };

  return (
    <section
      id="personal-goals"
      className="py-20 sm:py-28 px-4"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
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
            Nuestros Objetivos
          </h2>
          <p
            className="font-body mt-2"
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              fontWeight: 300,
              color: 'var(--champagne)',
            }}
          >
            Crecimiento personal, día a día, juntos
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {(['javi', 'cami'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setExpandedId(null);
              }}
              className="relative px-6 py-3 rounded-full font-body text-sm font-medium transition-all duration-300"
              style={{
                color: activeTab === tab ? 'white' : 'var(--graphite)',
                backgroundColor: activeTab === tab
                  ? (tab === 'javi' ? 'var(--graphite)' : 'var(--blush)')
                  : 'rgba(201, 184, 167, 0.12)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {tab === 'javi' ? '🧑‍🚒' : '🎨'}
                {tab === 'javi' ? 'Javi' : 'Cami'}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div
            className="rounded-2xl p-4 text-center"
            style={{ backgroundColor: 'rgba(243, 198, 209, 0.12)' }}
          >
            <p className="font-body text-2xl font-bold" style={{ color: 'var(--graphite)' }}>
              {filteredObjectives.length}
            </p>
            <p className="font-body text-[11px] mt-1" style={{ color: 'var(--champagne)' }}>
              Objetivos
            </p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ backgroundColor: 'rgba(243, 198, 209, 0.12)' }}
          >
            <p className="font-body text-2xl font-bold" style={{ color: 'var(--graphite)' }}>
              {doneTasks}/{totalTasks}
            </p>
            <p className="font-body text-[11px] mt-1" style={{ color: 'var(--champagne)' }}>
              Acciones
            </p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ backgroundColor: 'rgba(243, 198, 209, 0.12)' }}
          >
            <p className="font-body text-2xl font-bold flex items-center justify-center gap-1" style={{ color: 'var(--graphite)' }}>
              {todayCheckins}
              {todayCheckins > 0 && <Flame size={18} className="text-orange-400" />}
            </p>
            <p className="font-body text-[11px] mt-1" style={{ color: 'var(--champagne)' }}>
              Check-ins hoy
            </p>
          </div>
        </motion.div>

        {/* Activity Calendar */}
        <motion.div
          className="card-romantic p-4 sm:p-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="font-body text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--champagne)' }}>
            Actividad · Últimos 30 días
          </h3>
          <div className="flex gap-[3px] flex-wrap">
            {last30.map((day) => {
              const hasCheckin = allCheckinDates.has(day);
              const isToday = day === today;
              return (
                <div
                  key={day}
                  title={getDayLabel(day)}
                  className="rounded-[4px] transition-all duration-200"
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: hasCheckin
                      ? 'var(--blush)'
                      : isToday
                      ? 'rgba(243, 198, 209, 0.3)'
                      : 'rgba(201, 184, 167, 0.1)',
                    border: isToday ? '2px solid var(--soft-pink)' : '2px solid transparent',
                    opacity: hasCheckin ? 1 : 0.6,
                  }}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: 'rgba(201, 184, 167, 0.15)' }} />
              <span className="font-body text-[10px]" style={{ color: 'var(--champagne)' }}>Sin actividad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: 'var(--blush)' }} />
              <span className="font-body text-[10px]" style={{ color: 'var(--champagne)' }}>Check-in</span>
            </div>
          </div>
        </motion.div>

        {/* Objective Cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredObjectives.map((objective, index) => {
              const isExpanded = expandedId === objective.id;
              const tasksDone = objective.tasks.filter(t => t.done).length;
              const tasksTotal = objective.tasks.length;
              const progress = tasksTotal > 0 ? (tasksDone / tasksTotal) * 100 : 0;
              const streak = getStreak(objective.checkins);
              const hasCheckedInToday = objective.checkins.some(c => c.date === today);
              const recentCheckins = [...objective.checkins]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5);

              return (
                <motion.div
                  key={objective.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Card */}
                  <div
                    className="bg-white rounded-2xl overflow-hidden transition-shadow duration-300"
                    style={{ boxShadow: isExpanded ? 'var(--shadow-glow-pink)' : 'var(--shadow-card)' }}
                  >
                    {/* Card Header — clickable */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : objective.id)}
                      className="w-full flex items-center gap-3 p-4 sm:p-5 text-left transition-colors hover:bg-gray-50/50"
                    >
                      {/* Priority + Emoji */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-1">
                        <span className="text-2xl">{objective.emoji}</span>
                        <span
                          className="font-body text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(201, 184, 167, 0.15)',
                            color: 'var(--champagne)',
                          }}
                        >
                          #{objective.priority}
                        </span>
                      </div>

                      {/* Title + Progress */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-body text-sm font-semibold truncate"
                          style={{ color: 'var(--graphite)' }}
                        >
                          {objective.title}
                        </h4>
                        <p
                          className="font-body text-xs mt-1 truncate"
                          style={{ color: 'rgba(44, 44, 44, 0.5)' }}
                        >
                          {objective.description}
                        </p>
                        {/* Progress Bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className="flex-1 h-1.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'rgba(243, 198, 209, 0.2)' }}
                          >
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: progress === 100
                                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                                  : 'linear-gradient(90deg, var(--soft-pink), var(--blush))',
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="font-body text-[10px] font-semibold" style={{ color: 'var(--champagne)' }}>
                            {tasksDone}/{tasksTotal}
                          </span>
                        </div>
                      </div>

                      {/* Right side: badges + chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {streak > 0 && (
                          <span
                            className="flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-bold"
                            style={{
                              backgroundColor: 'rgba(251, 146, 60, 0.12)',
                              color: '#f97316',
                            }}
                          >
                            <Flame size={12} />
                            {streak}
                          </span>
                        )}
                        {hasCheckedInToday && (
                          <span
                            className="flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-bold"
                            style={{
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              color: '#16a34a',
                            }}
                          >
                            <Check size={12} />
                            Hoy
                          </span>
                        )}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={18} style={{ color: 'var(--champagne)' }} />
                        </motion.div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4">
                            {/* Divider */}
                            <div className="h-px" style={{ backgroundColor: 'rgba(201, 184, 167, 0.15)' }} />

                            {/* Tasks */}
                            <div>
                              <h5 className="font-body text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--champagne)' }}>
                                Qué voy a hacer
                              </h5>
                              <ul className="space-y-2">
                                {objective.tasks.map((task) => (
                                  <li key={task.id}>
                                    <label
                                      className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                                      style={{
                                        backgroundColor: task.done ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => onToggleTask(objective.id, task.id)}
                                        className="mt-0.5 h-4 w-4 rounded flex-shrink-0"
                                        style={{ accentColor: 'var(--blush)' }}
                                      />
                                      <span
                                        className="font-body text-sm leading-relaxed"
                                        style={{
                                          color: task.done ? 'rgba(44, 44, 44, 0.4)' : 'var(--graphite)',
                                          textDecoration: task.done ? 'line-through' : 'none',
                                        }}
                                      >
                                        {task.title}
                                      </span>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Check-in Button */}
                            {checkinId !== objective.id ? (
                              <button
                                onClick={() => setCheckinId(objective.id)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body text-sm font-medium transition-all hover:shadow-sm"
                                style={{
                                  backgroundColor: hasCheckedInToday
                                    ? 'rgba(34, 197, 94, 0.08)'
                                    : 'rgba(243, 198, 209, 0.15)',
                                  color: hasCheckedInToday ? '#16a34a' : 'var(--blush)',
                                }}
                              >
                                <MessageSquare size={16} />
                                {hasCheckedInToday ? 'Actualizar check-in de hoy' : 'Hacer check-in de hoy'}
                              </button>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                              >
                                <textarea
                                  value={checkinNote}
                                  onChange={(e) => setCheckinNote(e.target.value)}
                                  placeholder="¿Qué hiciste hoy para avanzar en este objetivo?"
                                  rows={3}
                                  className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all resize-none"
                                  style={{
                                    borderColor: 'rgba(201, 184, 167, 0.4)',
                                    color: 'var(--graphite)',
                                  }}
                                  onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--soft-pink)';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(243, 198, 209, 0.2)';
                                  }}
                                  onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(201, 184, 167, 0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => { setCheckinId(null); setCheckinNote(''); }}
                                    className="flex-1 py-2.5 rounded-xl font-body text-sm border transition-colors"
                                    style={{ borderColor: 'rgba(201, 184, 167, 0.3)', color: 'var(--champagne)' }}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => handleCheckin(objective.id)}
                                    className="flex-1 py-2.5 rounded-xl font-body text-sm font-medium text-white transition-all"
                                    style={{ backgroundColor: 'var(--blush)' }}
                                  >
                                    ✓ Registrar
                                  </button>
                                </div>
                              </motion.div>
                            )}

                            {/* Recent Check-ins */}
                            {recentCheckins.length > 0 && (
                              <div>
                                <h5 className="font-body text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--champagne)' }}>
                                  Últimos check-ins
                                </h5>
                                <div className="space-y-2">
                                  {recentCheckins.map((checkin, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-3 p-3 rounded-xl"
                                      style={{ backgroundColor: 'rgba(243, 198, 209, 0.06)' }}
                                    >
                                      <div
                                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--blush)' }}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-body text-xs font-medium" style={{ color: 'var(--champagne)' }}>
                                          {new Date(checkin.date + 'T12:00:00').toLocaleDateString('es-AR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'short',
                                          })}
                                        </p>
                                        {checkin.note && (
                                          <p className="font-body text-sm mt-1 leading-relaxed" style={{ color: 'var(--graphite)' }}>
                                            {checkin.note}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteConfirm(objective.id)}
                              className="flex items-center gap-2 font-body text-xs transition-colors mx-auto mt-2"
                              style={{ color: 'rgba(239, 68, 68, 0.5)' }}
                            >
                              <Trash2 size={12} />
                              Eliminar objetivo
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredObjectives.length === 0 && (
          <div className="text-center py-16">
            <p className="font-body text-sm" style={{ color: 'var(--champagne)' }}>
              No hay objetivos todavía
            </p>
          </div>
        )}

        {/* Motivational Footer */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p
            className="font-body text-sm italic"
            style={{ color: 'var(--champagne)', opacity: 0.7 }}
          >
            "La idea no es ser perfecto, es ser consistente" 🤍
          </p>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
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
              <h4 className="font-body text-base font-medium mb-2" style={{ color: 'var(--graphite)' }}>
                ¿Eliminar este objetivo?
              </h4>
              <p className="font-body text-sm mb-6" style={{ color: 'var(--champagne)' }}>
                Se perderán todos los check-ins y el progreso
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 rounded-full font-body text-sm font-medium border transition-colors"
                  style={{ borderColor: 'var(--champagne)', color: 'var(--champagne)' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onDeleteObjective(deleteConfirm);
                    setDeleteConfirm(null);
                    setExpandedId(null);
                  }}
                  className="px-5 py-2.5 rounded-full font-body text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
