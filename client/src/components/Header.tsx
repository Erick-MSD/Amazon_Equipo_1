import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'

interface HeaderProps {
  onCartOpen: () => void
}

const Header: React.FC<HeaderProps> = ({ onCartOpen }) => {
  const [currentSlide] = useState(0) // placeholder if needed later
  const [userName, setUserName] = useState<string>('Identifícate')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.nombre) setUserName(user.nombre)
      } catch (err) {
        // ignore
      }
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="amazon-header">
      <div className="amazon-header-top">
        <Link to="/" className="amazon-logo">
          <img src={logoSvg} alt="Amazon" />
          <span className="amazon-logo-com">.com.mx</span>
        </Link>

        <div className="amazon-deliver">
          <div className="amazon-deliver-line1">Entregar en</div>
          <div className="amazon-deliver-line2">📍 México 01000</div>
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
          <input
            type="text"
            placeholder="Buscar en Amazon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="amazon-language">🇲🇽 <span>ES</span></div>

        <Link to="/login" className="amazon-account">
          <div className="amazon-account-line1">Hola, {userName}</div>
          <div className="amazon-account-line2">Cuenta y Listas</div>
        </Link>

        <Link to="/orders" className="amazon-account">
          <div className="amazon-account-line1">Devoluciones</div>
          <div className="amazon-account-line2">y Pedidos</div>
        </Link>

        <button onClick={onCartOpen} className="amazon-cart">
          <div className="amazon-cart-icon">🛒</div>
          <div className="amazon-cart-text">Carrito</div>
        </button>
      </div>

      <div className="amazon-nav">
        <button>☰ Todos</button>
        <Link to="/deals">Ofertas del Día</Link>
        <Link to="/customer-service">Atención al Cliente</Link>
        <Link to="/registry">Lista de Deseos</Link>
        <Link to="/gift-cards">Tarjetas Regalo</Link>
        <Link to="/sell">Vender</Link>
      </div>
    </div>
  )
}

export default Header
