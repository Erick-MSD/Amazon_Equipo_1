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
import OrderDetail from './pages/OrderDetail'
import Pedidos from './pages/Pedidos'
import NotificacionesVendedor from './pages/NotificacionesVendedor'
import EstadoEnvio from './pages/EstadoEnvio'
import MiCuenta from './pages/MiCuenta'
import DashboardVentas from './pages/DashboardVentas'
import Inventario from './pages/Inventario'
import logoSvg from './assets/img/Amazon_logo.svg'

export default function App() {
  return (
    <div className="app-wrapper">
      {/* NAV */}
      <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
        <Link to="/notificaciones-vendedor">Notificaciones</Link>

      </nav>

      {/* RUTAS */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
        <Route path="/registro-vendedor" element={<RegistroVendedor />} />
        <Route path="/home-vendedor" element={<HomeVendedor />} />
        <Route path="/vendedor" element={<HomeVendedor />} />
        <Route path="/mi-cuenta" element={<MiCuenta />} />
        <Route path="/add-product" element={<AgregarProducto />} />
        <Route path="/edit-product/:id" element={<EditarProducto />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/ventas" element={<DashboardVentas />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/notificaciones-vendedor" element={<NotificacionesVendedor />} />
        <Route path="/estado-envio" element={<EstadoEnvio />} />
      </Routes>
    </div>
  )
}
