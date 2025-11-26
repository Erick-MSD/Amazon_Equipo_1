import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams() // ID del producto desde la URL

  const [product, setProduct] = useState<any>(null)
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Cargar datos del producto (solo para mostrarlo)
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err))
  }, [id])

  // Enviar calificación
  const enviarReview = async (e: any) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: id,
          usuarioId: "1234567890abcdef", // ← luego lo conectamos a tu login
          calificacion: estrellas,
          comentario
        })
      })

      const data = await res.json()
      setMensaje("¡Gracias por tu calificación!")
      setComentario('')
      setEstrellas(5)

    } catch (error) {
      console.error(error)
      setMensaje("Error al enviar la calificación")
    }
  }

  if (!product) return <p>Cargando...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.nombre}</h1>
      <img src={product.imagen} className="w-64 mb-4" />

      <h2 className="text-xl font-semibold mt-6">Calificar producto</h2>

      <form onSubmit={enviarReview} className="mt-4 bg-gray-100 p-4 rounded-lg">
        <label className="block mb-2 font-medium">Estrellas (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={estrellas}
          onChange={(e) => setEstrellas(Number(e.target.value))}
          className="border p-2 w-full"
        />

        <label className="block mt-4 mb-2 font-medium">Comentario</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="border p-2 w-full h-24"
        />

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Enviar calificación
        </button>
      </form>

      {mensaje && <p className="mt-3 text-green-600">{mensaje}</p>}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import CartSidebar from '../components/CartSidebar'

const placeholderImages = [
  'https://via.placeholder.com/600x600?text=Imagen+1',
  'https://via.placeholder.com/600x600?text=Imagen+2',
  'https://via.placeholder.com/600x600?text=Imagen+3'
]

const ProductDetail: React.FC = () => {
  const { id } = useParams()
  const location = useLocation()
  // The page works as a skeleton: it can receive product data via `location.state.product`.
  const stateProduct = (location.state as any)?.product

  const [product, setProduct] = useState<any>(stateProduct || {
    nombre: 'Nombre del producto (ejemplo)',
    precio: 999.99,
    precioOriginal: 1299.99,
    descripcion: 'Descripción corta del producto. Aquí irá un resumen atractivo.',
    imagenes: placeholderImages,
    detalles: [
      'Característica 1 importante',
      'Característica 2 destacada',
      'Material: Algodón / Metal, etc.'
    ],
    informacionImportante: [
      'Envío en 24-48 hrs (estimado).',
      'Garantía: 1 año limitada.'
    ]
  })

  // If there was no state product, fetch from backend by id
  useEffect(() => {
    let mounted = true
    async function load() {
      if (stateProduct) return
      if (!id) return
      try {
        const base = (import.meta as any).env?.VITE_API_URL || ''
        const res = await fetch(`${base}/api/products/${id}`)
        if (!res.ok) throw new Error('Fetch failed')
        const data = await res.json()
        if (mounted) setProduct(data)
      } catch (err) {
        // keep placeholder
        console.error('Error fetching product by id', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [id, stateProduct])

  const images: string[] = product.imagenes || placeholderImages
  const [index, setIndex] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const navigate = useNavigate()

  // Add to cart functionality (localStorage)
  const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

  // compute savings if precioOriginal exists
  const ahorro = product.precioOriginal && product.precioOriginal > product.precio
    ? product.precioOriginal - product.precio
    : 0

  // extra product info (display-only). Use placeholders if missing.
  const stock = typeof product.stock === 'number' ? product.stock : (product.stock ? Number(product.stock) : null)
  const seller =
    product?.vendedorId?.vendedorInfo?.nombreTienda ||
    product?.vendedorId?.nombre ||
    product.vendedorNombre ||
    'Vendedor externo'

  const sellerId = product?.vendedorId?._id || product?.vendedorId || product?.vendedor || null
  const shipsFrom = product.origen || product.shipsFrom || 'México'
  const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // +4 days estimate
  const deliveryStr = deliveryDate.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' })
  const shipTo = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      return user?.direccion || 'Tu dirección'
    } catch (e) {
      return 'Tu dirección'
    }
  })()

  const addToCart = (prod: any, qty: number = 1) => {
    try {
      const cartData = localStorage.getItem('cart')
      let cart = cartData ? JSON.parse(cartData) : []
      const existingIndex = cart.findIndex((item: any) => item.id === (prod._id || prod.id))
      if (existingIndex >= 0) {
        cart[existingIndex].cantidad += qty
      } else {
        cart.push({
          id: prod._id || prod.id || id,
          nombre: prod.nombre || prod.titulo || 'Producto',
          precio: prod.precio || 0,
          cantidad: qty,
          imagen: prod.imagenes?.[0] || ''
        })
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      // dispatch a custom event so other components (CartSidebar) can react
      try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { product: prod } })) } catch (e) { /* ignore */ }
      // show non-blocking toast instead of alert
      try { window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '✅ Producto agregado al carrito' } })) } catch (e) { /* ignore */ }
    } catch (err) {
      console.error('Error adding to cart', err)
      try { window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'No se pudo agregar al carrito' } })) } catch (e) { /* ignore */ }
    }
  }

  const isOutOfStock = stock === 0
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  // Helper to resolve image URLs safely (use absolute URLs as-is; prefix API base for relative paths)
  const resolveImg = (img?: string, fallback?: string) => {
    if (!img) return fallback || `https://via.placeholder.com/150?text=${encodeURIComponent(product.nombre || 'Producto')}`
    // if already absolute
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('//')) return img
    const base = (import.meta as any).env?.VITE_API_URL || ''
    if (!base) return img
    // avoid double slashes
    return `${base.replace(/\/$/, '')}/${img.replace(/^\//, '')}`
  }

  // Fetch related products from the same category (exclude current product)
  useEffect(() => {
    let mounted = true
    async function loadRelated() {
      const cat = product?.categoria
      if (!cat) {
        setRelatedProducts([])
        return
      }
      try {
        const base = (import.meta as any).env?.VITE_API_URL || ''
        const res = await fetch(`${base}/api/products?categoria=${encodeURIComponent(cat)}&limit=8`)
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        if (!mounted) return
        const items = (data.items || [])
          .filter((p: any) => (p._id || p.id) !== (product._id || product.id))
          .slice(0, 4)
        setRelatedProducts(items)
      } catch (err) {
        console.error('Error loading related products', err)
        setRelatedProducts([])
      }
    }
    loadRelated()
    return () => { mounted = false }
  }, [product])

  return (
    <div>
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className="product-page">
      <div className="product-main">
        <div className="product-left">
          <div className="product-carousel">
            <button className="carousel-btn prev" onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}>❮</button>
            <img src={resolveImg(images[index])} alt={`${product.nombre} ${index + 1}`} />
            <button className="carousel-btn next" onClick={() => setIndex((i) => (i + 1) % images.length)}>❯</button>
          </div>

          <div className="product-thumbs">
            {images.map((src, i) => (
              <button key={i} className={`thumb ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)}>
                <img src={resolveImg(src)} alt={`thumb-${i}`} />
              </button>
            ))}
          </div>
  </div>
  {/* center column with title, rating, price details, about */}
        <div className="product-center">
          <h1 className="pd-title">{product.nombre}</h1>
          {/* Small link to seller's page */}
          {sellerId && (
            <div className="seller-link">
              <Link to={`/seller/${sellerId}`}>Ver todos los productos de este vendedor</Link>
            </div>
          )}
          <div className="pd-meta">
            <div className="pd-rating">⭐⭐⭐⭐☆ <span className="pd-rating-count">(4.8)</span></div>
            <div className="pd-sold">40+ vendidos</div>
          </div>

          <div className="center-pricing">
            {product.precioOriginal ? <div className="pd-original">{currency.format(product.precioOriginal)}</div> : null}
            <div className="pd-price">{currency.format(product.precio)}</div>
          </div>

          {ahorro > 0 && product.precioOriginal ? (
            <div className="pd-savings">Ahorras {currency.format(ahorro)} ({Math.round((ahorro / product.precioOriginal) * 100)}%)</div>
          ) : null}

          <div className="center-highlights">
            <p className="pd-short">{product.descripcion}</p>
            <ul className="product-features">
              {(product.detalles || []).map((d: string, k: number) => <li key={k}>{d}</li>)}
            </ul>
          </div>
        </div>

        {/* right column: buy box */}
        <div className="product-right">
          <div className="purchase-box">
            <div className="pd-pricing">
              {product.precioOriginal ? <div className="pd-original">{currency.format(product.precioOriginal)}</div> : null}
              <div className="pd-price">{currency.format(product.precio)}</div>
            </div>

            {ahorro > 0 && product.precioOriginal ? (
              <div className="pd-savings">Ahorras {currency.format(ahorro)} ({Math.round((ahorro / product.precioOriginal) * 100)}%)</div>
            ) : null}

            <div className="pd-fulfillment">
              <div className="ful-row"><strong>Entrega estimada:</strong> {deliveryStr}</div>
              <div className="ful-row"><strong>Enviado a:</strong> {shipTo}</div>
              <div className="ful-row"><strong>Disponible:</strong> {stock === null ? 'Consultar' : stock}</div>
              <div className="ful-row"><strong>Enviado desde:</strong> {shipsFrom}</div>
              <div className="ful-row"><strong>Vendido por:</strong> {seller}</div>
            </div>

            <div className="pd-quantity">
              <label> Cantidad: </label>
              {isOutOfStock ? (
                <div className="out-of-stock">No disponible</div>
              ) : (
                <select value={quantity} onChange={(e) => {
                  const val = Math.max(1, Math.min(Number(e.target.value || 1), stock || 10))
                  setQuantity(val)
                }}>
                  {Array.from({ length: Math.min(10, (stock === null ? 10 : (stock || 10))) }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="pd-actions">
              <button className="add-to-cart-btn" onClick={() => addToCart(product, quantity)} disabled={isOutOfStock}>Agregar al Carrito</button>
              <button className="buy-now-btn" onClick={() => { if (!isOutOfStock) { addToCart(product, quantity); navigate('/checkout') } }} disabled={isOutOfStock}>Comprar ahora</button>
            </div>

            <div className="important-info compact">
              <ul>
                {(product.informacionImportante || []).map((i: string, k: number) => <li key={k}>{i}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="product-details">
        <h2>Acerca del producto</h2>
        <ul>
          {(product.detalles || []).map((d: string, k: number) => <li key={k}>{d}</li>)}
        </ul>
      </div>

      <div className="related-and-reviews">
        <div className="related">
          <h3>Productos relacionados</h3>
          <div className="amazon-deals-grid related-products">
            {relatedProducts.length === 0 ? (
              <div style={{ color: '#666' }}>No hay productos relacionados</div>
            ) : (
              relatedProducts.map((p) => {
                const pid = p._id ? (typeof p._id === 'string' ? p._id : String(p._id)) : (p.id ? String(p.id) : null)
                const toPath = pid ? `/product/${pid}` : '#'
                return (
                  <a
                    key={pid || JSON.stringify(p).slice(0, 8)}
                    href={toPath}
                    className="amazon-deal-item"
                    onClick={(e) => {
                      // If no id, let the link be inert
                      if (!pid) {
                        e.preventDefault()
                        return
                      }
                      // SPA navigation (prevent full reload)
                      e.preventDefault()
                      try {
                        navigate(toPath, { state: { product: p } })
                      } catch (err) {
                        // fallback to normal navigation
                        window.location.href = toPath
                      }
                    }}
                  >
                    <div className="deal-card">
                      <div className="deal-image-wrap">
                        <img src={resolveImg((p.imagenes && p.imagenes[0]) || undefined, `https://via.placeholder.com/150?text=${encodeURIComponent(p.nombre || 'Producto')}`)} alt={p.nombre} />
                      </div>
                      <div className="deal-body">
                        <div className="amazon-deal-title">{p.nombre}</div>
                        <div className="amazon-deal-subtitle">{p.categoria || ''}</div>
                        <div style={{ marginTop: 6, fontWeight: 700 }}>{currency.format(p.precio)}</div>
                      </div>
                    </div>
                  </a>
                )
              })
            )}
          </div>
        </div>

        <div className="reviews">
          <h3>Reseñas</h3>
          <div className="review-list">
            {[1,2].map((r) => (
              <div key={r} className="review">
                <div className="review-header">
                  <strong>Usuario {r}</strong>
                  <span className="review-rating">⭐⭐⭐⭐☆</span>
                </div>
                <div className="review-body">Comentario de ejemplo que describe la experiencia del usuario con el producto. Muy útil y claro.</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ProductDetail
