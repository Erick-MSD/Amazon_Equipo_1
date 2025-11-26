import React, { useEffect, useState } from 'react'

type ToastItem = { id: number; message: string }

const Toast: React.FC = () => {
  const [toast, setToast] = useState<ToastItem | null>(null)

  useEffect(() => {
    let timeout: any
    const handler = (e: any) => {
      const message = e?.detail?.message || e?.detail || String(e) || 'Notificación'
      const id = Date.now()
      setToast({ id, message })
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => setToast(null), 3500)
    }

    window.addEventListener('showToast', handler as EventListener)
    return () => {
      window.removeEventListener('showToast', handler as EventListener)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  if (!toast) return null

  return (
    <div className="app-toast" role="status" aria-live="polite">
      {toast.message}
    </div>
  )
}

export default Toast
