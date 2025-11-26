import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import AmazonStarRating from '../components/AmazonStarRating'
import AmazonRatingBreakdown from '../components/AmazonRatingBreakdown'

const EchoDot: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('Azul grisáceo')

  const productImages = [
    'https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61-rBFHBuL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71IBWoWKCwL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71zVNGAaGrL._AC_SL1500_.jpg'
  ]

  const colors = [
    { name: 'Azul grisáceo', price: 1299 },
    { name: 'Blanco', price: 1299 },
    { name: 'Negro', price: 1299 }
  ]

  const ratingData = {
    5: 45234,
    4: 12456,
    3: 3421,
    2: 1234,
    1: 892
  }

  const totalReviews = Object.values(ratingData).reduce((sum, count) => sum + count, 0)
  const averageRating = (5*ratingData[5] + 4*ratingData[4] + 3*ratingData[3] + 2*ratingData[2] + 1*ratingData[1]) / totalReviews

  return (
    <div className="product-page">
      {/* Header */}
      <div className="amazon-header">
        <div className="amazon-header-top">
          <Link to="/" className="amazon-logo">
            <img src={logoSvg} alt="Amazon" />
            <span className="amazon-logo-com">.com.mx</span>
          </Link>
          <div className="amazon-deliver">
            <div className="amazon-deliver-line1">Entregar en</div>
            <div className="amazon-deliver-line2">📍 México 01000</div>
          </div>
          <div className="amazon-search">
            <select><option>Todos</option></select>
            <input type="text" placeholder="Buscar en Amazon" />
            <button>🔍</button>
          </div>
          <div className="amazon-language">🇲🇽 <span>ES</span></div>
          <Link to="/login" className="amazon-account">
            <div className="amazon-account-line1">Hola, Identifícate</div>
            <div className="amazon-account-line2">Cuenta y Listas</div>
          </Link>
          <Link to="/orders" className="amazon-account">
            <div className="amazon-account-line1">Devoluciones</div>
            <div className="amazon-account-line2">y Pedidos</div>
          </Link>
          <Link to="/cart" className="amazon-cart">
            <div className="amazon-cart-icon">🛒</div>
            <div className="amazon-cart-text">Carrito</div>
          </Link>
        </div>
        <div className="amazon-nav">
          <button>☰ Todos</button>
          <Link to="/deals">Ofertas del Día</Link>
          <Link to="/customer-service">Atención al Cliente</Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Electrónicos</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/">Audio y Video</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/">Altavoces Inteligentes</Link>
        <span className="breadcrumb-separator">›</span>
        <span>Echo Dot</span>
      </div>

      {/* Product Page */}
      <div className="product-container">
        <div className="product-grid">
          
          {/* Product Images */}
          <div className="product-images">
            <div className="image-thumbnails">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                >
                  <img src={img} alt={`Vista ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className="main-image">
              <img 
                src={productImages[selectedImage]} 
                alt="Echo Dot (5a Gen)"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <Link to="#" className="brand-link">Visita la tienda de Amazon</Link>
            <h1>
              Echo Dot (5.ª generación, modelo de 2022) | Altavoz inteligente con Alexa | Sonido más potente y nítido | Azul grisáceo
            </h1>
            
            {/* Rating */}
            <div className="rating-section">
              <AmazonStarRating 
                rating={averageRating} 
                totalReviews={totalReviews}
                size="medium"
              />
            </div>

            <div style={{fontSize: '14px', color: '#565959', marginBottom: '16px'}}>
              Más de 1K+ comprados el mes pasado
            </div>

            {/* Price */}
            <div className="price-section">
              <div className="price-main">
                <span style={{fontSize: '13px', color: '#565959'}}>-23%</span>
                <span className="price-symbol">$</span>
                <span className="price-whole">1,299</span>
                <span className="price-fraction">00</span>
              </div>
              <div className="price-previous">
                Precio anterior: $1,699.00
              </div>
              <div style={{fontSize: '12px', color: '#565959'}}>
                Los precios incluyen IVA. <Link to="#" style={{color: '#007185'}}>Detalles</Link>
              </div>
            </div>

            {/* Color Selection */}
            <div className="color-selection">
              <div className="color-label">Color: {selectedColor}</div>
              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`color-option ${selectedColor === color.name ? 'selected' : ''}`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="features-list">
              <h3>Acerca de este artículo</h3>
              <ul>
                <li>• NUESTRO ALTAVOZ INTELIGENTE MÁS POPULAR: Echo Dot es nuestro altavoz inteligente con Alexa más vendido.</li>
                <li>• SONIDO MEJORADO: Disfruta de un sonido más potente y nítido con graves más profundos.</li>
                <li>• TU ASISTENTE PERSONAL: Pide a Alexa que reproduzca música, responda preguntas, narre las noticias.</li>
                <li>• CONTROLA TU HOGAR INTELIGENTE: Usa tu voz para encender luces, ajustar termostatos.</li>
              </ul>
            </div>
          </div>

          {/* Purchase Options */}
          <div className="purchase-box">
            <div className="purchase-price">$1,299<span style={{fontSize: '13px'}}>00</span></div>
            
            <div className="delivery-info">
              <div className="delivery-free">Disponible</div>
              <div>Envío <span className="delivery-free">GRATIS</span> el <span className="delivery-date">viernes, 15 de diciembre</span></div>
              <Link to="#" style={{color: '#007185', fontSize: '12px'}}>Detalles</Link>
            </div>

            <div style={{fontSize: '14px', marginBottom: '16px'}}>
              <div>Entregar en <strong>México 01000</strong></div>
              <Link to="#" className="location-update">Actualizar ubicación</Link>
            </div>

            <div className="purchase-buttons">
              <button className="btn-add-cart">
                Agregar al carrito
              </button>
              <button className="btn-buy-now">
                Comprar ahora
              </button>
            </div>

            <div className="security-info">
              <div>🔒 Transacción segura</div>
              <div>Vendido por: Amazon México</div>
              <div>Enviado por: Amazon</div>
            </div>

            <div style={{paddingTop: '16px', borderTop: '1px solid #e7e7e7'}}>
              <Link to="#" style={{color: '#007185', fontSize: '14px'}}>
                ➕ Agregar a Lista de deseos
              </Link>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="rating-breakdown-section">
          <div className="rating-overview">
            <div className="rating-summary">
              <h2 style={{fontSize: '21px', fontWeight: '400', marginBottom: '16px'}}>Reseñas de clientes</h2>
              <AmazonRatingBreakdown 
                ratings={ratingData}
                totalReviews={totalReviews}
                averageRating={averageRating}
              />
            </div>
            
            <div>
              <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '16px'}}>Principales reseñas de México</h3>
              <div style={{borderBottom: '1px solid #e7e7e7', paddingBottom: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                  <div style={{width: '32px', height: '32px', backgroundColor: '#ddd', borderRadius: '50%', marginRight: '12px'}}></div>
                  <div>
                    <div style={{fontWeight: '700', fontSize: '14px'}}>Carlos M.</div>
                    <div style={{fontSize: '12px', color: '#565959'}}>Compra verificada</div>
                  </div>
                </div>
                <div style={{marginBottom: '8px'}}>
                  <AmazonStarRating rating={5} totalReviews={0} showText={false} size="small" />
                  <span style={{fontSize: '14px', fontWeight: '700', marginLeft: '8px'}}>Excelente calidad de sonido</span>
                </div>
                <div style={{fontSize: '12px', color: '#565959', marginBottom: '8px'}}>Reseñado en México el 10 de diciembre de 2024</div>
                <div style={{fontSize: '14px', lineHeight: '20px'}}>
                  El Echo Dot superó mis expectativas. El sonido es mucho mejor que la generación anterior y Alexa responde muy rápido. Perfecto para mi sala.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EchoDot