import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/ReviewForm.css'

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const [comentario, setComentario] = useState('')
  const [calificacion, setCalificacion] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const navigate = useNavigate()

  const enviarReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Verificar si el usuario está logueado
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        setShowLoginPopup(true)
        return
      }

      const user = JSON.parse(userStr)
      const userId = user._id || user.id
      
      if (!userId) {
        setShowLoginPopup(true)
        return
      }

      if (!comentario.trim()) {
        setError('Por favor escribe un comentario')
        return
      }

      setIsSubmitting(true)

      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(`${base}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: userId,
          productoId: productId,
          comentario,
          calificacion
        })
      })

      if (!res.ok) {
        throw new Error('Error al enviar la reseña')
      }

      const data = await res.json()
      
      // Limpiar el formulario
      setComentario('')
      setCalificacion(5)
      
      // Notificar éxito
      try {
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: { message: '✅ Reseña enviada exitosamente' } 
        }))
      } catch (e) { /* ignore */ }

      // Callback para refrescar la lista de reseñas
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }

    } catch (err) {
      console.error('Error al enviar reseña:', err)
      setError('No se pudo enviar la reseña. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="review-form-container">
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
        Escribe una reseña
      </h3>

      <form className="review-form" onSubmit={enviarReview}>
        <div className="form-group">
          <label>Calificación:</label>
          <select 
            value={calificacion} 
            onChange={e => setCalificacion(Number(e.target.value))}
            disabled={isSubmitting}
          >
            <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
            <option value={4}>⭐⭐⭐⭐ Muy bueno</option>
            <option value={3}>⭐⭐⭐ Bueno</option>
            <option value={2}>⭐⭐ Regular</option>
            <option value={1}>⭐ Malo</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tu opinión:</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comparte tu experiencia con este producto..."
            rows={5}
            disabled={isSubmitting}
            required
          />
        </div>

        {error && <div className="review-error">{error}</div>}

        <button 
          type="submit" 
          className="submit-review-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
        </button>
      </form>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="login-popup-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="login-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Inicia sesión para continuar</h3>
              <button 
                className="close-popup" 
                onClick={() => setShowLoginPopup(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className="popup-body">
              <p>Debes iniciar sesión para poder escribir una reseña de este producto.</p>
            </div>
            <div className="popup-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowLoginPopup(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-login" 
                onClick={() => {
                  setShowLoginPopup(false)
                  navigate('/login')
                }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewForm
