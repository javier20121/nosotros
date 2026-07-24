import { createClient } from '@supabase/supabase-js'

// Acepta tanto la nueva "publishable" key (sb_publishable_...) como la legacy "anon" (eyJ...)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY // fallback al nombre legacy

// [debug] Diagnóstico de variables de entorno en runtime
const urlHost = (() => {
  try { return new URL(supabaseUrl || '').host || '(empty/invalid)' }
  catch { return '(parse-error)' }
})()
const keyPrefix = (supabasePublishableKey || '').slice(0, 14)
const keyLooksReal =
  !!supabasePublishableKey &&
  supabasePublishableKey !== 'public-key-placeholder' &&
  (supabasePublishableKey.startsWith('sb_publishable_') ||
    supabasePublishableKey.startsWith('eyJ'))

console.log('[supabase-debug] runtime env', {
  hasUrl: !!supabaseUrl,
  urlHost,
  hasKey: !!supabasePublishableKey,
  keyPrefix,
  keyLooksReal,
})

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    '[supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env.local'
  )
}
if (!keyLooksReal) {
  console.warn(
    '[supabase-debug] La API key no parece real (placeholder o formato inválido). ' +
    'Revisá VITE_SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_ANON_KEY en Vercel.'
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
