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
    created_at: g.createdAt || new Date().toISOString(),
  }))
  const { error } = await supabase.from('goals').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

async function migrateObjectives(objectives: any[]) {
  if (!objectives || objectives.length === 0) return
  const rows = objectives.map((o) => ({
    id: o.id || crypto.randomUUID(),
    owner: o.owner || 'javi',
    title: String(o.title || ''),
    description: String(o.description || ''),
    emoji: o.emoji || '🌱',
    priority: o.priority ?? 0,
    tasks: Array.isArray(o.tasks)
      ? o.tasks.map((t: any) => ({
          id: t.id || crypto.randomUUID(),
          title: String(t.title || ''),
          done: Boolean(t.done),
        }))
      : [],
    checkins: Array.isArray(o.checkins) ? o.checkins : [],
    created_at: o.createdAt || new Date().toISOString(),
  }))
  const { error } = await supabase.from('personal_objectives').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

async function migrateJournal(entries: any[]) {
  if (!entries || entries.length === 0) return
  const rows = entries.map((e) => ({
    id: e.id || crypto.randomUUID(),
    title: String(e.title || ''),
    date: e.date || '',
    location: e.location ?? '',
    body: e.body ?? '',
    photos: Array.isArray(e.photos) ? e.photos : [],
    mood_tags: Array.isArray(e.moodTags) ? e.moodTags : [],
    created_at: e.createdAt || new Date().toISOString(),
  }))
  const { error } = await supabase.from('journal_entries').upsert(rows, { onConflict: 'id' })
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
  const defaultPersonalObjectives = [
    // === OBJETIVOS DE JAVI ===
    {
      id: crypto.randomUUID(),
      owner: 'javi',
      title: 'Construir una rutina saludable y despertar temprano',
      description: 'Despertarme temprano, crear hábitos sólidos, comenzar el día con Dios y organizar mejor mi tiempo.',
      emoji: '☀️',
      priority: 3,
      tasks: [
        { id: crypto.randomUUID(), title: 'Despertarme antes de las 7 todos los días.', done: false },
        { id: crypto.randomUUID(), title: 'Poner alarma.', done: false },
        { id: crypto.randomUUID(), title: 'Pedirle a mi mamá que me llame.', done: false },
        { id: crypto.randomUUID(), title: 'Bañarme apenas me levanto.', done: false },
        { id: crypto.randomUUID(), title: 'Si no me levanto cumplir una penalización física.', done: false },
        { id: crypto.randomUUID(), title: 'Hacer devocional todos los días.', done: false },
        { id: crypto.randomUUID(), title: 'Estar trabajando a las 9.', done: false },
        { id: crypto.randomUUID(), title: 'Mantener la rutina durante 21 días.', done: false },
        { id: crypto.randomUUID(), title: 'Reducir el tiempo en redes sociales.', done: false },
        { id: crypto.randomUUID(), title: 'Priorizar mis responsabilidades.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'javi',
      title: 'Lograr estabilidad económica',
      description: 'Construir ingresos estables mediante trabajo, emprendimientos y ventas.',
      emoji: '💸',
      priority: 3,
      tasks: [
        { id: crypto.randomUUID(), title: 'Entregar mínimo 10 CV.', done: false },
        { id: crypto.randomUUID(), title: 'Buscar ingresos mientras consigo trabajo.', done: false },
        { id: crypto.randomUUID(), title: 'Ofrecer una página web por semana.', done: false },
        { id: crypto.randomUUID(), title: 'Activar Criatto.', done: false },
        { id: crypto.randomUUID(), title: 'Crear un catálogo.', done: false },
        { id: crypto.randomUUID(), title: 'Crear productos digitales.', done: false },
        { id: crypto.randomUUID(), title: 'Actualizar CV.', done: false },
        { id: crypto.randomUUID(), title: 'Actualizar portafolio.', done: false },
        { id: crypto.randomUUID(), title: 'Reorganizar servicios.', done: false },
        { id: crypto.randomUUID(), title: 'Vender máquinas que no utilizo.', done: false },
        { id: crypto.randomUUID(), title: 'Ahorrar para comprar una impresora láser y un proyector.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'javi',
      title: 'Fortalecer mi relación con Dios',
      description: 'Poner a Dios primero y vivir conforme a Su propósito.',
      emoji: '🙏',
      priority: 3,
      tasks: [
        { id: crypto.randomUUID(), title: 'Devocional diario.', done: false },
        { id: crypto.randomUUID(), title: 'Oración diaria.', done: false },
        { id: crypto.randomUUID(), title: 'Estudio bíblico.', done: false },
        { id: crypto.randomUUID(), title: 'Servir en la iglesia.', done: false },
        { id: crypto.randomUUID(), title: 'Buscar dónde Dios quiere que sirva.', done: false },
        { id: crypto.randomUUID(), title: 'Hablar con mis pastores.', done: false },
        { id: crypto.randomUUID(), title: 'Mejorar mi carácter.', done: false },
        { id: crypto.randomUUID(), title: 'Dejar conductas que dañan a otros.', done: false },
        { id: crypto.randomUUID(), title: 'Buscar una relación cada vez más cercana con Dios.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'javi',
      title: 'Ser mejor bombero',
      description: 'Crecer como bombero e instructor para brindar un mejor servicio.',
      emoji: '👨‍🚒',
      priority: 2,
      tasks: [
        { id: crypto.randomUUID(), title: 'Mejorar las clases con los cadetes.', done: false },
        { id: crypto.randomUUID(), title: 'Buscar capacitaciones.', done: false },
        { id: crypto.randomUUID(), title: 'Cuidar el EPP.', done: false },
        { id: crypto.randomUUID(), title: 'Entrenar una hora diaria.', done: false },
        { id: crypto.randomUUID(), title: 'Estar más disponible.', done: false },
        { id: crypto.randomUUID(), title: 'Mejorar el servicio.', done: false },
        { id: crypto.randomUUID(), title: 'Aportar ideas.', done: false },
        { id: crypto.randomUUID(), title: 'Evitar los dramas internos.', done: false },
        { id: crypto.randomUUID(), title: 'Formarme constantemente.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'javi',
      title: 'Formarme profesionalmente',
      description: 'Prepararme para estudiar Psicología y crecer profesionalmente.',
      emoji: '🎓',
      priority: 2,
      tasks: [
        { id: crypto.randomUUID(), title: 'Estudiar Psicología en la UAP.', done: false },
        { id: crypto.randomUUID(), title: 'Prepararme económicamente.', done: false },
        { id: crypto.randomUUID(), title: 'Trabajar mientras estudio.', done: false },
        { id: crypto.randomUUID(), title: 'Seguir aprendiendo constantemente.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'javi',
      title: 'Cuidar mi salud emocional',
      description: 'Evitar el burnout y mantener un equilibrio saludable.',
      emoji: '🧘‍♂️',
      priority: 1,
      tasks: [
        { id: crypto.randomUUID(), title: 'Descansar.', done: false },
        { id: crypto.randomUUID(), title: 'Tomar pausas.', done: false },
        { id: crypto.randomUUID(), title: 'Compartir mates.', done: false },
        { id: crypto.randomUUID(), title: 'Reír.', done: false },
        { id: crypto.randomUUID(), title: 'Llorar cuando sea necesario.', done: false },
        { id: crypto.randomUUID(), title: 'Disfrutar el proceso.', done: false },
        { id: crypto.randomUUID(), title: 'Buscar constancia antes que perfección.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'javi',
      title: 'Disfrutar la vida',
      description: 'Vivir una vida auténtica sin depender de la aprobación de los demás.',
      emoji: '🎉',
      priority: 1,
      tasks: [
        { id: crypto.randomUUID(), title: 'Disfrutar el proceso.', done: false },
        { id: crypto.randomUUID(), title: 'No vivir con urgencias.', done: false },
        { id: crypto.randomUUID(), title: 'Valorar las pequeñas cosas.', done: false },
        { id: crypto.randomUUID(), title: 'Dejar de intentar agradar a todo el mundo.', done: false },
        { id: crypto.randomUUID(), title: 'Vivir de acuerdo con mis valores.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    // === OBJETIVOS DE CAMI ===
    {
      id: crypto.randomUUID(),
      owner: 'cami',
      title: 'Fortalecer su vida espiritual',
      description: 'Poner a Dios en primer lugar y seguir el propósito que Él tiene para su vida.',
      emoji: '🕊️',
      priority: 3,
      tasks: [
        { id: crypto.randomUUID(), title: 'Priorizar los momentos con Dios.', done: false },
        { id: crypto.randomUUID(), title: 'Orar.', done: false },
        { id: crypto.randomUUID(), title: 'Hacer devocionales.', done: false },
        { id: crypto.randomUUID(), title: 'Estudiar la Biblia.', done: false },
        { id: crypto.randomUUID(), title: 'Confiar en los planes de Dios.', done: false },
        { id: crypto.randomUUID(), title: 'Cumplir su rol dentro de la iglesia.', done: false },
        { id: crypto.randomUUID(), title: 'Ir donde Dios la llame.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'cami',
      title: 'Formarse para construir una familia',
      description: 'Crecer personalmente para formar un hogar sano y estable.',
      emoji: '🏡',
      priority: 2,
      tasks: [
        { id: crypto.randomUUID(), title: 'Amarse más.', done: false },
        { id: crypto.randomUUID(), title: 'Reforzar autoestima.', done: false },
        { id: crypto.randomUUID(), title: 'Fortalecer el carácter.', done: false },
        { id: crypto.randomUUID(), title: 'Establecer límites.', done: false },
        { id: crypto.randomUUID(), title: 'Formarse profesionalmente.', done: false },
        { id: crypto.randomUUID(), title: 'Lograr estabilidad económica.', done: false },
        { id: crypto.randomUUID(), title: 'Ser una persona que transmita paz.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'cami',
      title: 'Formar un hogar junto a Javi',
      description: 'Construir una relación sólida basada en el amor, el apoyo y el compromiso.',
      emoji: '❤️',
      priority: 3,
      tasks: [
        { id: crypto.randomUUID(), title: 'Amar a Javi todos los días.', done: false },
        { id: crypto.randomUUID(), title: 'Demostrarle cuánto significa.', done: false },
        { id: crypto.randomUUID(), title: 'Apoyarlo en sus proyectos.', done: false },
        { id: crypto.randomUUID(), title: 'Trabajar juntos para cumplir objetivos.', done: false },
        { id: crypto.randomUUID(), title: 'No rendirse.', done: false },
        { id: crypto.randomUUID(), title: 'Ignorar comentarios negativos.', done: false },
        { id: crypto.randomUUID(), title: 'Prepararse para casarse y formar una familia.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      owner: 'cami',
      title: 'Estudiar Psicología',
      description: 'Ingresar a la UAP y completar la carrera.',
      emoji: '🧠',
      priority: 2,
      tasks: [
        { id: crypto.randomUUID(), title: 'Empezar el SVA.', done: false },
        { id: crypto.randomUUID(), title: 'Trabajar durante el proceso.', done: false },
        { id: crypto.randomUUID(), title: 'Conocer otros países.', done: false },
        { id: crypto.randomUUID(), title: 'Comprometerse con la parte económica.', done: false },
        { id: crypto.randomUUID(), title: 'Conseguir un trabajo mientras estudia.', done: false },
      ],
      checkins: [],
      created_at: new Date().toISOString(),
    },
  ]

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
    { count: goalsCount, error: goalsError },
    { count: journalCount, error: journalError },
    { count: objectivesCount, error: objectivesError },
  ] = await Promise.all([
    supabase.from('goals').select('id', { count: 'exact', head: true }),
    supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
    supabase.from('personal_objectives').select('id', { count: 'exact', head: true }),
  ])

  if (goalsError) throw goalsError
  if (journalError) throw journalError
  if (objectivesError) throw objectivesError

  if (goalsCount === 0) {
    // We need to map the defaultGoals to what Supabase expects (snake_case)
    const goalsToInsert = defaultGoals.map(g => ({
      ...g,
      created_at: g.createdAt,
      // The 'createdAt' property is not in the DB, so we remove it.
    })).map(({ createdAt, ...rest }) => rest);

    const { error } = await supabase.from('goals').insert(goalsToInsert)
    if (error) throw error
  }
  if (journalCount === 0) {
    const { error } = await supabase.from('journal_entries').insert(defaultJournal)
    if (error) throw error
  }
  if (objectivesCount === 0) {
    const { error } = await supabase.from('personal_objectives').insert(defaultPersonalObjectives)
    if (error) throw error
  }
}

async function initializeDatabase() {
  // Esta función es idempotente. Se puede ejecutar en cada inicio sin problemas.

  const legacy = readLegacyLocal()

  // 1. Verificamos el estado de las tablas en Supabase.
  const [
    { count: goalsCount, error: goalsError },
    { count: objectivesCount, error: objectivesError },
    { count: journalCount, error: journalError },
  ] = await Promise.all([
    supabase.from('goals').select('id', { count: 'exact', head: true }),
    supabase.from('personal_objectives').select('id', { count: 'exact', head: true }),
    supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
  ])

  if (goalsError) throw goalsError
  if (objectivesError) throw objectivesError
  if (journalError) throw journalError

  if (goalsCount === 0) {
     await migrateGoals(legacy.goals ?? [])
  }
  if (objectivesCount === 0 && legacy.personalObjectives && legacy.personalObjectives.length > 0) {
    console.log(`Found ${legacy.personalObjectives.length} personal objectives in localStorage. Migrating...`)
    await migrateObjectives(legacy.personalObjectives ?? [])
  }
  if (journalCount === 0) {
     await migrateJournal(legacy.journal ?? [])
  }
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