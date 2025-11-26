import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Search from './pages/Search'
import RegistroCliente from './pages/RegistroCliente'
import RegistroVendedor from './pages/RegistroVendedor'
import AgregarProducto from './pages/AgregarProducto'
import logoSvg from './assets/img/Amazon_logo.svg'

export default function App() {
  return (

    <div className="app-wrapper">
      {/* Navegación superior */}
      <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
        <Link to="/">Inicio</Link>
        <Link to="/search">Búsqueda</Link>
        <Link to="/login">Login</Link>
        <Link to="/registro-cliente">Registro Cliente</Link>
        <Link to="/registro-vendedor">Registro Vendedor</Link>
        <Link to="/home-vendedor">Home Vendedor</Link>
        <Link to="/add-product">Agregar Producto</Link>
      </nav>

      {/* Rutas principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
        <Route path="/registro-vendedor" element={<RegistroVendedor />} />
        <Route path="/home-vendedor" element={<HomeVendedor />} />
        <Route path="/add-product" element={<AgregarProducto />} />
      </Routes>
    </div>
  )
}
