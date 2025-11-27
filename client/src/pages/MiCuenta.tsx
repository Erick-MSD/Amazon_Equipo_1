import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CartSidebar from '../components/CartSidebar'
import '../assets/css/MiCuenta.css'

interface User {
  _id: string
  nombre: string
  correo: string
  telefono?: string
  rol?: string
}

interface Order {
  _id: string
  productos: any[]
  total: number
  estado: string
  direccionEnvio: string
  fechaPedido: string
}

const MiCuenta: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pedidos' | 'perfil' | 'direcciones' | 'wishlist'>('pedidos')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      navigate('/login')
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
      setFormData({
        nombre: userData.nombre || '',
        correo: userData.correo || '',
        telefono: userData.telefono || ''
      })

      // Si es vendedor, redirigir a HomeVendedor
      if (userData.rol === 'vendedor') {
        navigate('/vendedor')
        return
      }

      fetchOrders(userData._id || userData.id)
    } catch (err) {
      console.error('Error parsing user data:', err)
      navigate('/login')
    }
  }, [navigate])

  const fetchOrders = async (userId: string) => {
    try {
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(`${base}/api/orders/user/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data.items || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
      const userId = user?._id || user?.id
      const res = await fetch(`${base}/api/auth/profile/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const updatedUser = await res.json()
      // Mantener el formato del usuario en localStorage
      const userToStore = {
        ...user,
        ...updatedUser,
        correo: updatedUser.correo || updatedUser.email
      }
      localStorage.setItem('user', JSON.stringify(userToStore))
      setUser(userToStore)
      setEditMode(false)

      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: '✅ Perfil actualizado exitosamente' }
      }))
    } catch (err: any) {
      console.error('Error updating profile:', err)
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: `❌ Error: ${err.message}` }
      }))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    navigate('/')
    window.location.reload()
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '#FF9900'
      case 'enviado': return '#067D62'
      case 'entregado': return '#067D62'
      case 'cancelado': return '#C7511F'
      default: return '#565959'
    }
  }

  if (!user) return null

  return (
    <div>
      <Header onCartOpen={() => setIsCartOpen(true)} />

      <div className="mi-cuenta-container">
        <div className="mi-cuenta-content">
          <h1 className="mi-cuenta-titulo">Mi Cuenta</h1>

          <div className="cuenta-layout">
            {/* Sidebar */}
            <aside className="cuenta-sidebar">
              <div className="cuenta-user-info">
                <div className="cuenta-avatar">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="cuenta-user-name">{user.nombre}</div>
                <div className="cuenta-user-email">{user.correo}</div>
              </div>

              <nav className="cuenta-nav">
                <button
                  className={`cuenta-nav-item ${activeTab === 'pedidos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pedidos')}
                >
                  <i className="bi bi-box-seam"></i>
                  Mis Pedidos
                </button>
                <button
                  className={`cuenta-nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
                  onClick={() => setActiveTab('perfil')}
                >
                  <i className="bi bi-person"></i>
                  Mi Perfil
                </button>
                <button
                  className={`cuenta-nav-item ${activeTab === 'direcciones' ? 'active' : ''}`}
                  onClick={() => setActiveTab('direcciones')}
                >
                  <i className="bi bi-geo-alt"></i>
                  Mis Direcciones
                </button>
                <button
                  className={`cuenta-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <i className="bi bi-heart"></i>
                  Lista de Deseos
                </button>
                <button
                  className="cuenta-nav-item"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Cerrar Sesión
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="cuenta-main">
              {activeTab === 'pedidos' && (
                <div className="cuenta-section">
                  <h2 className="cuenta-section-titulo">Mis Pedidos</h2>
                  
                  {loading ? (
                    <div className="cuenta-loading">Cargando pedidos...</div>
                  ) : orders.length === 0 ? (
                    <div className="cuenta-empty">
                      <i className="bi bi-box-seam" style={{ fontSize: '48px', color: '#999' }}></i>
                      <p>No tienes pedidos aún</p>
                      <Link to="/" className="cuenta-btn-primary">Comenzar a comprar</Link>
                    </div>
                  ) : (
                    <div className="pedidos-lista">
                      {orders.map((order) => (
                        <div key={order._id} className="pedido-card">
                          <div className="pedido-header">
                            <div className="pedido-info">
                              <span className="pedido-id">Pedido #{order._id.slice(-8).toUpperCase()}</span>
                              <span className="pedido-fecha">
                                {new Date(order.fechaPedido).toLocaleDateString('es-MX', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <span 
                              className="pedido-estado"
                              style={{ backgroundColor: getStatusColor(order.estado) }}
                            >
                              {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                            </span>
                          </div>

                          <div className="pedido-productos">
                            {order.productos.map((item: any, idx: number) => (
                              <div key={idx} className="pedido-producto-item">
                                <div className="pedido-producto-info">
                                  <span className="pedido-producto-nombre">
                                    {item.productoId?.nombre || 'Producto'}
                                  </span>
                                  <span className="pedido-producto-cantidad">
                                    Cantidad: {item.cantidad}
                                  </span>
                                </div>
                                <span className="pedido-producto-precio">
                                  ${(item.precio * item.cantidad).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pedido-footer">
                            <div className="pedido-total">
                              <span>Total:</span>
                              <span className="pedido-total-monto">${order.total.toFixed(2)}</span>
                            </div>
                            <Link to={`/order/${order._id}`} className="pedido-btn-ver">
                              Ver detalles
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'perfil' && (
                <div className="cuenta-section">
                  <div className="cuenta-section-header">
                    <h2 className="cuenta-section-titulo">Mi Perfil</h2>
                    {!editMode && (
                      <button 
                        className="cuenta-btn-secondary"
                        onClick={() => setEditMode(true)}
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="perfil-form">
                      <div className="form-group">
                        <label>Nombre completo</label>
                        <input
                          type="text"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Correo electrónico</label>
                        <input
                          type="email"
                          value={formData.correo}
                          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Teléfono</label>
                        <input
                          type="tel"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          placeholder="+52 555 123 4567"
                        />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="cuenta-btn-primary">
                          Guardar cambios
                        </button>
                        <button 
                          type="button" 
                          className="cuenta-btn-secondary"
                          onClick={() => {
                            setEditMode(false)
                            setFormData({
                              nombre: user.nombre || '',
                              correo: user.correo || '',
                              telefono: user.telefono || ''
                            })
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="perfil-info">
                      <div className="perfil-info-item">
                        <label>Nombre completo</label>
                        <p>{user.nombre}</p>
                      </div>
                      <div className="perfil-info-item">
                        <label>Correo electrónico</label>
                        <p>{user.correo}</p>
                      </div>
                      <div className="perfil-info-item">
                        <label>Teléfono</label>
                        <p>{user.telefono || 'No registrado'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'direcciones' && (
                <div className="cuenta-section">
                  <h2 className="cuenta-section-titulo">Mis Direcciones</h2>
                  
                  <div className="direcciones-lista">
                    <div className="direccion-card">
                      <div className="direccion-header">
                        <h3>Dirección de envío predeterminada</h3>
                        <button className="cuenta-btn-secondary">
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                      </div>
                      <p className="direccion-texto">
                        {localStorage.getItem('direccion_envio') || 'No hay dirección registrada'}
                      </p>
                    </div>

                    <button 
                      className="direccion-card-add"
                      onClick={() => {
                        // Abrir modal de ubicación
                        window.dispatchEvent(new CustomEvent('openLocationModal'))
                      }}
                    >
                      <i className="bi bi-plus-lg"></i>
                      <span>Agregar nueva dirección</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="cuenta-section">
                  <h2 className="cuenta-section-titulo">Lista de Deseos</h2>
                  
                  {(() => {
                    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
                    
                    if (wishlist.length === 0) {
                      return (
                        <div className="cuenta-empty">
                          <i className="bi bi-heart" style={{ fontSize: '48px', color: '#999' }}></i>
                          <p>Tu lista de deseos está vacía</p>
                          <Link to="/" className="cuenta-btn-primary">Explorar productos</Link>
                        </div>
                      )
                    }
                    
                    return (
                      <div className="wishlist-grid">
                        {wishlist.map((item: any, index: number) => (
                          <div key={index} className="wishlist-card">
                            <div className="wishlist-image">
                              {item.imagen ? (
                                <img src={item.imagen.startsWith('http') ? item.imagen : `http://localhost:4000${item.imagen}`} alt={item.nombre} />
                              ) : (
                                <div className="wishlist-no-image">Sin imagen</div>
                              )}
                            </div>
                            <div className="wishlist-info">
                              <h3 className="wishlist-nombre">{item.nombre}</h3>
                              <p className="wishlist-precio">${item.precio?.toFixed(2)}</p>
                              <div className="wishlist-actions">
                                <Link to={`/product/${item.id}`} className="wishlist-btn-ver">
                                  Ver producto
                                </Link>
                                <button
                                  className="wishlist-btn-eliminar"
                                  onClick={() => {
                                    const updated = wishlist.filter((_: any, i: number) => i !== index)
                                    localStorage.setItem('wishlist', JSON.stringify(updated))
                                    window.location.reload()
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

export default MiCuenta
