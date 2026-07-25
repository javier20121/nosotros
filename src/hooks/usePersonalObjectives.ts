import { useEffect, useState, useCallback, useRef } from 'react'
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

export function usePersonalObjectives(reloadKey = 0) {
  const [objectives, setObjectives] = useState<PersonalObjective[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [innerReload, setInnerReload] = useState(0)
  const mountedRef = useRef(true)

  const reload = useCallback(() => {
    setInnerReload((k) => k + 1)
  }, [])

  useEffect(() => {
    let ch: ReturnType<typeof supabase.channel> | null = null
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
      setObjectives((data ?? []).map(fromDb))
      setLoading(false)
    }

    load()

    ch = supabase
      .channel('personal-objectives-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personal_objectives' },
        (p) => {
          if (!mountedRef.current) return
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
      mountedRef.current = false
      if (ch) supabase.removeChannel(ch)
    }
  }, [reloadKey, innerReload])

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

  const toggleTask = useCallback(
    async (objectiveId: string, taskId: string) => {
      setObjectives((prev) =>
        prev.map((o) =>
          o.id === objectiveId
            ? {
                ...o,
                tasks: o.tasks.map((t) =>
                  t.id === taskId ? { ...t, done: !t.done } : t
                ),
              }
            : o
        )
      )

      const { data, error: selErr } = await supabase
        .from('personal_objectives')
        .select('tasks')
        .eq('id', objectiveId)
        .single()
      if (selErr) {
        setError(selErr.message)
        reload()
        return
      }
      const next = (data?.tasks ?? []).map((t: GoalTask) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      )
      const { error: upErr } = await supabase
        .from('personal_objectives')
        .update({ tasks: next })
        .eq('id', objectiveId)
      if (upErr) {
        setError(upErr.message)
        reload()
      }
    },
    [reload]
  )

  const addCheckin = useCallback(
    async (objectiveId: string, note: string) => {
      setObjectives((prev) =>
        prev.map((o) => {
          if (o.id !== objectiveId) return o
          const today = new Date().toISOString().slice(0, 10)
          return {
            ...o,
            checkins: [...o.checkins, { date: today, note }],
          }
        })
      )

      const { data, error: selErr } = await supabase
        .from('personal_objectives')
        .select('checkins')
        .eq('id', objectiveId)
        .single()
      if (selErr) {
        setError(selErr.message)
        reload()
        return
      }
      const today = new Date().toISOString().slice(0, 10)
      const next = [...(data?.checkins ?? []), { date: today, note }]
      const { error: upErr } = await supabase
        .from('personal_objectives')
        .update({ checkins: next })
        .eq('id', objectiveId)
      if (upErr) {
        setError(upErr.message)
        reload()
      }
    },
    [reload]
  )

  return {
    objectives,
    loading,
    error,
    reload,
    addObjective,
    deleteObjective,
    toggleTask,
    addCheckin,
  }
}
