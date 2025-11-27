import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import CartSidebar from '../components/CartSidebar'
import LocationModal from '../components/LocationModal'
import AmazonStarRating from '../components/AmazonStarRating'
import AmazonRatingBreakdown from '../components/AmazonRatingBreakdown'
import ReviewForm from '../components/ReviewForm'

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
      if (stateProduct) {
        setProduct(stateProduct)
        return
      }
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
    // Scroll to top when product changes
    window.scrollTo(0, 0)
    return () => { mounted = false }
  }, [id, stateProduct])

  const images: string[] = product.imagenes || placeholderImages
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('')
  const navigate = useNavigate()

  // Obtener la dirección real de localStorage
  useEffect(() => {
    const direccion = localStorage.getItem('direccion_envio') || ''
    setCurrentLocation(direccion || 'México 01000')
  }, [])

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
  const [shouldRefreshReviews, setShouldRefreshReviews] = useState(0)
  const [showAllReviews, setShowAllReviews] = useState(false)

  // Mock rating data - in real app, fetch from backend
  const ratingData = {
    5: 234,
    4: 124,
    3: 34,
    2: 12,
    1: 8
  }

  const totalReviews = Object.values(ratingData).reduce((sum, count) => sum + count, 0)
  const averageRating = totalReviews > 0 
    ? (5*ratingData[5] + 4*ratingData[4] + 3*ratingData[3] + 2*ratingData[2] + 1*ratingData[1]) / totalReviews
    : 4.5

  // Mock reviews iniciales + reseñas reales del backend
  const mockReviews = [
    {
      id: 1,
      usuario: 'Usuario Verificado',
      calificacion: 5,
      titulo: 'Excelente producto',
      comentario: `${product.nombre} superó mis expectativas. Muy recomendado.`,
      fecha: new Date(),
      verificado: true
    },
    {
      id: 2,
      usuario: 'María González',
      calificacion: 4,
      titulo: 'Buena calidad',
      comentario: 'El producto llegó en perfectas condiciones. La calidad es buena pero el precio podría ser mejor.',
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      verificado: true
    },
    {
      id: 3,
      usuario: 'Carlos Ramírez',
      calificacion: 5,
      titulo: 'Totalmente recomendado',
      comentario: 'Justo lo que esperaba. Entrega rápida y producto de excelente calidad.',
      fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      verificado: true
    },
    {
      id: 4,
      usuario: 'Ana López',
      calificacion: 3,
      titulo: 'Cumple su función',
      comentario: 'Es un producto decente, cumple con lo que promete pero nada extraordinario.',
      fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      verificado: false
    },
    {
      id: 5,
      usuario: 'Pedro Martínez',
      calificacion: 5,
      titulo: '¡Increíble!',
      comentario: 'Superó todas mis expectativas. Definitivamente volvería a comprarlo.',
      fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      verificado: true
    }
  ]

  const [realReviews, setRealReviews] = useState<any[]>([])

  // Fetch reseñas reales del backend
  useEffect(() => {
    let mounted = true
    async function loadReviews() {
      if (!id) return
      try {
        const base = (import.meta as any).env?.VITE_API_URL || ''
        const res = await fetch(`${base}/api/products/${id}/reviews`)
        if (!res.ok) throw new Error('Failed to fetch reviews')
        const data = await res.json()
        if (mounted) {
          setRealReviews(data.reviews || [])
        }
      } catch (err) {
        console.error('Error loading reviews', err)
        if (mounted) setRealReviews([])
      }
    }
    loadReviews()
    return () => { mounted = false }
  }, [id, shouldRefreshReviews])

  // Combinar reseñas mock con reseñas reales
  const allReviews = [...realReviews, ...mockReviews]

  const reviewsToShow = showAllReviews ? allReviews : allReviews.slice(0, 3)

  // Helper to resolve image URLs safely (use absolute URLs as-is; prefix API base for relative paths)
  const resolveImg = (img?: string, fallback?: string) => {
    if (!img) return fallback || `https://via.placeholder.com/600?text=${encodeURIComponent(product.nombre || 'Producto')}`
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

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span className="breadcrumb-separator">›</span>
        {product.categoria && (
          <>
            <Link to={`/search?categoria=${product.categoria}`}>{product.categoria}</Link>
            <span className="breadcrumb-separator">›</span>
          </>
        )}
        <span>{product.nombre}</span>
      </div>

      {/* Product Page */}
      <div className="product-page">
        <div className="product-container">
          <div className="product-grid">
            
            {/* Product Images */}
            <div className="product-images">
              <div className="image-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  >
                    <img src={resolveImg(img)} alt={`Vista ${index + 1}`} />
                  </button>
                ))}
              </div>
              <div className="main-image">
                <img 
                  src={resolveImg(images[selectedImage])} 
                  alt={product.nombre}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              {sellerId && (
                <Link to={`/seller/${sellerId}`} className="brand-link">
                  Visitar la tienda de {seller}
                </Link>
              )}
              <h1>{product.nombre}</h1>
              
              {/* Rating */}
              <div className="rating-section">
                <AmazonStarRating 
                  rating={averageRating} 
                  totalReviews={totalReviews}
                  size="medium"
                />
              </div>

              <div style={{fontSize: '14px', color: '#565959', marginBottom: '16px'}}>
                Más de {Math.floor(totalReviews/10)}+ comprados el mes pasado
              </div>

              {/* Price */}
              <div className="price-section">
                {ahorro > 0 && product.precioOriginal && (
                  <div className="price-main">
                    <span style={{fontSize: '13px', color: '#565959'}}>
                      -{Math.round((ahorro / product.precioOriginal) * 100)}%
                    </span>
                    <span className="price-symbol">$</span>
                    <span className="price-whole">{Math.floor(product.precio)}</span>
                    <span className="price-fraction">
                      {String((product.precio % 1).toFixed(2)).substring(1)}
                    </span>
                  </div>
                )}
                {!ahorro && (
                  <div className="price-main">
                    <span className="price-symbol">$</span>
                    <span className="price-whole">{Math.floor(product.precio)}</span>
                    <span className="price-fraction">
                      {String((product.precio % 1).toFixed(2)).substring(1)}
                    </span>
                  </div>
                )}
                {product.precioOriginal && ahorro > 0 && (
                  <div className="price-previous">
                    Precio anterior: {currency.format(product.precioOriginal)}
                  </div>
                )}
                <div style={{fontSize: '12px', color: '#565959'}}>
                  Los precios incluyen IVA. <Link to="#" style={{color: '#007185'}}>Detalles</Link>
                </div>
              </div>

              {/* Features */}
              <div className="features-list">
                <h3>Acerca de este artículo</h3>
                {product.descripcion && (
                  <p style={{marginBottom: '12px', lineHeight: '20px'}}>{product.descripcion}</p>
                )}
                <ul>
                  {(product.detalles || []).map((d: string, k: number) => (
                    <li key={k}>• {d}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="purchase-box">
              <div className="purchase-price">
                ${Math.floor(product.precio)}
                <span style={{fontSize: '13px'}}>
                  {String((product.precio % 1).toFixed(2)).substring(1)}
                </span>
              </div>
              
              <div className="delivery-info">
                {!isOutOfStock && <div className="delivery-free">Disponible</div>}
                {isOutOfStock && <div className="out-of-stock">Agotado</div>}
                {!isOutOfStock && (
                  <>
                    <div>Envío <span className="delivery-free">GRATIS</span> el <span className="delivery-date">{deliveryStr}</span></div>
                    <Link to="#" style={{color: '#007185', fontSize: '12px'}}>Detalles</Link>
                  </>
                )}
              </div>

              <div style={{fontSize: '14px', marginBottom: '16px'}}>
                <div>Entregar en <strong>{currentLocation}</strong></div>
                <Link 
                  to="#" 
                  className="location-update"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsLocationModalOpen(true)
                  }}
                >
                  Actualizar ubicación
                </Link>
              </div>

              {!isOutOfStock && (
                <div style={{fontSize: '14px', marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '8px'}}>Cantidad:</label>
                  <select 
                    value={quantity} 
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(Number(e.target.value || 1), stock || 10))
                      setQuantity(val)
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #D5D9D9',
                      fontSize: '14px'
                    }}
                  >
                    {Array.from({ length: Math.min(10, (stock === null ? 10 : (stock || 10))) }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="purchase-buttons">
                <button 
                  className="btn-add-cart"
                  onClick={() => addToCart(product, quantity)} 
                  disabled={isOutOfStock}
                >
                  Agregar al carrito
                </button>
                <button 
                  className="btn-buy-now"
                  onClick={() => { 
                    if (!isOutOfStock) { 
                      addToCart(product, quantity); 
                      navigate('/checkout') 
                    } 
                  }} 
                  disabled={isOutOfStock}
                >
                  Comprar ahora
                </button>
              </div>

              <div className="security-info">
                <div><i className="bi bi-shield-lock-fill"></i> Transacción segura</div>
                <div>Vendido por: {seller}</div>
                <div>Enviado desde: {shipsFrom}</div>
                {stock !== null && <div>Stock disponible: {stock}</div>}
              </div>

              <div style={{paddingTop: '16px', borderTop: '1px solid #e7e7e7'}}>
                <Link to="#" style={{color: '#007185', fontSize: '14px'}}>
                  <i className="bi bi-plus-lg"></i> Agregar a Lista de deseos
                </Link>
              </div>
            </div>
          </div>

          {/* Rating Section & Reviews */}
          <div className="rating-breakdown-section">
            <div className="rating-overview">
              {/* Left Column: Rating Summary + Existing Reviews */}
              <div className="rating-summary">
                <h2 style={{fontSize: '21px', fontWeight: '400', marginBottom: '16px'}}>Reseñas de clientes</h2>
                <AmazonRatingBreakdown 
                  ratings={ratingData}
                  totalReviews={totalReviews}
                  averageRating={averageRating}
                />
                
                {/* Existing Reviews Below Rating */}
                <div style={{marginTop: '30px'}}>
                  <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '16px'}}>
                    Principales reseñas
                  </h3>
                  {reviewsToShow.map((review) => (
                    <div key={review._id || review.id} style={{borderBottom: '1px solid #e7e7e7', paddingBottom: '16px', marginBottom: '16px'}}>
                      <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <div style={{width: '32px', height: '32px', backgroundColor: '#ddd', borderRadius: '50%', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'}}>
                          {(review.usuario?.nombre || review.usuario || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{fontWeight: '700', fontSize: '14px'}}>{review.usuario?.nombre || review.usuario || 'Usuario Anónimo'}</div>
                          {review.verificado && <div style={{fontSize: '12px', color: '#565959'}}>Compra verificada</div>}
                        </div>
                      </div>
                      <div style={{marginBottom: '8px'}}>
                        <AmazonStarRating rating={review.calificacion || review.rating || 0} totalReviews={0} showText={false} size="small" />
                        <span style={{fontSize: '14px', fontWeight: '700', marginLeft: '8px'}}>{review.titulo || ''}</span>
                      </div>
                      <div style={{fontSize: '12px', color: '#565959', marginBottom: '8px'}}>
                        Reseñado en México el {new Date(review.fecha || review.createdAt || Date.now()).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <div style={{fontSize: '14px', lineHeight: '20px'}}>
                        {review.comentario || review.comment || ''}
                      </div>
                    </div>
                  ))}
                  
                  {/* Show More Button */}
                  {allReviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      style={{
                        background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
                        border: '1px solid #a88734',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: '#0F1111',
                        fontWeight: '400',
                        marginTop: '8px'
                      }}
                    >
                      {showAllReviews ? 'Mostrar menos reseñas' : `Mostrar más reseñas (${allReviews.length - 3} más)`}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Right Column: Write Review Form */}
              <div>
                <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '16px'}}>
                  Escribe una reseña de cliente
                </h3>
                <p style={{fontSize: '14px', color: '#565959', marginBottom: '20px'}}>
                  Comparte tu experiencia para ayudar a otros clientes
                </p>
                <ReviewForm 
                  productId={id || ''} 
                  onReviewSubmitted={() => setShouldRefreshReviews(prev => prev + 1)}
                />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related" style={{marginTop: '32px'}}>
              <h3 style={{fontSize: '21px', fontWeight: '400', marginBottom: '16px'}}>
                Productos relacionados
              </h3>
              <div className="amazon-deals-grid related-products">
                {relatedProducts.map((p) => {
                  const pid = p._id ? (typeof p._id === 'string' ? p._id : String(p._id)) : (p.id ? String(p.id) : null)
                  const toPath = pid ? `/product/${pid}` : '#'
                  return (
                    <a
                      key={pid || JSON.stringify(p).slice(0, 8)}
                      href={toPath}
                      className="amazon-deal-item"
                      onClick={(e) => {
                        if (!pid) {
                          e.preventDefault()
                          return
                        }
                        e.preventDefault()
                        try {
                          navigate(toPath, { state: { product: p } })
                          window.scrollTo(0, 0)
                        } catch (err) {
                          window.location.href = toPath
                        }
                      }}
                    >
                      <div className="deal-card">
                        <div className="deal-image-wrap">
                          <img 
                            src={resolveImg((p.imagenes && p.imagenes[0]) || undefined, `https://via.placeholder.com/150?text=${encodeURIComponent(p.nombre || 'Producto')}`)} 
                            alt={p.nombre} 
                          />
                        </div>
                        <div className="deal-body">
                          <div className="amazon-deal-title">{p.nombre}</div>
                          <div className="amazon-deal-subtitle">{p.categoria || ''}</div>
                          <div style={{ marginTop: 6, fontWeight: 700 }}>{currency.format(p.precio)}</div>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => {
          setIsLocationModalOpen(false)
          // Actualizar la ubicación cuando se cierre el modal
          const direccion = localStorage.getItem('direccion_envio') || ''
          setCurrentLocation(direccion || 'México 01000')
        }} 
      />
    </div>
  )
}

export default ProductDetail

