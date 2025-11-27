import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import resolveImg from '../utils/resolveImg'
import CartSidebar from '../components/CartSidebar'
import '../assets/css/styles.css'
import '../assets/css/style-vendedor.css'

const HomeVendedor: React.FC = () => {
  const [vendorName, setVendorName] = useState<string>('Vendedor')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [ordersTab, setOrdersTab] = useState<'pendiente' | 'enviado' | 'all'>('pendiente')
  const navigate = useNavigate()

  // Obtener el nombre del vendedor desde localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.nombre) {
          setVendorName(user.nombre)
        }
      } catch (err) {
        console.error('Error parsing user data:', err)
      }
    }
  }, [])

  // Obtener los productos del vendedor
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) return

        const user = JSON.parse(userStr)
        const vendedorId = user.id

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const response = await fetch(`${API_URL}/api/products?limit=100`)
        const data = await response.json()

        // Filtrar solo los productos de este vendedor
        const vendorProducts = data.items.filter((p: any) => {
          // vendedorId puede venir como string, ObjectId o un objeto poblado { _id, nombre }
          const vid = p?.vendedorId
          if (!vid) return false
          if (typeof vid === 'string') return vid === vendedorId
          if (typeof vid === 'object') {
            // try _id first
            const idVal = (vid._id && (typeof vid._id === 'string' ? vid._id : String(vid._id))) || (typeof vid === 'string' ? vid : undefined)
            return idVal === vendedorId
          }
          return String(vid) === vendedorId
        })
        setProducts(vendorProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Fetch pending orders for this seller
  useEffect(() => {
    let mounted = true
    const fetchOrders = async () => {
      setLoadingOrders(true)
      setOrdersError(null)
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          setOrders([])
          setLoadingOrders(false)
          return
        }
        const user = JSON.parse(userStr)
        const vendedorId = user.id
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const statusParam = ordersTab === 'all' ? '' : `?status=${ordersTab}&limit=50`
        const url = `${API_URL}/api/orders/seller/${vendedorId}${statusParam}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('fetch failed')
        const body = await res.json()
        if (!mounted) return
        setOrders(Array.isArray(body.items) ? body.items : [])
      } catch (err) {
        console.error('Error loading orders', err)
        setOrdersError('No se pudieron cargar los pedidos')
      } finally {
        if (mounted) setLoadingOrders(false)
      }
    }

    fetchOrders()

    // Polling: refresh every 30s
    const interval = setInterval(() => fetchOrders(), 30000)

    // Listen for orderCreated events (so seller sees orders immediately in same-browser)
    const onOrderCreated = (e: any) => {
      try {
        const created = e.detail
        const userStr = localStorage.getItem('user')
        if (!userStr) return
        const user = JSON.parse(userStr)
        const vendedorId = user.id
        const hasProductForSeller = (created.productos || []).some((it: any) => {
          const vid = it.productoId?.vendedorId
          return vid && String(vid) === String(vendedorId)
        })
        if (hasProductForSeller) {
          setOrders(prev => [created, ...prev])
        }
      } catch (err) { /* ignore */ }
    }
    window.addEventListener('orderCreated', onOrderCreated)

    return () => { mounted = false; clearInterval(interval); window.removeEventListener('orderCreated', onOrderCreated) }
  }, [ordersTab])

  const markAsShipped = async (orderId: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'enviado' })
      })
      if (!res.ok) throw new Error('update failed')
      const updated = await res.json()
      setOrders((prev) => prev.map(o => (o._id === updated._id ? updated : o)))
    } catch (err) {
      console.error('Error updating order', err)
      try { window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'No se pudo actualizar el pedido' } })) } catch (e) {}
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="amazon-header">
        {/* Top Header */}
        <div className="amazon-header-top">
          {/* Logo */}
          <Link to="/" className="amazon-logo">
            <img src={logoSvg} alt="Amazon" />
            <span className="amazon-logo-com">.com.mx</span>
          </Link>

          {/* Seller Central */}
          <div className="amazon-deliver">
            <div className="amazon-deliver-line1">Centro de Vendedores</div>
            <div className="amazon-deliver-line2">📍 México</div>
          </div>

          {/* Search Bar */}
          <form className="amazon-search" onSubmit={handleSearch}>
            <select title="Buscar en">
              <option>Productos</option>
              <option>Pedidos</option>
              <option>Informes</option>
              <option>Promociones</option>
            </select>
            <input 
              type="text" 
              placeholder="Buscar en Seller Central" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>

          {/* Language */}
          <div className="amazon-language">
            🇲🇽 <span>ES</span>
          </div>

          {/* Account */}
          <Link to="/login" className="amazon-account">
            <div className="amazon-account-line1">Hola, {vendorName}</div>
            <div className="amazon-account-line2">Cuenta de Vendedor</div>
          </Link>

          {/* Reports & Orders */}
          <Link to="/orders" className="amazon-account">
            <div className="amazon-account-line1">Informes</div>
            <div className="amazon-account-line2">y Pedidos</div>
          </Link>

          {/* Seller Tools */}
          <Link to="/seller-tools" className="amazon-cart">
            <div className="amazon-cart-icon">🛠️</div>
            <div className="amazon-cart-text">Herramientas</div>
          </Link>
        </div>

        {/* Navigation Bar */}
        <div className="amazon-nav">
          <button>☰ Todos</button>
          <Link to="/productos">Productos</Link>
          <Link to="/pedidos">Pedidos</Link>
          <Link to="/informes">Informes</Link>
          <Link to="/promociones">Promociones</Link>
          <Link to="/ayuda">Ayuda</Link>
        </div>
      </div>

      {/* Hero Banner for Sellers */}
      <div className="amazon-hero">
        <div className="amazon-hero-banner">
          <h1 className="hero-title">Bienvenido al Centro de Vendedores de Amazon</h1>
          <p className="hero-paragraph"></p>
        </div>
      </div>

      {/* Quick Access Panels */}
      <div className="amazon-quick-access">
        <div className="amazon-container">
          <div className="amazon-quick-grid">
            <div className="amazon-quick-panel">
              <img src="https://media.istockphoto.com/id/1141007332/es/foto/una-mano-de-un-empresario-sosteniendo-una-estructura-de-potencial-estructura-de-clientes.jpg?s=612x612&w=0&k=20&c=-yGrmzNjoACBB6oYTeACKpFYA7Z-3Kwd5HW9PhSHtl8=" alt="Dashboard" />
              <h3>Dashboard de Ventas</h3>
              <p>Monitorea tus métricas de rendimiento y ventas en tiempo real</p>
              <Link to="/ventas" className="amazon-quick-btn">Ver Dashboard</Link>
            </div>
            <div className="amazon-quick-panel">
              <img src="https://i3.wp.com/rz2-marketing.s3.us-east-1.amazonaws.com/blog-es/inventario-de-stock.webp?ssl=1" alt="Inventario" />
              <h3>Gestión de Inventario</h3>
              <p>Administra tu stock, precios y disponibilidad de productos</p>
              <Link to="/inventario" className="amazon-quick-btn">Gestionar Inventario</Link>
            </div>
          </div>
        </div>
      </div>

      
      {/* Main Content */}
      <div className="amazon-main">
        <div className="amazon-container">

          {/* Dashboard Grid */}
          <div className="amazon-grid">

            {/* Orders */}
            <div className="amazon-card">
              <h2>Pedidos</h2>
              {/* Tabs for order status */}
              <div className="orders-tabs">
                <button
                  onClick={() => setOrdersTab('pendiente')}
                  className={`orders-tab-button ${ordersTab === 'pendiente' ? 'orders-tab-active' : 'orders-tab-inactive'}`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setOrdersTab('enviado')}
                  className={`orders-tab-button ${ordersTab === 'enviado' ? 'orders-tab-active' : 'orders-tab-inactive'}`}
                >
                  Enviados
                </button>
                <button
                  onClick={() => setOrdersTab('all')}
                  className={`orders-tab-button ${ordersTab === 'all' ? 'orders-tab-active' : 'orders-tab-inactive'}`}
                >
                  Todos
                </button>
              </div>
              <div className="orders-container">
                {loadingOrders ? (
                  <p className="loading-text">Cargando pedidos...</p>
                ) : ordersError ? (
                  <p>{ordersError}</p>
                ) : orders.length === 0 ? (
                  <p>No hay pedidos.</p>
                ) : (
                  <>
                    <div className="orders-list">
                      {orders.map((o) => (
                        <div key={o._id} className="order-item">
                          <div>
                            <div className="order-id">Pedido #{String(o._id).slice(-6)}</div>
                            <div className="order-details">
                              {o.usuarioId?.nombre || o.usuarioId?.correo || 'Cliente anónimo'} • {new Date(o.fechaPedido).toLocaleString('es-MX')}
                            </div>
                            <div className="order-products">
                              {(o.productos || []).map((it: any, idx: number) => (
                                <span key={idx} className="order-product">
                                  {it.productoId?.nombre ? `${it.productoId.nombre} x${it.cantidad}` : `Producto ${String(it.productoId).slice(-4)} x${it.cantidad}`}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="order-buttons">
                            <button onClick={() => navigate(`/order/${o._id}`)} className="order-view-button">Ver</button>
                            {o.estado === 'pendiente' && <button onClick={() => markAsShipped(o._id)} className="order-ship-button">Marcar como enviado</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <Link to="/pedidos" className="amazon-card-link">Ver todos los pedidos</Link>
            </div>

            {/* Quick Actions */}
            <div className="amazon-signin-card">
              <h2 className="quick-actions-title">Acciones Rápidas</h2>
              <div className="quick-actions-container">
                <Link to="/add-product" className="add-product-button">
                   Agregar Producto
                </Link>
              </div>
            </div>

          </div>

          {/* Performance Insights */}
          <div className="amazon-deals">
            <h2>Insights de Rendimiento</h2>
            <div className="amazon-deals-grid">
              {[
                { title: 'Aumenta tus ventas', description: 'Optimiza tus listados para mejor visibilidad.' },
                { title: 'Mejora entregas', description: 'Asegura tiempos de envío rápidos.' },
                { title: 'Gestiona reseñas', description: 'Responde a reseñas para mejorar calificación.' },
                { title: 'Promociones efectivas', description: 'Crea ofertas para impulsar ventas.' }
              ].map((insight, i) => (
                <div key={i} className="amazon-deal-item">
                  <div className="amazon-deal-title">{insight.title}</div>
                  <div className="amazon-deal-subtitle">{insight.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cerrar Sesión */}
          <div className="amazon-deals">
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  localStorage.removeItem('cart')
                  navigate('/')
                  window.location.reload()
                }}
                style={{
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '15px 40px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cc0000'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff4444'}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer>
        {/* Back to top */}
        <div className="amazon-footer-top">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Volver arriba
          </button>
        </div>

        {/* Footer Links */}
        <div className="amazon-footer-main">
          <div className="amazon-footer-grid">
            <div className="amazon-footer-section">
              <h3>Conócenos</h3>
              <ul>
                <li><a href="#">Sobre Amazon</a></li>
                <li><a href="#">Relaciones con Inversores</a></li>
                <li><a href="#">Amazon Science</a></li>
              </ul>
            </div>
            <div className="amazon-footer-section">
              <h3>Gana dinero con nosotros</h3>
              <ul>
                <li><a href="#">Vende productos en Amazon</a></li>
                <li><a href="#">Vende en Amazon Business</a></li>
                <li><a href="#">Hazte Afiliado</a></li>
              </ul>
            </div>
            <div className="amazon-footer-section">
              <h3>Herramientas para Vendedores</h3>
              <ul>
                <li><a href="#">Centro de Vendedores</a></li>
                <li><a href="#">Ayuda para Vendedores</a></li>
                <li><a href="#">Políticas de Venta</a></li>
              </ul>
            </div>
            <div className="amazon-footer-section">
              <h3>Te ayudamos</h3>
              <ul>
                <li><a href="#">Tu cuenta de vendedor</a></li>
                <li><a href="#">Soporte técnico</a></li>
                <li><a href="#">Ayuda</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="amazon-footer-bottom">
          <div className="amazon-footer-bottom-content">
            <div className="amazon-footer-logo">
              <img src={logoSvg} alt="Amazon" />
            </div>
            <div className="amazon-footer-copyright">
              © 1996-2025, Amazon.com, Inc. o sus filiales
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

export default HomeVendedor
