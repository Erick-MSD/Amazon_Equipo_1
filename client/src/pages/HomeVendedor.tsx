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
          <h1 style={{ textAlign: 'center' }}>Bienvenido al Centro de Vendedores de Amazon</h1>
          <p style={{ textAlign: 'center' }}></p>
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

      </div>

      
      {/* Main Content */}
      <div className="amazon-main">
        <div className="amazon-container">

          {/* Dashboard Grid */}
          <div className="amazon-grid">

            {/* Sales Summary */}
            <div className="amazon-card">
              <h2>Resumen de Ventas</h2>
              <div className="amazon-card-grid">
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Ventas Hoy: $1,250</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Unidades Vendidas: 45</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Pedidos Pendientes: 12</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Calificación: 4.8/5</div>
                </div>
              </div>
              <Link to="/ventas" className="amazon-card-link">Ver detalles</Link>
            </div>

            {/* Inventory Management */}
            <div className="amazon-card">
              <h2>Gestión de Inventario</h2>
              <div className="amazon-card-grid">
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Productos Activos: 120</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Stock Bajo: 5</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Fuera de Stock: 2</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Alertas: 3</div>
                </div>
              </div>
              <Link to="/inventario" className="amazon-card-link">Gestionar inventario</Link>
            </div>

            {/* Orders */}
            <div className="amazon-card">
              <h2>Pedidos Recientes</h2>
              <div className="amazon-card-grid">
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Pedido #12345 - Enviado</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Pedido #12346 - Pendiente</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Pedido #12347 - Procesando</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Devoluciones: 1</div>
                </div>
              </div>
              <Link to="/pedidos" className="amazon-card-link">Ver todos los pedidos</Link>
            </div>

            {/* Quick Actions */}
            <div className="amazon-signin-card">
              <h2>Acciones Rápidas</h2>
              <Link to="/add-product" className="amazon-signin-btn">
                Agregar Producto
              </Link>
              <div className="amazon-signin-text">
                <Link to="/crear-promocion">Crear Promoción</Link> | <Link to="/soporte">Soporte</Link>
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

          {/* Mis Productos */}
          <div className="amazon-deals" style={{ marginTop: '30px' }}>
            <h2>Mis Productos</h2>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Cargando productos...</p>
            ) : products.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>
                No tienes productos. <Link to="/add-product">Agregar tu primer producto</Link>
              </p>
            ) : (
              <div className="amazon-deals-grid">
                {products.map((product) => {
                  const hasActiveDiscount = product.descuento?.activo && 
                    new Date(product.descuento.fechaInicio) <= new Date() && 
                    new Date(product.descuento.fechaFin) >= new Date()
                  
                    const pid = product._id ? (typeof product._id === 'string' ? product._id : String(product._id)) : null
                    const toPath = pid ? `/product/${pid}` : '#'
                    return (
                    <div key={product._id} className="amazon-deal-item" style={{ position: 'relative' }}>
                      <a href={toPath} className="seller-product-link" onClick={(e) => {
                        if (!pid) { e.preventDefault(); return }
                        e.preventDefault()
                        try { navigate(toPath, { state: { product } }) } catch (err) { window.location.href = toPath }
                      }}>
                        {product.imagenes && product.imagenes[0] && (() => {
                          const img = product.imagenes[0]
                          const src = resolveImg(img, `https://via.placeholder.com/300?text=${encodeURIComponent(product.nombre || 'Producto')}`)
                          return (
                            <img
                              src={src}
                              alt={product.nombre}
                              style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '10px' }}
                            />
                          )
                        })()}
                        <div className="amazon-deal-title">{product.nombre}</div>
                        <div style={{ marginTop: '5px' }}>
                          {hasActiveDiscount ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '10px' }}>
                                ${product.precioOriginal?.toFixed(2)}
                              </span>
                              <span style={{ color: '#B12704', fontSize: '1.2em', fontWeight: 'bold' }}>
                                ${product.precio.toFixed(2)}
                              </span>
                              <span style={{ color: '#B12704', marginLeft: '5px', fontSize: '0.9em' }}>
                                (-{product.descuento.porcentaje}%)
                              </span>
                            </>
                          ) : (
                            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                              ${product.precio.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="amazon-deal-subtitle" style={{ marginTop: '5px' }}>
                          Stock: {product.stock} unidades
                        </div>
                      </a>
                      <button
                        onClick={() => navigate(`/edit-product/${product._id}`)}
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#f0c14b',
                          border: '1px solid #a88734',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Editar Producto
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
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
