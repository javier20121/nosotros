import { useState, useCallback, useEffect } from 'react'
import type { AppData, GalleryPhoto } from '@/types'

const STORAGE_KEY = 'jc_island_data'
const START_DATE = new Date('2026-04-20T00:00:00')

const defaultData: AppData = {
  milestones: [
    {
      id: crypto.randomUUID(),
      date: '20 ago 2025',
      title: 'Nuestro primer encuentro',
      description: 'No fue una cita, no fue una juntada, no fue buscandonos, solo apareci buscando trabajo, los dos teniamos nuestra vida estructurada y haciamos nuestra vida por separados.',
    },
    {
      id: crypto.randomUUID(),
      date: '20 abril 2026',
      title: 'Nos confezamos',
      description: 'Nos veiamos tirando honda y finjiendo demencia a la vez, con gans de ser todo pero siendo nada, amandonos pero en silencio, recuerdo como contemplaba la infinidad de tu mirar escondido para que no lo notaras pero ese dia lo expresamos no hicimos nada al respecto pero lo expresamos y fue mutuo.',
    },
    {
      id: crypto.randomUUID(),
      date: '23 abril 2026',
      title: 'el primer beso',
      description: 'Lo que sentiamos ya lo sabiamos y nos sentiamos comodo con eso, la tension cuando nos juntabamos era asfixiante era la intencion de serlo todo vs el miedo a cagar la amistad mas linda que teniamos en ese entonces, fuimos a un picnic y hablamos, hablamos mucho y yo solo me imaginaba el como darte un beso y que sea increible, tenia miedo, estaba nervioso pero lo hice, antes de juntar las cosas te ayude a levantarte y nos besamos, lo unico que recuerdo en ese entonces son estrellas y un sentimiento muy profundo de paz .',
    },
    {
      id: crypto.randomUUID(),
      date: '26 abril 2026',
      title: 'Te am....',
      description: 'ese dia estabamos en la cama, estabamos acostados y recuerdo que pensaba, como puedo amar tanto a esta personita? aparte de eso el camino hasta tu casa fui meditando "no le digas amor, no le digas te amo, no todavia, pero cuando estabamos juntos me olvide de todo, solo se que sentia mucho amor por vos y se me salio no pude aguantar lo tuve que decir.',
    },
    {
      id: crypto.randomUUID(),
      date: '15 mayo 2026',
      title: 'fue magico',
      description: 'fue nuestra primera vez juntos y la verdad fue wow, amanecimos y encima tuvimos ma;anero, fue una locura, intente volver a los saltitos a mi casa pero no pude.',
    },
  ],
  photos: [
    { id: 'default-photo-1', src: '/images/imagen_espejo.jpeg', date: '15 Ago 2022', note: 'Atardecer en la playa', aspectRatio: '3/4' as const },
    { id: 'default-photo-2', src: '/images/imagen_abrazo.jpeg', date: '20 Sep 2022', note: 'Café y croissants', aspectRatio: '4/3' as const },
    { id: 'default-photo-3', src: '/images/gallery-3.jpg', date: '5 Nov 2022', note: 'Bailando bajo la lluvia', aspectRatio: '1/1' as const },
    { id: 'default-photo-4', src: '/images/gallery-4.jpg', date: '14 Feb 2023', note: 'Nuestras manos, nuestro pacto', aspectRatio: '16/9' as const },
    { id: 'default-photo-5', src: '/images/gallery-5.jpg', date: '3 Jun 2023', note: 'Domingo de pelis', aspectRatio: '3/4' as const },
    { id: 'default-photo-6', src: '/images/gallery-6.jpg', date: '12 Ago 2023', note: 'Aventura en la montaña', aspectRatio: '4/3' as const },
  ],
  goals: [],
  personalObjectives: [],
  journal: [],
  letters: [
    {
      id: crypto.randomUUID(),
      date: '14 Feb 2023',
      label: 'Carta #1',
      content: 'Mi amor,\n\nHoy cumplimos un año juntos y no puedo evitar sonreír al recordar cada momento que hemos compartido. Desde aquella primera cita en la que estaba tan nervioso que derramé el café, hasta anoche cuando nos quedamos viendo estrellas desde el balcón.\n\nEres mi persona favorita en este mundo. Contigo todo es más fácil, más bonito, más real. Gracias por ser mi compañera, mi confidente, mi mejor amiga.\n\nCon todo mi amor,\nJavi',
      opened: false,
    },
    {
      id: crypto.randomUUID(),
      date: '25 Dic 2023',
      label: 'Carta #2',
      content: 'Cami,\n\nEsta Navidad me regalaste algo que no se compra con dinero: tu tiempo, tu paciencia y tu amor incondicional. Despertarme a tu lado en esta mañana de diciembre es el mejor regalo que la vida me ha dado.\n\nTe prometo que cada día voy a esforzarme por ser la persona que mereces. Por hacerte reír, por escucharte, por estar ahí en los días buenos y en los difíciles.\n\nFeliz Navidad, mi amor. Y que vengan muchas más juntos.\n\nCon todo mi amor,\nJavi',
      opened: false,
    },
    {
      id: crypto.randomUUID(),
      date: '14 Feb 2024',
      label: 'Carta #3',
      content: 'Mi querida Cami,\n\nDos años. Dos años de risas, de aprendizajes, de crecimiento. Dos años en los que he descubierto que el amor verdadero no es solo mariposas en el estómago, sino también la tranquilidad de saber que alguien siempre está ahí.\n\nEres mi hogar, mi paz, mi aventura favorita. No sé qué me deparará el futuro, pero sé que quiero que tú estés en él.\n\nFeliz San Valentín.\n\nTe amo con todo mi ser.\n\nCon todo mi amor,\nJavi',
      opened: false,
    },
  ],
}

function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // --- Lógica de Migración de Fotos ---
      // Compara las fotos guardadas con las fotos por defecto del código.
      const defaultPhotosMap = new Map(defaultData.photos.map(p => [p.id, p]));
      const userPhotos = (parsed.photos || []) as GalleryPhoto[];

      const migratedPhotos = userPhotos.map(userPhoto => {
        // Si la foto del usuario es una de las fotos por defecto...
        if (defaultPhotosMap.has(userPhoto.id)) {
          const defaultPhoto = defaultPhotosMap.get(userPhoto.id)!;
          // ...y la ruta de la imagen ha cambiado en el código, la actualizamos.
          if (userPhoto.src !== defaultPhoto.src) {
            return { ...userPhoto, src: defaultPhoto.src };
          }
        }
        // Si no, es una foto del usuario o una por defecto sin cambios, la dejamos como está.
        return userPhoto;
      });

      return {
        ...defaultData,
        ...parsed,
        photos: migratedPhotos, // Usamos las fotos migradas/actualizadas.
      };
    }
  } catch {
    // ignore
  }
  return defaultData
}

function saveData(data: AppData) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const existing = raw ? JSON.parse(raw) : {}
    const toSave = {
      ...existing,
      milestones: data.milestones,
      photos: data.photos,
      letters: data.letters,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // ignore
  }
}

// Estado local: milestones (timeline), photos (galería) y letters.
// Goals / objectives / journal viven en Supabase.
export function useLocalAppData() {
  const [data, setData] = useState<AppData>(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const addPhoto = useCallback((photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = { ...photo, id: crypto.randomUUID() }
    setData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto].slice(-20),
    }))
  }, [])

  const openLetter = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      letters: prev.letters.map((l) =>
        l.id === id ? { ...l, opened: true } : l
      ),
    }))
  }, [])

  return {
    data,
    startDate: START_DATE,
    addPhoto,
    openLetter,
  }
}
