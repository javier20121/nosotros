import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useGoals } from './useGoals'
import { usePersonalObjectives } from './usePersonalObjectives'
import { useJournalEntries } from './useJournal'
import { useLocalAppData } from './useLocalAppData'
import type { AppData, Goal } from '@/types'

const STORAGE_KEY = 'jc_island_data'

type LegacyData = {
  goals?: any[]
  personalObjectives?: any[]
  journal?: any[]
}

function readLegacyLocal(): LegacyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as LegacyData
  } catch {
    return {}
  }
}

async function migrateGoals(goals: any[]) {
  if (!goals || goals.length === 0) return
  const rows = goals.map((g) => ({
    id: crypto.randomUUID(),
    title: String(g.title || ''),
    description: String(g.description || ''),
    status: g.status || 'pending',
    photos: Array.isArray(g.photos) ? g.photos : [],
    tasks: Array.isArray(g.tasks)
      ? g.tasks.map((t: any) => ({
          id: crypto.randomUUID(),
          title: String(t.title || ''),
          done: Boolean(t.done),
        }))
      : [],
    created_at: g.createdAt || new Date().toISOString(),
  }))
  const { error } = await supabase.from('goals').insert(rows)
  if (error) throw error
}

async function migrateObjectives(objectives: any[]) {
  if (!objectives || objectives.length === 0) return
  const rows = objectives.map((o) => ({
    id: crypto.randomUUID(),
    owner: o.owner || 'javi',
    title: String(o.title || ''),
    description: String(o.description || ''),
    emoji: o.emoji || '🌱',
    priority: o.priority ?? 0,
    tasks: Array.isArray(o.tasks)
      ? o.tasks.map((t: any) => ({
          id: crypto.randomUUID(),
          title: String(t.title || ''),
          done: Boolean(t.done),
        }))
      : [],
    checkins: Array.isArray(o.checkins) ? o.checkins : [],
    created_at: o.createdAt || new Date().toISOString(),
  }))
  const { error } = await supabase.from('personal_objectives').insert(rows)
  if (error) throw error
}

async function migrateJournal(entries: any[]) {
  if (!entries || entries.length === 0) return
  const rows = entries.map((e) => ({
    id: crypto.randomUUID(),
    title: String(e.title || ''),
    date: e.date || '',
    location: e.location ?? '',
    body: e.body ?? '',
    photos: Array.isArray(e.photos) ? e.photos : [],
    mood_tags: Array.isArray(e.moodTags) ? e.moodTags : [],
    created_at: e.createdAt || new Date().toISOString(),
  }))
  const { error } = await supabase.from('journal_entries').insert(rows)
  if (error) throw error
}

async function createInitialData() {
  const defaultJournal = [
    {
      id: crypto.randomUUID(),
      title: 'Nuestro finde en Villa de Leyva',
      date: '2023-09-18',
      location: 'Villa de Leyva, Boyacá',
      body: 'Llegamos el viernes por la tarde y la luz dorada del atardecer nos recibió como una bendición. Caminamos por las calles empedradas, tomamos chocolate caliente en la plaza y nos reímos hasta que nos dolió la panza. Esos son los momentos que guardo en el corazón.',
      photos: [],
      mood_tags: ['Aventura', 'Romance', 'Chocolate'],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'El día que Stitch aprendió a sentarse',
      date: '2024-01-20',
      location: 'Casa, Bogotá',
      body: 'Después de tres semanas de intentarlo, Stitch finalmente sentó su trasero peludo en comando! Celebramos con premios y una sesión de fotos que duró media hora. Es increíble cómo las pequeñas cosas se sienten tan grandes cuando las compartes con alguien especial.',
      photos: [],
      mood_tags: ['Stitch', 'Felicidad', 'Hogar'],
      created_at: new Date().toISOString(),
    },
  ]

  // No hay objetivos personales por defecto, pero la tabla debe existir.
  // Dejamos esto como ejemplo si se quisieran agregar en el futuro.
  const defaultPersonalObjectives: any[] = []

  const defaultGoals: Goal[] = [
    {
      id: crypto.randomUUID(),
      title: 'Hacer mantecol casero',
      description: 'Preparar nuestro propio mantecol desde cero y compartirlo mientras nos reímos de los errores de la receta.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Buscar una receta', done: false },
        { id: crypto.randomUUID(), title: 'Comprar los ingredientes', done: false },
        { id: crypto.randomUUID(), title: 'Elegir un día para cocinar', done: false },
        { id: crypto.randomUUID(), title: 'Sacar fotos del proceso', done: false },
        { id: crypto.randomUUID(), title: 'Calificar el resultado del 1 al 10', done: false },
      ],
      createdAt: '2026-06-13T10:00:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Hacer los cuadritos',
      description: 'Crear arte juntos y decorar nuestros espacios con algo hecho por nosotros.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir diseño', done: false },
        { id: crypto.randomUUID(), title: 'Pintarlos', done: false },
        { id: crypto.randomUUID(), title: 'Terminarlos', done: false },
        { id: crypto.randomUUID(), title: 'Sacar una foto del resultado', done: false },
      ],
      createdAt: '2026-06-13T10:10:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Ir al club juntos',
      description: 'Pasar un día relajados disfrutando del agua, el sol y nuestra compañía.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir fecha', done: false },
        { id: crypto.randomUUID(), title: 'Preparar mochila', done: false },
        { id: crypto.randomUUID(), title: 'Llevar mate', done: false },
        { id: crypto.randomUUID(), title: 'Sacarnos una foto juntos', done: false },
      ],
      createdAt: '2026-06-13T10:20:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Picnic en un arroyito',
      description: 'Escaparnos un rato del mundo y disfrutar de la naturaleza.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Buscar el lugar', done: false },
        { id: crypto.randomUUID(), title: 'Preparar comida', done: false },
        { id: crypto.randomUUID(), title: 'Llevar manta', done: false },
        { id: crypto.randomUUID(), title: 'Tomar fotos', done: false },
        { id: crypto.randomUUID(), title: 'Ver el atardecer', done: false },
      ],
      createdAt: '2026-06-13T10:30:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Tocar el piano',
      description: 'Aprender una canción especial para nosotros.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir canción', done: false },
        { id: crypto.randomUUID(), title: 'Aprender acordes básicos', done: false },
        { id: crypto.randomUUID(), title: 'Practicar juntos', done: false },
        { id: crypto.randomUUID(), title: 'Grabar el resultado', done: false },
      ],
      createdAt: '2026-06-13T10:40:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Tomar mate al amanecer',
      description: 'Ver salir el sol mientras compartimos un mate.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir lugar', done: false },
        { id: crypto.randomUUID(), title: 'Preparar termo', done: false },
        { id: crypto.randomUUID(), title: 'Levantarse temprano', done: false },
        { id: crypto.randomUUID(), title: 'Sacar una foto del amanecer', done: false },
      ],
      createdAt: '2026-06-13T10:50:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Trasnochar trabajando',
      description: 'Pasar una noche construyendo proyectos, estudiando o simplemente acompañándonos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir proyecto', done: false },
        { id: crypto.randomUUID(), title: 'Preparar café o mate', done: false },
        { id: crypto.randomUUID(), title: 'Hacer una playlist', done: false },
        { id: crypto.randomUUID(), title: 'Ver quién aguanta más despierto', done: false },
      ],
      createdAt: '2026-06-13T11:00:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Ver una saga completa',
      description: 'Maratón de películas con manta, comida y cero interrupciones.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir saga', done: false },
        { id: crypto.randomUUID(), title: 'Preparar snacks', done: false },
        { id: crypto.randomUUID(), title: 'Organizar fechas', done: false },
        { id: crypto.randomUUID(), title: 'Puntuar cada película', done: false },
      ],
      createdAt: '2026-06-13T11:10:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Acampar',
      description: 'Dormir bajo las estrellas y crear recuerdos inolvidables.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir lugar', done: false },
        { id: crypto.randomUUID(), title: 'Preparar equipo', done: false },
        { id: crypto.randomUUID(), title: 'Llevar comida', done: false },
        { id: crypto.randomUUID(), title: 'Ver el amanecer', done: false },
        { id: crypto.randomUUID(), title: 'Sacar fotos nocturnas', done: false },
      ],
      createdAt: '2026-06-13T11:20:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Sentarse a ver la lluvia',
      description: 'Disfrutar juntos de un día lluvioso sin hacer nada más.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Buscar refugio', done: false },
        { id: crypto.randomUUID(), title: 'Compartir mate', done: false },
        { id: crypto.randomUUID(), title: 'Escuchar la lluvia', done: false },
        { id: crypto.randomUUID(), title: 'Crear un recuerdo', done: false },
      ],
      createdAt: '2026-06-13T11:30:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Viernes de tacos',
      description: 'Convertir los viernes en una tradición deliciosa.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Comprar ingredientes', done: false },
        { id: crypto.randomUUID(), title: 'Cocinar juntos', done: false },
        { id: crypto.randomUUID(), title: 'Probar una receta nueva', done: false },
        { id: crypto.randomUUID(), title: 'Elegir el mejor taco', done: false },
      ],
      createdAt: '2026-06-13T11:40:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Ver Lucifer',
      description: 'Disfrutar la serie juntos comentando cada episodio.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Empezar la serie', done: false },
        { id: crypto.randomUUID(), title: 'Llevar registro de capítulos', done: false },
        { id: crypto.randomUUID(), title: 'Elegir personaje favorito', done: false },
        { id: crypto.randomUUID(), title: 'Terminar todas las temporadas', done: false },
      ],
      createdAt: '2026-06-13T11:50:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Noche de juegos',
      description: 'Competir, reírnos y pasar una noche diferente.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir juegos', done: false },
        { id: crypto.randomUUID(), title: 'Preparar snacks', done: false },
        { id: crypto.randomUUID(), title: 'Llevar marcador', done: false },
        { id: crypto.randomUUID(), title: 'Coronar al campeón', done: false },
      ],
      createdAt: '2026-06-13T12:00:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Saltar en paracaídas',
      description: 'Enfrentar el miedo y vivir una aventura extrema juntos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Investigar lugares', done: false },
        { id: crypto.randomUUID(), title: 'Ahorrar dinero', done: false },
        { id: crypto.randomUUID(), title: 'Reservar fecha', done: false },
        { id: crypto.randomUUID(), title: 'Grabar la experiencia', done: false },
      ],
      createdAt: '2026-06-13T12:10:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Mates de limón',
      description: 'Compartir una tarde diferente probando algo que nos identifica.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Conseguir limones', done: false },
        { id: crypto.randomUUID(), title: 'Preparar mate', done: false },
        { id: crypto.randomUUID(), title: 'Encontrar la combinación perfecta', done: false },
        { id: crypto.randomUUID(), title: 'Sacar una foto', done: false },
      ],
      createdAt: '2026-06-13T12:20:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Sacarse fotos lindas juntos',
      description: 'Guardar recuerdos de cada etapa de nuestra historia.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir lugar', done: false },
        { id: crypto.randomUUID(), title: 'Coordinar ropa', done: false },
        { id: crypto.randomUUID(), title: 'Sacar varias fotos', done: false },
        { id: crypto.randomUUID(), title: 'Elegir favoritas', done: false },
        { id: crypto.randomUUID(), title: 'Crear álbum', done: false },
      ],
      createdAt: '2026-06-13T12:30:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Leer libros juntos',
      description: 'Aprender y crecer compartiendo historias y conocimientos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir libro', done: false },
        { id: crypto.randomUUID(), title: 'Definir ritmo de lectura', done: false },
        { id: crypto.randomUUID(), title: 'Comentar capítulos', done: false },
        { id: crypto.randomUUID(), title: 'Terminarlo juntos', done: false },
      ],
      createdAt: '2026-06-13T12:40:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Crear hábitos sanos juntos',
      description: 'Ayudarnos a ser mejores cada día.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Definir objetivos', done: false },
        { id: crypto.randomUUID(), title: 'Crear seguimiento', done: false },
        { id: crypto.randomUUID(), title: 'Celebrar avances', done: false },
        { id: crypto.randomUUID(), title: 'Mantener constancia', done: false },
      ],
      createdAt: '2026-06-13T12:50:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Regular horarios de sueño',
      description: 'Dormir mejor para vivir mejor.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Definir horario', done: false },
        { id: crypto.randomUUID(), title: 'Evitar pantallas antes de dormir', done: false },
        { id: crypto.randomUUID(), title: 'Hacer seguimiento semanal', done: false },
        { id: crypto.randomUUID(), title: 'Cumplir un mes completo', done: false },
      ],
      createdAt: '2026-06-13T13:00:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Tener momentos de paz y reflexión',
      description: 'Detenernos para valorar lo que tenemos y hacia dónde vamos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Elegir un lugar tranquilo', done: false },
        { id: crypto.randomUUID(), title: 'Conversar sin distracciones', done: false },
        { id: crypto.randomUUID(), title: 'Compartir pensamientos', done: false },
        { id: crypto.randomUUID(), title: 'Registrar reflexiones', done: false },
      ],
      createdAt: '2026-06-13T13:10:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Mantener el devocional diario',
      description: 'Buscar a Dios juntos y fortalecer nuestra relación a través de la fe.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Leer un pasaje bíblico', done: false },
        { id: crypto.randomUUID(), title: 'Compartir reflexión', done: false },
        { id: crypto.randomUUID(), title: 'Orar juntos', done: false },
        { id: crypto.randomUUID(), title: 'Mantener una racha de 30 días', done: false },
      ],
      createdAt: '2026-06-13T13:20:00',
    },
    {
      id: crypto.randomUUID(),
      title: 'Casarse',
      description: 'Construir una vida juntos basada en amor, compromiso, respeto y fe.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: crypto.randomUUID(), title: 'Hablar sobre nuestros sueños', done: false },
        { id: crypto.randomUUID(), title: 'Construir estabilidad emocional', done: false },
        { id: crypto.randomUUID(), title: 'Construir estabilidad económica', done: false },
        { id: crypto.randomUUID(), title: 'Conocer más profundamente nuestras diferencias', done: false },
        { id: crypto.randomUUID(), title: 'Planear el futuro juntos', done: false },
        { id: crypto.randomUUID(), title: 'Dar el paso cuando llegue el momento correcto', done: false },
      ],
      createdAt: '2026-06-13T13:30:00',
    },
  ]

  const [
    { data: existingGoals, error: goalsError },
    { data: existingJournal, error: journalError },
    { data: existingObjectives, error: objectivesError },
  ] = await Promise.all([
    supabase.from('goals').select('id', { count: 'exact', head: true }),
    supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
    supabase.from('personal_objectives').select('id', { count: 'exact', head: true }),
  ])

  if (goalsError) throw goalsError
  if (journalError) throw journalError
  if (objectivesError) throw objectivesError

  if (!existingGoals || existingGoals.length === 0) {
    const { error } = await supabase.from('goals').insert(defaultGoals)
    if (error) throw error
  }
  if (!existingJournal || existingJournal.length === 0) {
    const { error } = await supabase.from('journal_entries').insert(defaultJournal)
    if (error) throw error
  }
  if (!existingObjectives || existingObjectives.length === 0) {
    const { error } = await supabase.from('personal_objectives').insert(defaultPersonalObjectives)
    if (error) throw error
  }
}

async function initializeDatabase() {
  // Esta función es idempotente. Se puede ejecutar en cada inicio sin problemas.

  const legacy = readLegacyLocal()

  // 1. Verificamos el estado de las tablas en Supabase.
  const [
    { data: existingGoals, error: goalsError },
    { data: existingObjectives, error: objectivesError },
    { data: existingJournal, error: journalError },
  ] = await Promise.all([
    supabase.from('goals').select('id', { count: 'exact', head: true }),
    supabase.from('personal_objectives').select('id', { count: 'exact', head: true }),
    supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
  ])

  if (goalsError) throw goalsError
  if (objectivesError) throw objectivesError
  if (journalError) throw journalError

  // 2. Migramos los datos legacy solo si la tabla correspondiente en Supabase está vacía.
  const migrationPromises: Promise<any>[] = []
  if (!existingGoals || existingGoals.length === 0) {
    migrationPromises.push(migrateGoals(legacy.goals ?? []))
  }
  if (!existingObjectives || existingObjectives.length === 0) {
    migrationPromises.push(migrateObjectives(legacy.personalObjectives ?? []))
  }
  if (!existingJournal || existingJournal.length === 0) {
    migrationPromises.push(migrateJournal(legacy.journal ?? []))
  }

  await Promise.all(migrationPromises)

  // 3. Si después de la migración alguna tabla sigue vacía, creamos los datos iniciales.
  await createInitialData()

  // 4. Limpiamos el localStorage de los datos ya migrados para no volver a leerlos.
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    delete parsed.goals
    delete parsed.personalObjectives
    delete parsed.journal
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  }
}

export function useAppData() {
  const local = useLocalAppData()
  // Inicializamos los hooks, pero prevenimos su carga automática de datos.
  // El orquestador se encargará de llamarlos.
  const goalsHook = useGoals(false)
  const objectivesHook = usePersonalObjectives(false)
  const journalHook = useJournalEntries(false)

  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const migrationDone = useRef(false)

  useEffect(() => {
    let mounted = true

    async function init() {
      if (migrationDone.current) return

      // Este bloque se ejecuta UNA SOLA VEZ por carga de la aplicación.
      try {
        // La función `initializeDatabase` es segura para ejecutarse en cada inicio.
        await initializeDatabase()
        migrationDone.current = true

        // Una vez que la data en Supabase está garantizada (ya sea por migración,
        // creación inicial, o porque ya existía), recargamos TODO desde cero.
        if (mounted) {
          await Promise.all([
            goalsHook.reload(),
            objectivesHook.reload(),
            journalHook.reload(),
          ])
        }
      } catch (e) {
        if (mounted) {
          console.error('SUPABASE ERROR:', e)
          if (e instanceof Error) {
            setError(`Error: ${e.message}`)
          } else if (typeof e === 'object' && e !== null && 'message' in e) {
            const supabaseError = e as { message: string; details?: string; code?: string }
            const errorMessage = `Error de Supabase: ${supabaseError.message} (Code: ${supabaseError.code ?? 'N/A'})`
            setError(errorMessage)
          } else {
            setError('Ocurrió un error inesperado.')
          }
        }
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (
      !goalsHook.loading &&
      !objectivesHook.loading &&
      !journalHook.loading &&
      migrationDone.current
    ) {
      setReady(true)
    }
  }, [
    goalsHook.loading,
    objectivesHook.loading,
    journalHook.loading,
    migrationDone.current,
  ])

  const isLoading = !ready

  const data: AppData = ready
    ? {
        ...local.data,
        goals: goalsHook.goals,
        personalObjectives: objectivesHook.objectives,
        journal: journalHook.entries,
      }
    : local.data

  return {
    data,
    startDate: local.startDate,
    isLoading,
    error: error || goalsHook.error || objectivesHook.error || journalHook.error || null,
    addGoal: goalsHook.addGoal,
    updateGoal: goalsHook.updateGoal,
    addPhotoToGoal: goalsHook.addPhoto,
    deletePhotoFromGoal: goalsHook.deletePhoto,
    deleteGoal: goalsHook.deleteGoal,
    toggleObjectiveTask: objectivesHook.toggleTask,
    addObjectiveCheckin: objectivesHook.addCheckin,
    deleteObjective: objectivesHook.deleteObjective,
    addPhoto: local.addPhoto,
    addJournalEntry: journalHook.addEntry,
    openLetter: local.openLetter,
  }
}