import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Goal, GoalStatus, GoalTask } from '@/types'

const STORAGE_KEY = 'jc_island_data'

type DbGoal = {
  id: string
  title: string
  description: string
  status: GoalStatus
  photos: string[]
  tasks: GoalTask[]
  created_at: string
}

const fromDb = (r: DbGoal): Goal => ({
  id: r.id,
  title: r.title,
  description: r.description,
  status: r.status,
  photos: r.photos ?? [],
  tasks: r.tasks ?? [],
  createdAt: r.created_at,
})

function loadGoalsFromStorage(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultGoals()
    const parsed = JSON.parse(raw) as { goals?: any[] }
    if (!Array.isArray(parsed?.goals) || parsed.goals.length === 0) return getDefaultGoals()
    return parsed.goals.map((g: any) => ({
      id: g.id || crypto.randomUUID(),
      title: String(g.title || ''),
      description: String(g.description || ''),
      status: g.status || 'pending',
      photos: Array.isArray(g.photos) ? g.photos : [],
      tasks: Array.isArray(g.tasks)
        ? g.tasks.map((t: any) => ({
            id: t.id || crypto.randomUUID(),
            title: String(t.title || ''),
            done: Boolean(t.done),
          }))
        : [],
      createdAt: g.createdAt || new Date().toISOString(),
    }))
  } catch {
    return getDefaultGoals()
  }
}

function getDefaultGoals(): Goal[] {
  return [
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
}

function saveGoalsToStorage(goals: Goal[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    data.goals = goals
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function useGoals(initialLoad = true) {
  const [goals, setGoals] = useState<Goal[]>(loadGoalsFromStorage)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    const load = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      const dbGoals = (data ?? []).map(fromDb)
      if (dbGoals.length > 0) {
        setGoals(dbGoals)
        saveGoalsToStorage(dbGoals)
      }
      setLoading(false)
    }

  const reload = useCallback(load, [])

  useEffect(() => {
    let mounted = true

    if (initialLoad) {
      load()
    }

    const ch = supabase
      .channel('goals-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals' },
        (p) => {
          if (p.eventType === 'INSERT') {
            setGoals((prev) => [fromDb(p.new as DbGoal), ...prev])
          } else if (p.eventType === 'UPDATE') {
            setGoals((prev) =>
              prev.map((g) => (g.id === (p.new as DbGoal).id ? fromDb(p.new as DbGoal) : g))
            )
          } else if (p.eventType === 'DELETE') {
            const oldId = (p.old as Partial<DbGoal>)?.id
            if (!oldId) return
            setGoals((prev) => prev.filter((g) => g.id !== oldId))
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [initialLoad])

  const addGoal = useCallback(async (g: Omit<Goal, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('goals').insert({
      id: crypto.randomUUID(),
      title: g.title,
      description: g.description,
      status: g.status,
      photos: g.photos,
      tasks: g.tasks,
    })
    if (error) setError(error.message)
  }, [])

  const updateGoal = useCallback(async (id: string, patch: Partial<Goal>) => {
    const row: Partial<DbGoal> = {}
    if (patch.title !== undefined) row.title = patch.title
    if (patch.description !== undefined) row.description = patch.description
    if (patch.status !== undefined) row.status = patch.status
    if (patch.photos !== undefined) row.photos = patch.photos
    if (patch.tasks !== undefined) row.tasks = patch.tasks

    const { error } = await supabase.from('goals').update(row).eq('id', id)
    if (!error) {
      setGoals((prev) => {
        const next = prev.map((g) => (g.id === id ? { ...g, ...patch } : g))
        saveGoalsToStorage(next)
        return next
      })
    }
    if (error) setError(error.message)
  }, [])

  const deleteGoal = useCallback(async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (error) setError(error.message)
  }, [])

  const addPhoto = useCallback(
    async (goalId: string, photoSrc: string) => {
      const current = await supabase.from('goals').select('photos').eq('id', goalId).single()
      if (current.error) {
        setError(current.error.message)
        return
      }
      const next = [...(current.data?.photos ?? []), photoSrc]
      const { error } = await supabase.from('goals').update({ photos: next }).eq('id', goalId)
      if (!error) {
        setGoals((prev) => {
          const updated = prev.map((g) => (g.id === goalId ? { ...g, photos: next } : g))
          saveGoalsToStorage(updated)
          return updated
        })
      }
      if (error) setError(error.message)
    },
    []
  )

  const deletePhoto = useCallback(async (goalId: string, photoIndex: number) => {
    const current = await supabase.from('goals').select('photos').eq('id', goalId).single()
    if (current.error) {
      setError(current.error.message)
      return
    }
    const next = (current.data?.photos ?? []).filter((_: string, i: number) => i !== photoIndex)
    const { error } = await supabase.from('goals').update({ photos: next }).eq('id', goalId)
    if (!error) {
      setGoals((prev) => {
        const updated = prev.map((g) => (g.id === goalId ? { ...g, photos: next } : g))
        saveGoalsToStorage(updated)
        return updated
      })
    }
    if (error) setError(error.message)
  }, [])

  return { goals, loading, error, addGoal, updateGoal, deleteGoal, addPhoto, deletePhoto, reload }
}
