import { useCallback, useState } from 'react'

const KEY = 'admin-activity'

export function useActivityLog() {
  const [activity, setActivity] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  const logActivity = useCallback((text) => {
    setActivity((a) => {
      const next = [{ text, at: new Date().toISOString() }, ...a].slice(0, 12)
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* storage unavailable — keep in memory only */
      }
      return next
    })
  }, [])

  return { activity, logActivity }
}
