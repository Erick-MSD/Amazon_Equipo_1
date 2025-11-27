import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import resolveImg from '../utils/resolveImg'
import '../assets/css/styles.css'
import '../assets/css/style-vendedor.css'

const DashboardVentas: React.FC = () => {
  const [vendorName, setVendorName] = useState<string>('Vendedor')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true)
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

  // Fetch orders for sales data
  useEffect(() => {
    let mounted = true
    const fetchOrders = async () => {
      setLoadingOrders(true)
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
        const url = `${API_URL}/api/orders/seller/${vendedorId}?limit=100`
        const res = await fetch(url)
        if (!res.ok) throw new Error('fetch failed')
        const body = await res.json()
        if (!mounted) return
        setOrders(Array.isArray(body.items) ? body.items : [])
      } catch (err) {
        console.error('Error loading orders', err)
        setOrders([])
      } finally {
        if (mounted) setLoadingOrders(false)
      }
    }

    fetchOrders()
    return () => { mounted = false }
  }, [])

  // Calculate top products based on actual orders
  const getTopProducts = () => {
    const productSales = new Map()

    orders.forEach(order => {
      if (order.productos) {
        order.productos.forEach((item: any) => {
          const productId = item.productoId?._id || item.productoId
          const product = products.find(p => p._id === productId)
          if (product) {
            const existing = productSales.get(productId) || {
              nombre: product.nombre,
              ventas: 0,
              unidades: 0,
              ingresos: 0,
              precio: product.precio
            }
            existing.ventas += 1
            existing.unidades += item.cantidad
            existing.ingresos += item.cantidad * product.precio
            productSales.set(productId, existing)
          }
        })
      }
    })

    return Array.from(productSales.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5)
  }

  // Calculate sales by category
  const getSalesByCategory = () => {
    const categorySales = new Map()

    orders.forEach(order => {
      if (order.productos) {
        order.productos.forEach((item: any) => {
          const productId = item.productoId?._id || item.productoId
          const product = products.find(p => p._id === productId)
          if (product) {
            const category = product.categoria || 'Otros'
            const existing = categorySales.get(category) || { ventas: 0 }
            existing.ventas += item.cantidad * product.precio
            categorySales.set(category, existing)
          }
        })
      }
    })

    const totalSales = Array.from(categorySales.values()).reduce((sum, cat) => sum + cat.ventas, 0)
    return Array.from(categorySales.entries())
      .map(([categoria, data]) => ({
        categoria,
        ventas: data.ventas,
        porcentaje: totalSales > 0 ? Math.round((data.ventas / totalSales) * 100) : 0
      }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 5)
  }

  // Calculate monthly sales
  const getMonthlySales = () => {
    const monthlyData = new Map()

    orders.forEach(order => {
      if (order.fechaPedido) {
        const date = new Date(order.fechaPedido)
        const monthKey = date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
        const existing = monthlyData.get(monthKey) || { ventas: 0, month: date.getMonth(), year: date.getFullYear() }

        if (order.productos) {
          order.productos.forEach((item: any) => {
            const productId = item.productoId?._id || item.productoId
            const product = products.find(p => p._id === productId)
            if (product) {
              existing.ventas += item.cantidad * product.precio
            }
          })
        }

        monthlyData.set(monthKey, existing)
      }
    })

    return Array.from(monthlyData.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })
      .slice(0, 6)
      .reverse()
      .map(item => ({
        mes: item.monthKey || new Date(item.year, item.month).toLocaleDateString('es-MX', { month: 'long' }),
        ventas: item.ventas
      }))
  }

  const topProducts = getTopProducts()
  const salesByCategory = getSalesByCategory()
  const monthlySales = getMonthlySales()

  // Calculate summary statistics
  const totalSales = orders.reduce((sum, order) => {
    if (order.productos) {
      return sum + order.productos.reduce((orderSum: number, item: any) => {
        const productId = item.productoId?._id || item.productoId
        const product = products.find(p => p._id === productId)
        return product ? orderSum + (item.cantidad * product.precio) : orderSum
      }, 0)
    }
    return sum
  }, 0)

  const totalUnitsSold = orders.reduce((sum, order) => {
    if (order.productos) {
      return sum + order.productos.reduce((orderSum: number, item: any) => orderSum + item.cantidad, 0)
    }
    return sum
  }, 0)

  const uniqueCustomers = new Set(orders.map(order => order.clienteId?._id || order.clienteId)).size
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length
  const outOfStockProducts = products.filter(p => p.stock === 0).length

  // Calculate performance insights
  const getPerformanceInsights = () => {
    const insights = []

    // Top performing product
    if (topProducts.length > 0) {
      insights.push({
        icon: '🏆',
        title: 'Producto Estrella',
        text: `${topProducts[0].nombre} lidera las ventas con ${topProducts[0].unidades} unidades vendidas.`,
        color: '#28a745'
      })
    }

    // Low stock alert
    if (lowStockProducts > 0) {
      insights.push({
        icon: '⚠️',
        title: 'Alerta de Stock',
        text: `${lowStockProducts} productos tienen stock bajo (≤5 unidades) y necesitan reposición.`,
        color: '#ffc107'
      })
    }

    // Out of stock alert
    if (outOfStockProducts > 0) {
      insights.push({
        icon: '🚨',
        title: 'Productos Agotados',
        text: `${outOfStockProducts} productos están completamente agotados.`,
        color: '#dc3545'
      })
    }

    // Sales trend (compare last two months if available)
    if (monthlySales.length >= 2) {
      const recent = monthlySales[monthlySales.length - 1]?.ventas || 0
      const previous = monthlySales[monthlySales.length - 2]?.ventas || 0
      const change = previous > 0 ? ((recent - previous) / previous) * 100 : 0

      if (change > 0) {
        insights.push({
          icon: '📈',
          title: 'Tendencia Positiva',
          text: `Las ventas han aumentado un ${change.toFixed(1)}% en el último mes.`,
          color: '#007bff'
        })
      } else if (change < 0) {
        insights.push({
          icon: '📉',
          title: 'Tendencia Negativa',
          text: `Las ventas han disminuido un ${Math.abs(change).toFixed(1)}% en el último mes.`,
          color: '#dc3545'
        })
      }
    }

    // Default insights if no data
    if (insights.length === 0) {
      insights.push({
        icon: '📊',
        title: 'Comenzando',
        text: 'Aún no hay suficientes datos de ventas para generar insights.',
        color: '#6c757d'
      })
    }

    return insights.slice(0, 4) // Limit to 4 insights
  }

  const performanceInsights = getPerformanceInsights()

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
          <form className="amazon-search">
            <select title="Buscar en">
              <option>Productos</option>
              <option>Pedidos</option>
              <option>Informes</option>
              <option>Promociones</option>
            </select>
            <input type="text" placeholder="Buscar en Seller Central" />
            <button type="submit">🔍</button>
          </form>

          {/* Language */}
          <div className="amazon-language">
            🇲🇽 <span>ES</span>
          </div>

          {/* Account */}
          <Link to="/login" className="amazon-account">
            <div className="amazon-account-line1">Hola, Vendedor</div>
            <div className="amazon-account-line2">Cuenta de Vendedor</div>
          </Link>

          {/* Reports & Orders */}
          <Link to="/pedidos" className="amazon-account">
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
          <Link to="/ventas" className="active">Informes</Link>
          <Link to="/promociones">Promociones</Link>
          <Link to="/ayuda">Ayuda</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="amazon-main dashboard-main" style={{ paddingTop: '10px', marginTop: '20px' }}>
        <div className="amazon-container">
          <h1 style={{ marginBottom: '20px' }}>Dashboard de Reportes de Ventas</h1>

          {/* Dashboard Grid */}
          <div className="amazon-grid">

            {/* Top Products */}
            <div className="amazon-card" style={{ gridColumn: 'span 2' }}>
              <h2>Productos Más Vendidos</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f3f3' }}>
                      <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Producto</th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Ventas</th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Unidades</th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Ingresos ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.nombre}</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{product.ventas}</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{product.unidades}</td>
                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{product.ingresos.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="amazon-card">
              <h2>Ventas por Categoría</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {salesByCategory.map((category, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', fontSize: '14px' }}>{category.categoria}</div>
                    <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${category.porcentaje}%`,
                          backgroundColor: '#007bff',
                          height: '100%',
                          borderRadius: '10px'
                        }}
                      ></div>
                    </div>
                    <div style={{ width: '80px', textAlign: 'right', fontSize: '14px' }}>{category.ventas}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Sales Chart */}
            <div className="amazon-card">
              <h2>Ventas Mensuales</h2>
              <div style={{ display: 'flex', alignItems: 'end', gap: '10px', height: '200px' }}>
                {monthlySales.map((month, index) => {
                  const maxSales = Math.max(...monthlySales.map(m => m.ventas))
                  const height = maxSales > 0 ? (month.ventas / maxSales) * 150 : 0
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div
                        style={{
                          width: '100%',
                          backgroundColor: '#28a745',
                          height: `${height}px`,
                          borderRadius: '4px 4px 0 0',
                          marginBottom: '5px'
                        }}
                      ></div>
                      <div style={{ fontSize: '12px', textAlign: 'center' }}>{month.mes}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>${month.ventas.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="amazon-card">
              <h2>Resumen General</h2>
              <div className="amazon-card-grid">
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Total Ventas: ${totalSales.toLocaleString()}</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Productos Vendidos: {totalUnitsSold}</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Clientes Únicos: {uniqueCustomers}</div>
                </div>
                <div className="amazon-card-item">
                  <div className="amazon-card-item-text">Productos en Inventario: {products.length}</div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="amazon-card" style={{ gridColumn: 'span 2' }}>
              <h2>Insights de Rendimiento</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                {performanceInsights.map((insight, index) => (
                  <div key={index} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: insight.color }}>{insight.icon} {insight.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>{insight.text}</p>
                  </div>
                ))}
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

export default DashboardVentas
