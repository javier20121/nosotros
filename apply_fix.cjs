const fs = require('fs');

const path = 'src/hooks/useLocalStorage.ts';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\\n');

// Find where `  journal: [` is to insert personalObjectives before it.
// Also, we need to REMOVE the garbage block (lines 364 to the closing brace before journal).
let journalIndex = -1;
let endOfGoalsIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('  journal: [')) {
    journalIndex = i;
  }
}

// Find the real end of goals. In HEAD, it might be around 363.
// But we want to preserve the rest of defaultData except the garbage block.
// Let's find the FIRST time `description: 'Preparar nuestro propio mantecol` appears.
let garbageStartIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("description: 'Preparar nuestro propio mantecol") && lines[i-1] && lines[i-1].includes("  ],")) {
    garbageStartIndex = i;
    break;
  }
}

if (garbageStartIndex !== -1 && journalIndex !== -1) {
  // We want to remove from garbageStartIndex up to the line right before journalIndex.
  lines.splice(garbageStartIndex, journalIndex - garbageStartIndex);
}

// Now the array of lines is clean. Let's find journal: [ again
journalIndex = lines.findIndex(l => l.startsWith('  journal: ['));

const objectives = `  personalObjectives: [
    // === JAVI ===
    {
      id: 'p-1',
      owner: 'javi',
      title: 'Despertarme antes de las 7 (Todos los días)',
      description: 'Empezar el día temprano y con energía.',
      emoji: '⏰',
      priority: 1,
      tasks: [
        { id: 'p-1-1', title: 'Poner alarma', done: false },
        { id: 'p-1-2', title: 'Pedirle a mi mamá que me llame', done: false },
        { id: 'p-1-3', title: 'Bañarme apenas me levanto', done: false },
        { id: 'p-1-4', title: 'Si no me levanto, correr 10km', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:00:00',
    },
    {
      id: 'p-2',
      owner: 'javi',
      title: 'Ingresos estables',
      description: 'Generar ingresos para comprar la compu/proyector.',
      emoji: '💼',
      priority: 2,
      tasks: [
        { id: 'p-2-1', title: 'Entregar mínimo 10 CV el lunes', done: false },
        { id: 'p-2-2', title: 'Buscar changas que den plata', done: false },
        { id: 'p-2-3', title: 'Ofrecer 1 página web por semana', done: false },
        { id: 'p-2-4', title: 'Ahorrar para la lana y proyector', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:01:00',
    },
    {
      id: 'p-3',
      owner: 'javi',
      title: 'Cuidar a Cami',
      description: 'Hacer que tenga una mejor vida y demostrarle mi amor.',
      emoji: '❤️',
      priority: 3,
      tasks: [
        { id: 'p-3-1', title: 'Demostrarle amor de todas las formas', done: false },
        { id: 'p-3-2', title: 'Ayudarla a que no pase por todo eso', done: false },
        { id: 'p-3-3', title: 'Independizarme para vivir juntos', done: false },
        { id: 'p-3-4', title: 'Tener carácter', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:02:00',
    },
    {
      id: 'p-4',
      owner: 'javi',
      title: 'Ser mejor bombero',
      description: 'Mejorar profesionalmente en el cuartel.',
      emoji: '🚒',
      priority: 4,
      tasks: [
        { id: 'p-4-1', title: 'Mejorar mis clases con los cadetes', done: false },
        { id: 'p-4-2', title: 'Buscar capacitación de instructor', done: false },
        { id: 'p-4-3', title: 'Cuidar a mis compañeros', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:03:00',
    },
    {
      id: 'p-5',
      owner: 'javi',
      title: 'Buscar a Dios',
      description: 'Estar bien espiritualmente y servir.',
      emoji: '🕊️',
      priority: 5,
      tasks: [
        { id: 'p-5-1', title: 'Orar con fe', done: false },
        { id: 'p-5-2', title: 'Leer la Biblia', done: false },
        { id: 'p-5-3', title: 'Tocar la guitarra/piano', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:04:00',
    },
    {
      id: 'p-6',
      owner: 'javi',
      title: 'No al Burnout',
      description: 'Cuidar mi mente y cuerpo.',
      emoji: '🧘‍♂️',
      priority: 6,
      tasks: [
        { id: 'p-6-1', title: 'Entrenar el tren inferior', done: false },
        { id: 'p-6-2', title: 'No sobrepensar', done: false },
        { id: 'p-6-3', title: 'Despejarme en la naturaleza', done: false },
        { id: 'p-6-4', title: 'Bajar las pajas', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:05:00',
    },
    // === CAMI ===
    {
      id: 'p-7',
      owner: 'cami',
      title: 'Rutina y Disciplina',
      description: 'Despertarme a las 8 y hacer hábito (21 días).',
      emoji: '🌅',
      priority: 1,
      tasks: [
        { id: 'p-7-1', title: 'Poner alarma y no dar vueltas', done: false },
        { id: 'p-7-2', title: 'Priorizar mis ocupaciones', done: false },
        { id: 'p-7-3', title: 'Reducir tiempo en pantalla', done: false },
        { id: 'p-7-4', title: 'Castigo: Si no me levanto, 1h antes al día sig.', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:06:00',
    },
    {
      id: 'p-8',
      owner: 'cami',
      title: 'Activar ingresos y Criatto',
      description: 'Generar ventas pasivas y buscar ingreso extra.',
      emoji: '🎨',
      priority: 2,
      tasks: [
        { id: 'p-8-1', title: 'Activar redes de Criatto', done: false },
        { id: 'p-8-2', title: 'Armar catálogo de productos', done: false },
        { id: 'p-8-3', title: 'Generar ventas de archivos digitales', done: false },
        { id: 'p-8-4', title: 'Conseguir ingreso extra en otra empresa', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:07:00',
    },
    {
      id: 'p-9',
      owner: 'cami',
      title: 'Vida espiritual',
      description: 'Despertarme y hacer el devocional todos los días.',
      emoji: '📖',
      priority: 3,
      tasks: [
        { id: 'p-9-1', title: 'Terminar libros de la Biblia en curso', done: false },
        { id: 'p-9-2', title: 'Hacer devocional en cuanto me levante', done: false },
        { id: 'p-9-3', title: 'Memorizar un versículo a la semana', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:08:00',
    },
    {
      id: 'p-10',
      owner: 'cami',
      title: 'Fortalecerme emocionalmente',
      description: 'Ser fuerte por mis hermanas y no dejarme pisotear.',
      emoji: '🛡️',
      priority: 4,
      tasks: [
        { id: 'p-10-1', title: 'Poner mi esperanza y amor en Dios', done: false },
        { id: 'p-10-2', title: 'No dejar que me menosprecien', done: false },
        { id: 'p-10-3', title: 'Valorarme', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:09:00',
    },
    {
      id: 'p-11',
      owner: 'cami',
      title: 'Psicología en la UAP',
      description: 'Planificar mis estudios universitarios.',
      emoji: '🧠',
      priority: 5,
      tasks: [
        { id: 'p-11-1', title: 'Investigar bien para ingresar', done: false },
        { id: 'p-11-2', title: 'Ir ahorrando plata', done: false },
        { id: 'p-11-3', title: 'Hacer cursos y adelantar materias', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:10:00',
    },
    {
      id: 'p-12',
      owner: 'cami',
      title: 'Disfrutar el proceso',
      description: 'Menos quejas, más agradecimiento.',
      emoji: '✨',
      priority: 6,
      tasks: [
        { id: 'p-12-1', title: 'No estresarme tanto por el futuro', done: false },
        { id: 'p-12-2', title: 'No quejarme tanto, hacer las cosas', done: false },
        { id: 'p-12-3', title: 'Disfrutar a Javi, hermanas, amigas y flia', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:11:00',
    },
  ],`;
if (journalIndex !== -1) {
  lines.splice(journalIndex, 0, objectives);
}

// Join lines back
content = lines.join('\\n');

// 3. Add CRUD functions to useAppData
const returnStatement = `  return {
    data,
    startDate: START_DATE,
    addGoal,
    updateGoal,
    addPhotoToGoal,
    deletePhotoFromGoal,
    deleteGoal,
    addPhoto,
    deletePhoto,
    addJournalEntry,
    openLetter,
  };`;

const newReturnStatement = `  // Personal Objectives CRUD
  const toggleObjectiveTask = useCallback((objectiveId: string, taskId: string) => {
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.map(obj => {
        if (obj.id !== objectiveId) return obj;
        return {
          ...obj,
          tasks: obj.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        };
      })
    }));
  }, []);

  const addObjectiveCheckin = useCallback((objectiveId: string, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.map(obj => {
        if (obj.id !== objectiveId) return obj;
        const hasToday = obj.checkins.some(c => c.date === today);
        if (hasToday) {
          return {
            ...obj,
            checkins: obj.checkins.map(c => c.date === today ? { ...c, note } : c)
          };
        } else {
          return {
            ...obj,
            checkins: [...obj.checkins, { date: today, note }]
          };
        }
      })
    }));
  }, []);

  const addObjective = useCallback((objective: any) => {
    setData(prev => ({
      ...prev,
      personalObjectives: [...prev.personalObjectives, objective]
    }));
  }, []);

  const deleteObjective = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.filter(o => o.id !== id)
    }));
  }, []);

  return {
    data,
    startDate: START_DATE,
    addGoal,
    updateGoal,
    addPhotoToGoal,
    deletePhotoFromGoal,
    deleteGoal,
    toggleObjectiveTask,
    addObjectiveCheckin,
    addObjective,
    deleteObjective,
    addPhoto,
    deletePhoto,
    addJournalEntry,
    openLetter,
  };`;

content = content.replace(returnStatement, newReturnStatement);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed successfully');
