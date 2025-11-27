import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import LocationModal from './LocationModal'

interface HeaderProps {
  onCartOpen: () => void
}

const Header: React.FC<HeaderProps> = ({ onCartOpen }) => {
  const [userName, setUserName] = useState<string>('Identifícate')
  const [userRole, setUserRole] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [direccionDisplay, setDireccionDisplay] = useState('México 01000')
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const navigate = useNavigate()
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null)

  const productKeywords = [
    'iPhone', 'Samsung Galaxy', 'MacBook', 'iPad', 'AirPods',
    'PlayStation', 'Xbox', 'Nintendo Switch', 'Auriculares',
    'Teclado mecánico', 'Ratón gaming', 'Monitor', 'Laptop',
    'Cámara', 'Televisor', 'Tablet', 'Smartwatch', 'Altavoces',
    'Cargador', 'Cable USB', 'Funda', 'Protector pantalla',
    'Ropa deportiva', 'Zapatillas', 'Jeans', 'Camiseta',
    'Vestido', 'Chaqueta', 'Pantalones', 'Zapatos',
    'Libros', 'Kindle', 'Juguetes', 'Maquillaje', 'Perfume',
    'Crema facial', 'Champú', 'Vitaminas', 'Suplementos',
    'Cocina', 'Sartén', 'Cafetera', 'Microondas', 'Refrigerador',
    'Aspiradora', 'Plancha', 'Secador', 'Muebles', 'Sofá',
    'Mesa', 'Silla', 'Lámpara', 'Decoración', 'Plantas'
  ]

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.nombre) {
          setUserName(user.nombre)
          setIsLoggedIn(true)
          setUserRole(user.rol || '')
        }
      } catch (err) {
        // ignore
      }
    }

    // Cargar dirección guardada
    const guardada = localStorage.getItem('direccion_envio')
    if (guardada) {
      setDireccionDisplay(guardada)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
    }
  }

  return (
    <>
      <div className="amazon-header">
        <div className="amazon-header-top">
          <Link to="/" className="amazon-logo">
            <img src={logoSvg} alt="Amazon" />
            <span className="amazon-logo-com">.com.mx</span>
          </Link>

          <div
            className="amazon-deliver"
            onClick={() => setIsLocationModalOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <div className="amazon-deliver-line1">Entregar en</div>
            <div className="amazon-deliver-line2"><i className="bi bi-geo-alt-fill"></i> {direccionDisplay}</div>
          </div>

          <form className="amazon-search" onSubmit={handleSearch}>
            <select>
              <option>Todos</option>
              <option>Arte y Manualidades</option>
              <option>Automóvil</option>
              <option>Bebé</option>
              <option>Belleza y Cuidado Personal</option>
              <option>Libros</option>
              <option>Computadoras</option>
              <option>Electrónicos</option>
            </select>
            <div className="amazon-search-input-container">
              <input
                type="text"
                placeholder="Buscar en Amazon"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value
                  setSearchQuery(value)
                  
                  // Limpiar timeout anterior
                  if (searchTimeout) clearTimeout(searchTimeout)
                  
                  if (value.length > 1) {
                    // Buscar productos en el backend después de 300ms
                    const timeout = setTimeout(async () => {
                      try {
                        const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
                        const controller = new AbortController()
                        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos timeout
                        
                        const res = await fetch(`${base}/api/products?nombre=${encodeURIComponent(value)}&limit=8`, {
                          signal: controller.signal
                        })
                        clearTimeout(timeoutId)
                        
                        const data = await res.json()
                        const products = data.items || data.products || data || []
                        if (products.length > 0) {
                          setSuggestions(products)
                          setShowSuggestions(true)
                        } else {
                          // Fallback a keywords si no hay productos
                          const filtered = productKeywords.filter(keyword =>
                            keyword.toLowerCase().includes(value.toLowerCase())
                          ).slice(0, 6)
                          setSuggestions(filtered.map(k => ({ nombre: k, _id: null })))
                          setShowSuggestions(filtered.length > 0)
                        }
                      } catch (err) {
                        console.error('Error fetching suggestions:', err)
                        // Fallback a keywords si falla el backend
                        const filtered = productKeywords.filter(keyword =>
                          keyword.toLowerCase().includes(value.toLowerCase())
                        ).slice(0, 6)
                        setSuggestions(filtered.map(k => ({ nombre: k, _id: null })))
                        setShowSuggestions(filtered.length > 0)
                      }
                    }, 300)
                    setSearchTimeout(timeout)
                  } else {
                    setShowSuggestions(false)
                    setSuggestions([])
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="amazon-search-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="amazon-search-suggestion"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        const searchTerm = suggestion.nombre || suggestion
                        setSearchQuery(searchTerm)
                        navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
                        setShowSuggestions(false)
                      }}
                    >
                      {suggestion._id ? <i className="bi bi-box-seam"></i> : <i className="bi bi-search"></i>} {suggestion.nombre || suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit"><i className="bi bi-search"></i></button>
          </form>

          <div className="amazon-language"><i className="bi bi-globe-americas"></i> <span>ES</span></div>

          <div 
            className="amazon-account" 
            onClick={() => {
              if (isLoggedIn) {
                if (userRole === 'vendedor') {
                  navigate('/vendedor')
                } else {
                  navigate('/mi-cuenta')
                }
              } else {
                navigate('/login')
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="amazon-account-line1">Hola, {userName}</div>
            <div className="amazon-account-line2">Cuenta y Listas</div>
          </div>

          <div 
            className="amazon-account"
            onClick={() => {
              if (isLoggedIn) {
                navigate('/mi-cuenta?tab=pedidos')
              } else {
                navigate('/login')
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="amazon-account-line1">Devoluciones</div>
            <div className="amazon-account-line2">y Pedidos</div>
          </div>

          <button onClick={onCartOpen} className="amazon-cart">
            <div className="amazon-cart-icon"><i className="bi bi-cart3"></i></div>
            <div className="amazon-cart-text">Carrito</div>
          </button>
        </div>

        <div className="amazon-nav">
          <button><i className="bi bi-list"></i> Todos</button>
          <Link to="/deals">Ofertas del Día</Link>
          <Link to="/customer-service">Atención al Cliente</Link>
          <Link to="/registry">Lista de Deseos</Link>
          <Link to="/gift-cards">Tarjetas Regalo</Link>
          <Link to="/sell">Vender</Link>
        </div>
      </div>

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  )
}

export default Header
