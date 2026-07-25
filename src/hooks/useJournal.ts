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

function getLegacyJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem('jc_island_data')
    if (!raw) return []
    const parsed = JSON.parse(raw) as { journal?: any[] }
    if (!Array.isArray(parsed?.journal)) return []
    return parsed.journal.map((e: any) => ({
      id: crypto.randomUUID(),
      title: String(e.title || ''),
      date: e.date || '',
      location: e.location ?? '',
      body: e.body ?? '',
      photos: Array.isArray(e.photos) ? e.photos : [],
      moodTags: Array.isArray(e.moodTags) ? e.moodTags : [],
      createdAt: e.createdAt || new Date().toISOString(),
    }))
  } catch {
    return []
  }
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

export function useJournalEntries(initialLoad = true) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    const load = async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      const dbEntries = (data ?? []).map(fromDb)
      if (dbEntries.length === 0) {
        const legacy = getLegacyJournal()
        setEntries(legacy)
      } else {
        setEntries(dbEntries)
      }
      setLoading(false)
    }

  const reload = useCallback(load, [])

  useEffect(() => {
    let mounted = true

    if (initialLoad) {
      load()
    }

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
            const oldId = (p.old as Partial<DbJournal>)?.id
            if (!oldId) return
            setEntries((prev) => prev.filter((e) => e.id !== oldId))
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [initialLoad])

  const addEntry = useCallback(async (entry: Omit<JournalEntry, 'id'>) => {
    const { error } = await supabase.from('journal_entries').insert({
      id: crypto.randomUUID(),
      title: entry.title,
      date: entry.date,
      location: entry.location,
      body: entry.body,
      photos: entry.photos,
      mood_tags: entry.moodTags,
    })
    if (error) setError(error.message)
  }, [])

  return { entries, loading, error, addEntry, reload }
}
