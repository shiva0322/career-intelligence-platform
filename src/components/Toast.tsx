import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onClose: () => void
  duration?: number
}

export function Toast({ message, onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [message, onClose, duration])

  if (!message) return null

  return (
    <aside className="toast-notification" role="status" aria-live="polite">
      <span className="toast-icon">✓</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss notification">
        ×
      </button>
    </aside>
  )
}
