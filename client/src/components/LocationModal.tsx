import React, { useState, useEffect } from 'react'
import '../assets/css/LocationModal.css'

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const [direccion, setDireccion] = useState('')
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Verificar si hay usuario logueado
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)

    // Cargar dirección guardada si existe
    const guardada = localStorage.getItem('direccion_envio')
    if (guardada) {
      const parts = guardada.split(' ')
      const cp = parts[parts.length - 1]
      const dir = parts.slice(0, -1).join(' ')
      setDireccion(dir)
      setCodigo(cp)
    }
  }, [isOpen])

  const guardarDireccion = () => {
    if (!direccion.trim() || !codigo.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }

    if (codigo.length < 5 || isNaN(Number(codigo))) {
      setError('Código postal inválido.')
      return
    }

    // Verificar si está logueado antes de guardar
    if (!isLoggedIn) {
      setError('Debes iniciar sesión para guardar tu dirección.')
      return
    }

    const final = `${direccion} ${codigo}`
    localStorage.setItem('direccion_envio', final)

    // Recargar la página para actualizar el header
    window.location.reload()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal" onClick={(e) => e.stopPropagation()}>
        <button className="location-modal-close" onClick={onClose}>×</button>
        
        <div className="location-modal-content">
          <h2>Elige tu ubicación</h2>
          <p className="location-modal-subtitle">
            Selecciona una dirección de envío para ver las opciones de envío disponibles
          </p>

          {!isLoggedIn && (
            <div className="location-login-section">
              <p className="location-login-text">
                Para ver tus direcciones, primero inicia sesión
              </p>
              <button 
                className="location-login-btn"
                onClick={() => {
                  onClose()
                  window.location.href = '/login'
                }}
              >
                Iniciar sesión
              </button>
              <div className="location-divider">
                <span>o introduce un código postal en México</span>
              </div>
            </div>
          )}

          <div className="location-form">
            <div className="location-form-group">
              <label>Dirección</label>
              <input
                type="text"
                placeholder="Ej. Monterrey, Nuevo León"
                value={direccion}
                onChange={(e) => {
                  setDireccion(e.target.value)
                  setError('')
                }}
              />
            </div>

            <div className="location-form-group">
              <label>Código postal</label>
              <input
                type="text"
                placeholder="Ej. 64000"
                value={codigo}
                maxLength={5}
                onChange={(e) => {
                  setCodigo(e.target.value)
                  setError('')
                }}
              />
            </div>

            {error && (
              <div className="location-error">{error}</div>
            )}

            <button
              className="location-confirm-btn"
              onClick={guardarDireccion}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationModal
