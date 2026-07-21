import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export type Item = {
  id: string
  title: string
  body: string | null
  created_at: string
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carga inicial + suscripción realtime
  useEffect(() => {
    let mounted = true

    const load = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('[supabase] items:', { data, error })
      if (!mounted) return
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setItems(data ?? [])
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel('items-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [payload.new as Item, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((i) => (i.id === (payload.new as Item).id ? (payload.new as Item) : i))
            )
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((i) => i.id !== (payload.old as Item).id))
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const addItem = useCallback(async (title: string, body?: string) => {
    const { data, error } = await supabase
      .from('items')
      .insert({ title, body: body ?? null })
      .select()
      .single()
    if (error) setError(error.message)
    return data as Item | null
  }, [])

  const updateItem = useCallback(async (id: string, patch: Partial<Pick<Item, 'title' | 'body'>>) => {
    const { error } = await supabase.from('items').update(patch).eq('id', id)
    if (error) setError(error.message)
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) setError(error.message)
  }, [])

  return { items, loading, error, addItem, updateItem, deleteItem }
}
