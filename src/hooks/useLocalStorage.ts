import { useState, useEffect } from 'react'

// Hook usado por Hero.tsx para el contador de tiempo.
// El resto del estado local (fotos, letras, milestones) vive en
// ./useLocalAppData.ts, y goals/objectives/journal en Supabase.

type TimeCounter = {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTime(start: Date): TimeCounter {
  const now = new Date()
  const diff = now.getTime() - start.getTime()

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  const months = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
  )
  const days = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
  )
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { years, months, days, hours, minutes, seconds }
}

export function useTimeCounter(startDate: Date): TimeCounter {
  const [time, setTime] = useState(() => calculateTime(startDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTime(startDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [startDate])

  return time
}
