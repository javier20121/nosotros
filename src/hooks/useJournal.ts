import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { JournalEntry } from '@/types'

type DbJournal = {
  id: string
  title: string
  date: string
  location: string
  body: string
  photos: string[]
  mood_tags: string[]
  created_at: string
}

const fromDb = (r: DbJournal): JournalEntry => ({
  id: r.id,
  title: r.title,
  date: r.date,
  location: r.location,
  body: r.body,
  photos: r.photos ?? [],
  moodTags: r.mood_tags ?? [],
})

export function useJournalEntries(reloadKey = 0) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
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
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false })

      if (!mounted) return
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setEntries((data ?? []).map(fromDb))
      setLoading(false)
    }

    load()

    ch = supabase
      .channel('journal-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journal_entries' },
        (p) => {
          if (!mountedRef.current) return
          if (p.eventType === 'INSERT') {
            setEntries((prev) => [fromDb(p.new as DbJournal), ...prev])
          } else if (p.eventType === 'UPDATE') {
            setEntries((prev) =>
              prev.map((e) =>
                e.id === (p.new as DbJournal).id ? fromDb(p.new as DbJournal) : e
              )
            )
          } else if (p.eventType === 'DELETE') {
            const oldId = (p.old as Partial<DbJournal>)?.id
            if (!oldId) return
            setEntries((prev) => prev.filter((e) => e.id !== oldId))
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

  const addEntry = useCallback(async (entry: Omit<JournalEntry, 'id'>) => {
    setEntries((prev) => [
      {
        id: crypto.randomUUID(),
        title: entry.title,
        date: entry.date,
        location: entry.location,
        body: entry.body,
        photos: entry.photos,
        moodTags: entry.moodTags,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])

    const { error } = await supabase.from('journal_entries').insert({
      id: crypto.randomUUID(),
      title: entry.title,
      date: entry.date,
      location: entry.location,
      body: entry.body,
      photos: entry.photos,
      mood_tags: entry.moodTags,
    })
    if (error) {
      setError(error.message)
      reload()
    }
  }, [reload])

  return { entries, loading, error, reload, addEntry }
}