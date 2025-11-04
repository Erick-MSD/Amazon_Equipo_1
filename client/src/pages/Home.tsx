import React from 'react'
import { Link } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <header className="amazon-header fade-in">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src={logoSvg} alt="Amazon" className="header-logo" />
          </Link>
          <nav className="header-nav">
            <Link to="/Login" className="nav-link">Iniciar sesión</Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <div className="home-content fade-in">
          <h2 className="text-2xl font-semibold mb-4">Bienvenido a Amazon Equipo 1</h2>
          <p className="text-sm text-gray-600">Página principal. Aquí se listarán los productos desde la API.</p>
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-links">
          <a href="/conditions">Conditions of Use</a>
          <a href="/privacy">Privacy Note</a>
          <a href="/help">Help</a>
        </div>
        <div className="footer-copyright">
          © 1996-2025, Amazon.com, Inc. or its affiliates
        </div>
      </footer>
    </div>
  )
}

export default Home
