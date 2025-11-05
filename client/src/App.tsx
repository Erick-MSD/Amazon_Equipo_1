import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import RegistroCliente from './pages/RegistroCliente'
import RegistroVendedor from './pages/RegistroVendedor'
import logoSvg from './assets/img/Amazon_logo.svg'

export default function App() {
  return (
    <div className="app-wrapper">
      {/* Navegación superior */}
      <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/registro-cliente">Registro Cliente</Link>
        <Link to="/registro-vendedor">Registro Vendedor</Link>
      </nav>

      {/* Rutas principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
        <Route path="/registro-vendedor" element={<RegistroVendedor />} />
      </Routes>
    </div>
  )
}
