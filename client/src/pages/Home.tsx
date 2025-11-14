import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    'https://m.media-amazon.com/images/I/61jovjd+f9L._SX3000_.jpg',
    'https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg',
    'https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg'
  ]

  const [direccionDisplay, setDireccionDisplay] = useState("México 01000")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Leer dirección guardada en localStorage (si existe)
    const guardada = localStorage.getItem("direccion_envio")
    if (guardada) {
      setDireccionDisplay(guardada)
    }
  }, [])

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

          {/* Deliver to — AHORA CLICKEABLE */}
          <div
            className="amazon-deliver"
            onClick={() => navigate("/elige-ubicacion")}
            style={{ cursor: "pointer" }}
          >
            <div className="amazon-deliver-line1">Entregar en</div>
            <div className="amazon-deliver-line2">📍 {direccionDisplay}</div>
          </div>

          {/* Search Bar */}
          <div className="amazon-search">
            <select>
              <option>Todos</option>
              <option>Arte y Manualidades</option>
              <option>Automóvil</option>
              <option>Bebé</option>
              <option>Belleza y Cuidado Personal</option>
              <option>Libros</option>
              <option>Computadoras</option>
              <option>Electrónicos</option>
            </select>
            <input type="text" placeholder="Buscar en Amazon" />
            <button>🔍</button>
          </div>

          {/* Language */}
          <div className="amazon-language">
            🇲🇽 <span>ES</span>
          </div>

          {/* Account */}
          <Link to="/login" className="amazon-account">
            <div className="amazon-account-line1">Hola, Identifícate</div>
            <div className="amazon-account-line2">Cuenta y Listas</div>
          </Link>

          {/* Returns & Orders */}
          <Link to="/orders" className="amazon-account">
            <div className="amazon-account-line1">Devoluciones</div>
            <div className="amazon-account-line2">y Pedidos</div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="amazon-cart">
            <div className="amazon-cart-icon">🛒</div>
            <div className="amazon-cart-text">Cesta</div>
          </Link>
        </div>

        {/* Navigation Bar */}
        <div className="amazon-nav">
          <button>☰ Todos</button>
          <Link to="/deals">Ofertas del Día</Link>
          <Link to="/customer-service">Atención al Cliente</Link>
          <Link to="/registry">Lista de Deseos</Link>
          <Link to="/gift-cards">Tarjetas Regalo</Link>
          <Link to="/sell">Vender</Link>
        </div>
      </div>

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
              {[
                { discount: '20', image: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SY200_.jpg', title: 'Echo Dot (5ª Gen)' },
                { discount: '15', image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SY200_.jpg', title: 'Fire TV Stick 4K Max' },
                { discount: '25', image: 'https://images-na.ssl-images-amazon.com/images/I/61Rw7d7xuGL._AC_SX679_.jpg', title: 'Kindle Paperwhite' },
                { discount: '30', image: 'https://m.media-amazon.com/images/I/61zAjw4bqPL._AC_SY200_.jpg', title: 'Ring Video Doorbell' },
                { discount: '18', image: 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SY200_.jpg', title: 'Apple AirPods' },
                { discount: '22', image: 'https://m.media-amazon.com/images/I/81vDZyJQ-4L._AC_SY200_.jpg', title: 'Samsung Galaxy Watch' },
                { discount: '35', image: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SY200_.jpg', title: 'Instant Pot Duo' },
                { discount: '28', image: 'https://images-na.ssl-images-amazon.com/images/I/81FRfhXUoGL._AC_SX679_.jpg', title: 'Ninja Blender' }
              ].map((deal, i) => (
                <Link key={i} to={`/product/${i + 1}`} className="amazon-deal-item">
                  <div className="amazon-deal-badge">
                    {deal.discount}% dto
                  </div>
                  <img src={deal.image} alt={deal.title} />
                  <div className="amazon-deal-title">Oferta del Día</div>
                  <div className="amazon-deal-subtitle">{deal.title}</div>
                </Link>
              ))}
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
    </div>
  )
}

export default Home
