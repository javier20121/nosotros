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

export function useGoals(initialLoad = true) {
  const [goals, setGoals] = useState<Goal[]>([])
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
      setGoals((data ?? []).map(fromDb))
      // No guardamos en localStorage, Supabase es la fuente de verdad.
      setLoading(false)
    }

  const reload = useCallback(load, [])

  useEffect(() => {
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
      // La actualización optimista se deja al canal de realtime para mantener una única fuente de verdad.
      // Si se quisiera una UI más rápida, se podría hacer aquí:
      // setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
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
        // El canal realtime se encargará de actualizar el estado.
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
      // El canal realtime se encargará de actualizar el estado.
    }
    if (error) setError(error.message)
  }, [])

  return { goals, loading, error, addGoal, updateGoal, deleteGoal, addPhoto, deletePhoto, reload }
}
