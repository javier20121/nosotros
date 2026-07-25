import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { PersonalObjective, GoalTask, ObjectiveCheckin } from '@/types'

type DbObjective = {
  id: string
  owner: 'javi' | 'cami'
  title: string
  description: string
  emoji: string
  priority: number
  tasks: GoalTask[]
  checkins: ObjectiveCheckin[]
  created_at: string
}

const fromDb = (r: DbObjective): PersonalObjective => ({
  id: r.id,
  owner: r.owner,
  title: r.title,
  description: r.description,
  emoji: r.emoji,
  priority: r.priority,
  tasks: r.tasks ?? [],
  checkins: r.checkins ?? [],
  createdAt: r.created_at,
})

function getLegacyObjectives(): PersonalObjective[] {
  try {
    const raw = localStorage.getItem('jc_island_data')
    if (!raw) return []
    const parsed = JSON.parse(raw) as { personalObjectives?: any[] }
    if (!Array.isArray(parsed?.personalObjectives)) return []
    return parsed.personalObjectives.map((o: any) => ({
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
      createdAt: o.createdAt || new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

export function usePersonalObjectives() {
  const [objectives, setObjectives] = useState<PersonalObjective[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const { data, error } = await supabase
        .from('personal_objectives')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
      if (!mounted) return
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      const dbObjectives = (data ?? []).map(fromDb)
      if (dbObjectives.length === 0) {
        const legacy = getLegacyObjectives()
        setObjectives(legacy)
      } else {
        setObjectives(dbObjectives)
      }
      setLoading(false)
    }

    load()

    const ch = supabase
      .channel('personal-objectives-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personal_objectives' },
        (p) => {
          if (p.eventType === 'INSERT') {
            setObjectives((prev) => [fromDb(p.new as DbObjective), ...prev])
          } else if (p.eventType === 'UPDATE') {
            setObjectives((prev) =>
              prev.map((o) =>
                o.id === (p.new as DbObjective).id ? fromDb(p.new as DbObjective) : o
              )
            )
          } else if (p.eventType === 'DELETE') {
            const oldId = (p.old as Partial<DbObjective>)?.id
            if (!oldId) return
            setObjectives((prev) => prev.filter((o) => o.id !== oldId))
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [])

  const addObjective = useCallback(
    async (o: Omit<PersonalObjective, 'id' | 'createdAt'>) => {
      const { error } = await supabase.from('personal_objectives').insert({
        id: crypto.randomUUID(),
        owner: o.owner,
        title: o.title,
        description: o.description,
        emoji: o.emoji,
        priority: o.priority,
        tasks: o.tasks,
        checkins: o.checkins,
      })
      if (error) setError(error.message)
    },
    []
  )

  const deleteObjective = useCallback(async (id: string) => {
    const { error } = await supabase.from('personal_objectives').delete().eq('id', id)
    if (error) setError(error.message)
  }, [])

  const toggleTask = useCallback(async (objectiveId: string, taskId: string) => {
    const { data, error } = await supabase
      .from('personal_objectives')
      .select('tasks')
      .eq('id', objectiveId)
      .single()
    if (error) {
      setError(error.message)
      return
    }
    const next = (data?.tasks ?? []).map((t: GoalTask) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    )
    const { error: upErr } = await supabase
      .from('personal_objectives')
      .update({ tasks: next })
      .eq('id', objectiveId)
    if (upErr) setError(upErr.message)
  }, [])

  const addCheckin = useCallback(async (objectiveId: string, note: string) => {
    const { data, error } = await supabase
      .from('personal_objectives')
      .select('checkins')
      .eq('id', objectiveId)
      .single()
    if (error) {
      setError(error.message)
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    const next = [...(data?.checkins ?? []), { date: today, note }]
    const { error: upErr } = await supabase
      .from('personal_objectives')
      .update({ checkins: next })
      .eq('id', objectiveId)
    if (upErr) setError(upErr.message)
  }, [])

  return {
    objectives,
    loading,
    error,
    addObjective,
    deleteObjective,
    toggleTask,
    addCheckin,
  }
}
