import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useGoals } from './useGoals'
import { usePersonalObjectives } from './usePersonalObjectives'
import { useJournalEntries } from './useJournal'
import { useLocalAppData } from './useLocalAppData'

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

// Migración única: si Supabase está vacío y localStorage tiene datos
// para goals / personalObjectives / journal, los sube a Supabase.
// Se ejecuta una vez por navegador (flag en localStorage).
async function migrateIfNeeded(
  flagKey: string,
  rows: any[] | undefined,
  table: 'goals' | 'personal_objectives' | 'journal_entries',
  rowMapper: (r: any) => any
) {
  if (!rows || rows.length === 0) return
  if (localStorage.getItem(flagKey) === 'done') return

  try {
    const { error } = await supabase
      .from(table)
      .upsert(rows.map(rowMapper), { onConflict: 'id' })
    if (!error) {
      localStorage.setItem(flagKey, 'done')
    } else {
      console.warn(`[migrate] ${table} upsert failed:`, error.message)
    }
  } catch (e) {
    console.warn(`[migrate] ${table} threw:`, e)
  }
}

// Mixto: goals + objectives + journal van a Supabase.
// El resto (milestones, photos, letters) sigue en localStorage.
// La firma es la misma que ya consume App.tsx, así no hay que tocar nada.
export function useAppData() {
  const goalsHook = useGoals()
  const objectivesHook = usePersonalObjectives()
  const journalHook = useJournalEntries()
  const local = useLocalAppData()

  // Loading agregado: si alguna query a Supabase todavía no volvió,
  // mostramos un loader global y no renderizamos con arrays vacíos.
  const isLoading =
    goalsHook.loading ||
    objectivesHook.loading ||
    journalHook.loading

  // Migración: una vez que Supabase responde con [] y el usuario
  // tiene datos viejos en localStorage, los subimos.
  const migratedRef = useRef(false)
  useEffect(() => {
    if (migratedRef.current) return
    if (isLoading) return
    migratedRef.current = true

    const legacy = readLegacyLocal()

    void migrateIfNeeded(
      'jc_migrated_goals',
      legacy.goals,
      'goals',
      (g) => ({
        id: crypto.randomUUID(),
        title: g.title,
        description: g.description ?? '',
        status: g.status ?? 'pending',
        photos: g.photos ?? [],
        tasks: g.tasks ?? [],
        created_at: g.createdAt ?? new Date().toISOString(),
      })
    )

    void migrateIfNeeded(
      'jc_migrated_objectives',
      legacy.personalObjectives,
      'personal_objectives',
      (o) => ({
        id: crypto.randomUUID(),
        owner: o.owner,
        title: o.title,
        description: o.description ?? '',
        emoji: o.emoji ?? '🌱',
        priority: o.priority ?? 0,
        tasks: o.tasks ?? [],
        checkins: o.checkins ?? [],
        created_at: o.createdAt ?? new Date().toISOString(),
      })
    )

    void migrateIfNeeded(
      'jc_migrated_journal',
      legacy.journal,
      'journal_entries',
      (e) => ({
        id: crypto.randomUUID(),
        title: e.title,
        date: e.date,
        location: e.location ?? '',
        body: e.body ?? '',
        photos: e.photos ?? [],
        mood_tags: e.moodTags ?? e.mood_tags ?? [],
        created_at: e.createdAt ?? new Date().toISOString(),
      })
    )
  }, [isLoading])

  return {
    data: {
      ...local.data,
      goals: goalsHook.goals,
      personalObjectives: objectivesHook.objectives,
      journal: journalHook.entries,
    },
    startDate: local.startDate,
    isLoading,
    error:
      goalsHook.error ||
      objectivesHook.error ||
      journalHook.error ||
      null,

    // goals (Supabase)
    addGoal: goalsHook.addGoal,
    updateGoal: goalsHook.updateGoal,
    addPhotoToGoal: goalsHook.addPhoto,
    deletePhotoFromGoal: goalsHook.deletePhoto,
    deleteGoal: goalsHook.deleteGoal,

    // personal objectives (Supabase)
    toggleObjectiveTask: objectivesHook.toggleTask,
    addObjectiveCheckin: objectivesHook.addCheckin,
    deleteObjective: objectivesHook.deleteObjective,

    // gallery (local)
    addPhoto: local.addPhoto,

    // journal (Supabase)
    addJournalEntry: journalHook.addEntry,

    // letters (local)
    openLetter: local.openLetter,
  }
}
