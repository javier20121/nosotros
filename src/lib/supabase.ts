import { createClient } from '@supabase/supabase-js'

// Acepta tanto la nueva "publishable" key (sb_publishable_...) como la legacy "anon" (eyJ...)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY // fallback al nombre legacy

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    '[supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env.local'
  )
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost',
  supabasePublishableKey || 'public-key-placeholder',
  {
    realtime: {
      params: { eventsPerSecond: 2 },
    },
  }
)
