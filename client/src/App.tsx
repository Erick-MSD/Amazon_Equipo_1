import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import HomeVendedor from './pages/HomeVendedor'
import Search from './pages/Search'
import RegistroCliente from './pages/RegistroCliente'
import RegistroVendedor from './pages/RegistroVendedor'
import AgregarProducto from './pages/AgregarProducto'
import EditarProducto from './pages/EditarProducto'
import Checkout from './pages/Checkout'
import ProductDetail from './pages/ProductDetail'
import EchoDot from './pages/EchoDot'
import logoSvg from './assets/img/Amazon_logo.svg'

export default function App() {
  return (

    <div className="app-wrapper">
      {/* Navegación superior */}
      <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
        <Link to="/">Inicio</Link>
        <Link to="/search">Búsqueda</Link>
        <Link to="/login">Login</Link>
        <Link to="/add-product">Agregar Producto</Link>
        <Link to="/Checkout">Carrito</Link>
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
        <Route path="/edit-product/:id" element={<EditarProducto />} />
        <Route path="/echo-dot" element={<EchoDot />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </div>
  )
}
