import { useState, useCallback, useEffect } from 'react'
import type { AppData, GalleryPhoto } from '@/types'

const STORAGE_KEY = 'jc_island_data'
const START_DATE = new Date('2026-04-20T00:00:00')

const defaultData: AppData = {
  milestones: [],
  photos: [],
  goals: [],
  personalObjectives: [],
  journal: [],
  letters: [],
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      ...defaultData,
      ...parsed,
      milestones: parsed.milestones ?? defaultData.milestones,
      photos: parsed.photos ?? defaultData.photos,
      goals: parsed.goals ?? defaultData.goals,
      personalObjectives:
        parsed.personalObjectives ?? defaultData.personalObjectives,
      journal: parsed.journal ?? defaultData.journal,
      letters: parsed.letters ?? defaultData.letters,
    }
  } catch {
    return defaultData
  }
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
