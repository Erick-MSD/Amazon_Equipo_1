import React, { useState, useEffect } from 'react'
import resolveImg from '../utils/resolveImg'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import Header from '../components/Header'
import CartSidebar from '../components/CartSidebar'
import '../assets/css/Search.css'

interface Product {
  _id: string
  titulo: string
  descripcion?: string
  precio: number
  categoria: string
  imagenes: string[]
  rating?: number
  vendedorId?: string
}

interface Filters {
  categoria: string[]
  precioMin: number
  precioMax: number
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    categoria: [],
    precioMin: 0,
    precioMax: 10000
  })

  const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes']
  const priceRanges = [
    { label: 'Menos de $100', min: 0, max: 100 },
    { label: '$100 - $500', min: 100, max: 500 },
    { label: '$500 - $1,000', min: 500, max: 1000 },
    { label: '$1,000 - $5,000', min: 1000, max: 5000 },
    { label: 'Más de $5,000', min: 5000, max: 999999 }
  ]

  useEffect(() => {
    fetchProducts()
  }, [query, filters])

  const navigate = useNavigate()

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (filters.categoria.length) params.append('categoria', filters.categoria.join(','))
      params.append('precioMin', filters.precioMin.toString())
      params.append('precioMax', filters.precioMax.toString())

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

      const res = await fetch(`${base}/api/products?${params.toString()}`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      const productsList = data.items || data.products || data || []
      setProducts(productsList)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      if (err.name === 'AbortError') {
        setError('La conexión está tardando mucho. Verifica que el backend esté corriendo.')
      } else if (err.message.includes('Failed to fetch')) {
        setError('No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo en el puerto 4000.')
      } else {
        setError(`Error al cargar productos: ${err.message}`)
      }
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (cat: string) => {
    setFilters(prev => ({
      ...prev,
      categoria: prev.categoria.includes(cat)
        ? prev.categoria.filter(c => c !== cat)
        : [...prev.categoria, cat]
    }))
  }

  const setPriceRange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, precioMin: min, precioMax: max }))
  }

  const clearFilters = () => {
    setFilters({ categoria: [], precioMin: 0, precioMax: 10000 })
  }

  const addToCart = (product: Product) => {
    const cartData = localStorage.getItem('cart')
    let cart = cartData ? JSON.parse(cartData) : []
    
    // Verificar si el producto ya está en el carrito
    const existingIndex = cart.findIndex((item: any) => item.id === product._id)
    
    if (existingIndex >= 0) {
      // Incrementar cantidad
      cart[existingIndex].cantidad += 1
    } else {
      // Agregar nuevo producto
      cart.push({
        id: product._id,
        nombre: product.titulo,
        precio: product.precio,
        cantidad: 1,
        imagen: product.imagenes?.[0]
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { product } })) } catch (e) { }
    alert('✅ Producto agregado al carrito')
  }

  return (
    <div className="search-page">
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Contenido principal */}
      <div className="search-content">
        {/* Sidebar con filtros */}
        <aside className="filters-panel">
          <div className="filters-title-row">
            <h2 className="filters-title">Filtros</h2>
            <button onClick={clearFilters} className="filters-clear-btn">
              Limpiar
            </button>
          </div>

          {/* Filtro por categoría */}
          <div className="filter-section">
            <h3 className="filter-section-title">Categoría</h3>
            {categories.map(cat => (
              <div key={cat} className="filter-option">
                <input
                  type="checkbox"
                  id={`cat-${cat}`}
                  checked={filters.categoria.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <label htmlFor={`cat-${cat}`}>{cat}</label>
              </div>
            ))}
          </div>

          {/* Filtro por precio */}
          <div className="filter-section">
            <h3 className="filter-section-title">Precio</h3>
            {priceRanges.map((range, idx) => (
              <div key={idx} className="filter-option">
                <input
                  type="radio"
                  id={`price-${idx}`}
                  name="price"
                  checked={filters.precioMin === range.min && filters.precioMax === range.max}
                  onChange={() => setPriceRange(range.min, range.max)}
                />
                <label htmlFor={`price-${idx}`}>{range.label}</label>
              </div>
            ))}
          </div>
        </aside>

        {/* Resultados */}
        <section className="results-area">
          <h1 className="results-header-text">
            {query ? (
              <>
                {products.length > 0 ? `1-${products.length} de más de ${products.length}` : '0'} resultados para{' '}
                <span className="results-query">"{query}"</span>
              </>
            ) : (
              'Todos los productos'
            )}
          </h1>

          {loading ? (
            <div className="loading-message" style={{textAlign: 'center', padding: '40px', fontSize: '16px', color: '#565959'}}>
              <div style={{marginBottom: '12px'}}>Cargando productos...</div>
              <div style={{fontSize: '14px'}}>Esto puede tardar unos segundos</div>
            </div>
          ) : error ? (
            <div className="error-message" style={{textAlign: 'center', padding: '40px', backgroundColor: '#FFF4E5', border: '1px solid #F0C14B', borderRadius: '8px', margin: '20px'}}>
              <div style={{fontSize: '18px', fontWeight: '700', color: '#C7511F', marginBottom: '12px'}}>⚠️ Error de conexión</div>
              <div style={{fontSize: '14px', color: '#0F1111', marginBottom: '16px'}}>{error}</div>
              <button 
                onClick={fetchProducts}
                style={{
                  background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
                  border: '1px solid #a88734',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#0F1111'
                }}
              >
                Reintentar
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-message" style={{textAlign: 'center', padding: '40px'}}>
              <div style={{fontSize: '24px', marginBottom: '12px'}}>🔍</div>
              <p style={{fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>No se encontraron productos</p>
              <p style={{fontSize: '14px', color: '#565959'}}>Intenta con otros términos de búsqueda o ajusta los filtros</p>
            </div>
          ) : (
            <div className="results-grid">
              {products.map(product => (
                  <div key={product._id} className="product-item">
                    <a
                      href={product._id ? `/product/${product._id}` : '#'}
                      className="product-link"
                      onClick={(e) => {
                        if (!product._id) { e.preventDefault(); return }
                        e.preventDefault()
                        try { navigate(`/product/${product._id}`, { state: { product } }) } catch (err) { window.location.href = `/product/${product._id}` }
                      }}
                    >
                      <div className="product-img-wrapper">
                        {product.imagenes?.[0] ? (
                          <img src={resolveImg(product.imagenes[0], '')} alt={product.titulo} />
                        ) : (
                          <div className="product-img-placeholder">Sin imagen</div>
                        )}
                      </div>
                      <div className="product-details">
                        <h3 className="product-name">{product.titulo}</h3>
                        {product.rating && (
                          <div className="product-stars">
                            ⭐ {product.rating.toFixed(1)}
                          </div>
                        )}
                        <div className="product-cost">
                          ${product.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="product-tag">{product.categoria}</div>
                      </div>
                    </a>
                    <div className="product-actions">
                      <button 
                        onClick={() => addToCart(product)}
                        className="add-to-cart-btn"
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="search-footer">
        <div className="search-footer-links">
          <a href="/conditions" className="search-footer-link">Conditions of Use</a>
          <a href="/privacy" className="search-footer-link">Privacy Note</a>
          <a href="/help" className="search-footer-link">Help</a>
        </div>
        <div className="search-footer-copyright">
          © 1996-2025, Amazon.com, Inc. or its affiliates
        </div>
      </footer>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

export default Search
