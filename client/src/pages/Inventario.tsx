import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import resolveImg from '../utils/resolveImg'
import '../assets/css/styles.css'
import '../assets/css/style-vendedor.css'

const Inventario: React.FC = () => {
  const [vendorName, setVendorName] = useState<string>('Vendedor')
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStock, setEditingStock] = useState<string | null>(null)
  const [newStock, setNewStock] = useState<number>(0)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState<number>(0)
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
          const vid = p?.vendedorId
          if (!vid) return false
          if (typeof vid === 'string') return vid === vendedorId
          if (typeof vid === 'object') {
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

  const updateStock = async (productId: string, stock: number) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock })
      })

      if (!response.ok) throw new Error('Failed to update stock')

      // Update local state
      setProducts(prev => prev.map(p =>
        p._id === productId ? { ...p, stock } : p
      ))
      setEditingStock(null)
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Stock actualizado exitosamente' }
      }))
    } catch (err) {
      console.error('Error updating stock:', err)
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Error al actualizar el stock' }
      }))
    }
  }

  const updatePrice = async (productId: string, precio: number) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precio })
      })

      if (!response.ok) throw new Error('Failed to update price')

      // Update local state
      setProducts(prev => prev.map(p =>
        p._id === productId ? { ...p, precio } : p
      ))
      setEditingPrice(null)
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Precio actualizado exitosamente' }
      }))
    } catch (err) {
      console.error('Error updating price:', err)
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Error al actualizar el precio' }
      }))
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Agotado', color: '#dc3545' }
    if (stock <= 5) return { text: 'Bajo', color: '#ffc107' }
    return { text: 'Disponible', color: '#28a745' }
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
          <Link to="/inventario" className="active">Inventario</Link>
          <Link to="/promociones">Promociones</Link>
          <Link to="/ayuda">Ayuda</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="amazon-main">
        <div className="amazon-container">
          <h1 style={{ marginBottom: '20px' }}>Gestión de Inventario</h1>

          {/* Inventory Management Table */}
          <div className="amazon-card">
            <h2>Productos en Inventario</h2>
            {loading ? (
              <p className="loading-text">Cargando inventario...</p>
            ) : products.length === 0 ? (
              <p className="no-products-text">
                No tienes productos en inventario. <Link to="/add-product">Agregar tu primer producto</Link>
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f3f3' }}>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Producto</th>
                      <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Imagen</th>
                      <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Precio</th>
                      <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Stock</th>
                      <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Estado</th>
                      <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const stockStatus = getStockStatus(product.stock)
                      return (
                        <tr key={product._id}>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <div style={{ fontWeight: 'bold' }}>{product.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                              ID: {String(product._id).slice(-8)}
                            </div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            {product.imagenes && product.imagenes[0] ? (
                              <img
                                src={resolveImg(product.imagenes[0], `https://via.placeholder.com/60?text=${encodeURIComponent(product.nombre || 'Producto')}`)}
                                alt={product.nombre}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            ) : (
                              <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#666' }}>
                                Sin imagen
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            {editingPrice === product._id ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={newPrice}
                                  onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                                  style={{ width: '80px', padding: '4px' }}
                                  aria-label="Nuevo precio del producto"
                                />
                                <button
                                  onClick={() => updatePrice(product._id, newPrice)}
                                  style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setEditingPrice(null)}
                                  style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div style={{ cursor: 'pointer' }} onClick={() => {
                                setEditingPrice(product._id)
                                setNewPrice(product.precio)
                              }}>
                                ${product.precio.toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            {editingStock === product._id ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="number"
                                  min="0"
                                  value={newStock}
                                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                                  style={{ width: '60px', padding: '4px' }}
                                  aria-label="Nuevo stock del producto"
                                />
                                <span>unidades</span>
                                <button
                                  onClick={() => updateStock(product._id, newStock)}
                                  style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setEditingStock(null)}
                                  style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div style={{ cursor: 'pointer' }} onClick={() => {
                                setEditingStock(product._id)
                                setNewStock(product.stock)
                              }}>
                                {product.stock} unidades
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: 'white',
                              backgroundColor: stockStatus.color
                            }}>
                              {stockStatus.text}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => navigate(`/edit-product/${product._id}`)}
                                style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => navigate(`/product/${product._id}`)}
                                style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Ver
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Inventory Summary Cards */}
          <div className="amazon-grid">
            <div className="amazon-card">
              <h2>Resumen de Inventario</h2>
              <div className="amazon-card-grid">
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">
                    Total Productos: {products.length}
                  </div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">
                    Stock Total: {products.reduce((sum, p) => sum + p.stock, 0)} unidades
                  </div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">
                    Productos Agotados: {products.filter(p => p.stock === 0).length}
                  </div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">
                    Stock Bajo (≤5): {products.filter(p => p.stock > 0 && p.stock <= 5).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="amazon-signin-card">
              <h2 className="quick-actions-title">Acciones Rápidas</h2>
              <div className="quick-actions-container">
                <Link to="/add-product" className="add-product-button">
                  Agregar Nuevo Producto
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="amazon-footer-top">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Volver arriba
          </button>
        </div>
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
    </div>
  )
}

export default Inventario
