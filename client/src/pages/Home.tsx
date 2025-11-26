import React, { useState, useEffect } from 'react'
import resolveImg from '../utils/resolveImg'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import CartSidebar from '../components/CartSidebar'
import Header from '../components/Header'

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [offers, setOffers] = useState<any[]>([])
  const [loadingOffers, setLoadingOffers] = useState(false)
  const [offersError, setOffersError] = useState<string | null>(null)
  const navigate = useNavigate()
  

  const slides = [
    'https://m.media-amazon.com/images/I/61jovjd+f9L._SX3000_.jpg',
    'https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg',
    'https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Fetch offers from backend
  useEffect(() => {
    const abortCtrl = new AbortController()
    async function loadOffers() {
      setLoadingOffers(true)
      setOffersError(null)
      try {
        // Request top 8 offers; the server will filter by active discounts when section=offers
        const res = await fetch(`/api/products?section=offers&limit=8`, { signal: abortCtrl.signal })
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const body = await res.json()
        setOffers(Array.isArray(body.items) ? body.items : [])
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error('Error loading offers', err)
        setOffersError('No se pudieron cargar las ofertas')
      } finally {
        setLoadingOffers(false)
      }
    }

    loadOffers()
    return () => abortCtrl.abort()
  }, [])

  return (
    <div>
      {/* Header */}
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Hero Carousel */}
      <div className="amazon-hero">
        {slides.map((slide, index) => (
          <div key={index} className={`amazon-slide ${index === currentSlide ? 'active' : ''}`}>
            <img src={slide} alt={`Slide ${index + 1}`} />
          </div>
        ))}
        
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="amazon-hero-btn prev"
        >
          ❮
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="amazon-hero-btn next"
        >
          ❯
        </button>
      </div>

      {/* Main Content */}
      <div className="amazon-main">
        <div className="amazon-container">
          
          {/* Product Grid */}
          <div className="amazon-grid">
            
            {/* Gaming accessories */}
            <div className="amazon-card">
              <h2>Accesorios Gaming</h2>
              <div className="amazon-card-grid">
                <Link to="/headsets" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" alt="Auriculares" />
                  <div className="amazon-card-item-text">Auriculares</div>
                </Link>
                <Link to="/keyboards" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Keyboard_1x._SY116_CB667159063_.jpg" alt="Teclados" />
                  <div className="amazon-card-item-text">Teclados</div>
                </Link>
                <Link to="/mice" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Mouse_1x._SY116_CB667159063_.jpg" alt="Ratones" />
                  <div className="amazon-card-item-text">Ratones</div>
                </Link>
                <Link to="/chairs" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Chair_1x._SY116_CB667159060_.jpg" alt="Sillas" />
                  <div className="amazon-card-item-text">Sillas</div>
                </Link>
              </div>
              <Link to="/gaming" className="amazon-card-link">Ver más</Link>
            </div>

            {/* Shop deals in Fashion */}
            <div className="amazon-card">
              <h2>Ofertas en Moda</h2>
              <div className="amazon-card-grid">
                <Link to="/jeans" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_BOTTOMS_1x._SY116_CB624172947_.jpg" alt="Vaqueros por menos de 50€" />
                  <div className="amazon-card-item-text">Vaqueros por menos de 50€</div>
                </Link>
                <Link to="/tops" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_TOPS_1x._SY116_CB623353881_.jpg" alt="Camisetas por menos de 25€" />
                  <div className="amazon-card-item-text">Camisetas por menos de 25€</div>
                </Link>
                <Link to="/dresses" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_DRESSES_1x._SY116_CB623353881_.jpg" alt="Vestidos por menos de 30€" />
                  <div className="amazon-card-item-text">Vestidos por menos de 30€</div>
                </Link>
                <Link to="/shoes" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_SHOES_1x._SY116_CB624172947_.jpg" alt="Zapatos por menos de 50€" />
                  <div className="amazon-card-item-text">Zapatos por menos de 50€</div>
                </Link>
              </div>
              <Link to="/fashion-deals" className="amazon-card-link">Ver todas las ofertas</Link>
            </div>

            {/* Refresh your space */}
            <div className="amazon-card">
              <h2>Renueva tu hogar</h2>
              <div className="amazon-card-grid">
                <Link to="/dining" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/launchpad/2023/Gateway/January/DesktopQuadCat_186x116_LP-HP_B08MYX5Q2W_01.23._SY116_CB619238939_.jpg" alt="Comedor" />
                  <div className="amazon-card-item-text">Comedor</div>
                </Link>
                <Link to="/home-decor" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_Home_1x._SY304_CB431284936_.jpg" alt="Hogar" />
                  <div className="amazon-card-item-text">Hogar</div>
                </Link>
                <Link to="/kitchen" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/launchpad/2023/Gateway/January/DesktopQuadCat_186x116_kitchen_B0126LMDFK_01.23._SY116_CB619238939_.jpg" alt="Cocina" />
                  <div className="amazon-card-item-text">Cocina</div>
                </Link>
                <Link to="/health-beauty" className="amazon-card-item">
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/launchpad/2023/Gateway/January/DesktopQuadCat_186x116_health-beauty_B07662GN57_01.23._SY116_CB619238939_.jpg" alt="Salud y Belleza" />
                  <div className="amazon-card-item-text">Salud y Belleza</div>
                </Link>
              </div>
              <Link to="/home-refresh" className="amazon-card-link">Ver más</Link>
            </div>

            {/* Sign In Card */}
            <div className="amazon-signin-card">
              <h2>Inicia sesión para la mejor experiencia</h2>
              <Link to="/login" className="amazon-signin-btn">
                Iniciar sesión de forma segura
              </Link>
              <div className="amazon-signin-text">
                ¿Nuevo cliente? <Link to="/register">Empieza aquí.</Link>
              </div>
            </div>

          </div>

          {/* Today's Deals */}
          <div className="amazon-deals">
            <h2>Ofertas del Día</h2>
            <div className="amazon-deals-grid">
              {loadingOffers ? (
                <div> Cargando ofertas... </div>
              ) : offersError ? (
                <div>{offersError}</div>
              ) : offers.length === 0 ? (
                <div>No hay ofertas disponibles</div>
              ) : (
                offers.map((p, i) => {
                  const pid = p._id ? (typeof p._id === 'string' ? p._id : String(p._id)) : null
                  const toPath = pid ? `/product/${pid}` : '#'
                  return (
                    <div key={p._id || i} className="amazon-deal-item">
                      <a href={toPath} className="offer-link" onClick={(e) => {
                        if (!pid) { e.preventDefault(); return }
                        e.preventDefault()
                        try { navigate(toPath, { state: { product: p } }) } catch (err) { window.location.href = toPath }
                      }}>
                        <div className="deal-card">
                          <div className="deal-image-wrap">
                            <img src={resolveImg((p.imagenes && p.imagenes[0]) || undefined, 'https://via.placeholder.com/150')} alt={p.nombre || 'Producto'} />
                            {p.descuento?.porcentaje ? (
                              <div className="amazon-deal-badge">{`${p.descuento.porcentaje}% dto`}</div>
                            ) : null}
                          </div>

                          <div className="deal-body">
                            <div className="amazon-deal-title">Oferta del Día</div>
                            <div className="amazon-deal-subtitle">{p.nombre}</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  )
                })
              )}
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
                <li><a href="#">Empleo</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Sobre Amazon</a></li>
                <li><a href="#">Relaciones con Inversores</a></li>
                <li><a href="#">Dispositivos Amazon</a></li>
                <li><a href="#">Amazon Science</a></li>
              </ul>
            </div>
            <div className="amazon-footer-section">
              <h3>Gana dinero con nosotros</h3>
              <ul>
                <li><a href="#">Vende productos en Amazon</a></li>
                <li><a href="#">Vende en Amazon Business</a></li>
                <li><a href="#">Vende aplicaciones en Amazon</a></li>
                <li><a href="#">Hazte Afiliado</a></li>
                <li><a href="#">Anuncia tus productos</a></li>
                <li><a href="#">Publica con nosotros</a></li>
              </ul>
            </div>
            <div className="amazon-footer-section">
              <h3>Métodos de pago Amazon</h3>
              <ul>
                <li><a href="#">Tarjeta Amazon Business</a></li>
                <li><a href="#">Compra con Puntos</a></li>
                <li><a href="#">Recarga tu saldo</a></li>
                <li><a href="#">Conversor de Divisas Amazon</a></li>
              </ul>
            </div>
            <div className="amazon-footer-section">
              <h3>Te ayudamos</h3>
              <ul>
                <li><a href="#">Amazon y COVID-19</a></li>
                <li><a href="#">Tu cuenta</a></li>
                <li><a href="#">Tus pedidos</a></li>
                <li><a href="#">Gastos y políticas de envío</a></li>
                <li><a href="#">Devoluciones y reemplazos</a></li>
                <li><a href="#">Gestiona tu contenido y dispositivos</a></li>
                <li><a href="#">Asistente Amazon</a></li>
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

export default Home