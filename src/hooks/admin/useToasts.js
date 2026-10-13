import { useCallback, useState } from 'react'

export function useToasts() {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((msg, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((t) => [...t.slice(-3), { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  return { toasts, pushToast, dismissToast }
}
