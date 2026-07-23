import { useEffect, useState, useCallback } from 'react'
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

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    const ch = supabase
      .channel('journal-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journal_entries' },
        (p) => {
          if (p.eventType === 'INSERT') {
            setEntries((prev) => [fromDb(p.new as DbJournal), ...prev])
          } else if (p.eventType === 'UPDATE') {
            setEntries((prev) =>
              prev.map((e) =>
                e.id === (p.new as DbJournal).id ? fromDb(p.new as DbJournal) : e
              )
            )
          } else if (p.eventType === 'DELETE') {
            setEntries((prev) =>
              prev.filter((e) => e.id !== (p.old as DbJournal).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [])

  const addEntry = useCallback(async (entry: Omit<JournalEntry, 'id'>) => {
    const { error } = await supabase.from('journal_entries').insert({
      title: entry.title,
      date: entry.date,
      location: entry.location,
      body: entry.body,
      photos: entry.photos,
      mood_tags: entry.moodTags,
    })
    if (error) setError(error.message)
  }, [])

  return { entries, loading, error, addEntry }
}
