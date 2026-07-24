import { useGoals } from './useGoals'
import { usePersonalObjectives } from './usePersonalObjectives'
import { useJournalEntries } from './useJournal'
import { useLocalAppData } from './useLocalAppData'

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
