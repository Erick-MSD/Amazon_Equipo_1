import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import '../assets/css/Checkout.css'

interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}

interface Address {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  estado: string
  codigoPostal: string
  telefono: string
  predeterminada?: boolean
}

interface PaymentMethod {
  id: string
  tipo: 'tarjeta'
  numeroTarjeta: string
  nombreTarjeta: string
  expiracion: string
  predeterminada?: boolean
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [userName, setUserName] = useState('')
  
  // Estados para direcciones
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    telefono: ''
  })

  // Estados para métodos de pago
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentFormData, setPaymentFormData] = useState({
    numeroTarjeta: '',
    nombreTarjeta: '',
    expiracion: '',
    cvv: ''
  })

  // Control de secciones expandidas
  const [expandedSection, setExpandedSection] = useState<'address' | 'payment' | 'review' | null>('address')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Cargar carrito
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      setCartItems(JSON.parse(cartData))
    }

    // Cargar datos del usuario
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.nombre || '')
      } catch (err) {
        console.error('Error parsing user:', err)
      }
    }

    // Cargar direcciones guardadas
    const savedAddresses = localStorage.getItem('addresses')
    if (savedAddresses) {
      const addressList = JSON.parse(savedAddresses)
      setAddresses(addressList)
      const defaultAddr = addressList.find((a: Address) => a.predeterminada)
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
    }

    // Cargar métodos de pago guardados
    const savedPayments = localStorage.getItem('paymentMethods')
    if (savedPayments) {
      const paymentList = JSON.parse(savedPayments)
      setPaymentMethods(paymentList)
      const defaultPayment = paymentList.find((p: PaymentMethod) => p.predeterminada)
      if (defaultPayment) setSelectedPaymentId(defaultPayment.id)
    }
  }, [])

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }

  const getShipping = () => {
    return getSubtotal() > 500 ? 0 : 99
  }

  const getTax = () => {
    return getSubtotal() * 0.16
  }

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax()
  }

  const handleAddAddress = () => {
    if (!addressFormData.nombre || !addressFormData.direccion || !addressFormData.ciudad) {
      setError('Completa todos los campos de dirección')
      return
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...addressFormData,
      predeterminada: addresses.length === 0
    }

    const updatedAddresses = [...addresses, newAddress]
    setAddresses(updatedAddresses)
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses))
    setSelectedAddressId(newAddress.id)
    setShowAddressForm(false)
    setAddressFormData({
      nombre: '',
      direccion: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
      telefono: ''
    })
    setExpandedSection('payment')
    setError('')
  }

  const handleAddPayment = () => {
    if (!paymentFormData.numeroTarjeta || !paymentFormData.nombreTarjeta || !paymentFormData.expiracion || !paymentFormData.cvv) {
      setError('Completa todos los campos de pago')
      return
    }

    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      tipo: 'tarjeta',
      numeroTarjeta: paymentFormData.numeroTarjeta,
      nombreTarjeta: paymentFormData.nombreTarjeta,
      expiracion: paymentFormData.expiracion,
      predeterminada: paymentMethods.length === 0
    }

    const updatedPayments = [...paymentMethods, newPayment]
    setPaymentMethods(updatedPayments)
    localStorage.setItem('paymentMethods', JSON.stringify(updatedPayments))
    setSelectedPaymentId(newPayment.id)
    setShowPaymentForm(false)
    setPaymentFormData({
      numeroTarjeta: '',
      nombreTarjeta: '',
      expiracion: '',
      cvv: ''
    })
    setExpandedSection('review')
    setError('')
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError('Tu carrito está vacío')
      return
    }

    if (!selectedAddressId) {
      setError('Selecciona una dirección de envío')
      setExpandedSection('address')
      return
    }

    if (!selectedPaymentId) {
      setError('Selecciona un método de pago')
      setExpandedSection('payment')
      return
    }

    setLoading(true)
    setError('')

    try {
      // build order payload
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const usuarioId = user?.id || user?._id || null
      const payload = {
        usuarioId,
        productos: cartItems.map(ci => ({ productoId: ci.id, cantidad: ci.cantidad, precioUnitario: ci.precio })),
        direccionEnvio: {
          nombre: selectedAddress?.nombre,
          calle: selectedAddress?.direccion,
          ciudad: selectedAddress?.ciudad,
          estado: selectedAddress?.estado,
          codigoPostal: selectedAddress?.codigoPostal,
          telefono: selectedAddress?.telefono
        },
        total: getTotal(),
        metodoPago: selectedPayment ? `${selectedPayment.tipo}` : 'desconocido'
      }

      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Order create failed')
      const created = await res.json()
      // clear cart and navigate to order detail
      localStorage.removeItem('cart')
      try { window.dispatchEvent(new CustomEvent('cartUpdated')) } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '✅ Pedido realizado con éxito' } })) } catch (e) {}
  try { window.dispatchEvent(new CustomEvent('orderCreated', { detail: created })) } catch (e) {}
      navigate(`/order/${created._id}`)
    } catch (err) {
      console.error('Error:', err)
      setError('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId)
  const selectedPayment = paymentMethods.find(p => p.id === selectedPaymentId)

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <Link to="/">
          <img src={logoSvg} alt="Amazon" className="checkout-logo" />
        </Link>
        <h1>Finalizar pedido</h1>
        <div className="checkout-secure">
          <span>🔒</span>
        </div>
      </header>

      <div className="checkout-container">
        {/* Formulario Principal */}
        <div className="checkout-main">
          {error && (
            <div className="checkout-error-banner">
              {error}
            </div>
          )}

          {/* SECCIÓN 1: Dirección de envío */}
          <section className={`checkout-section ${expandedSection === 'address' ? 'expanded' : 'collapsed'}`}>
            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'address' ? null : 'address')}>
              <div className="section-number">1</div>
              <div className="section-content">
                <h2>Dirección de envío</h2>
                {selectedAddress && expandedSection !== 'address' && (
                  <p className="section-summary">
                    {selectedAddress.nombre} - {selectedAddress.direccion}, {selectedAddress.ciudad}
                  </p>
                )}
              </div>
              {selectedAddress && expandedSection !== 'address' && (
                <button className="btn-change" onClick={(e) => { e.stopPropagation(); setExpandedSection('address') }}>
                  Cambiar
                </button>
              )}
            </div>

            {expandedSection === 'address' && (
              <div className="section-body">
                {addresses.length > 0 && (
                  <div className="address-list">
                    {addresses.map(address => (
                      <label key={address.id} className="address-item">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                        />
                        <div className="address-details">
                          <strong>{address.nombre}</strong>
                          <p>{address.direccion}</p>
                          <p>{address.ciudad}, {address.estado} {address.codigoPostal}</p>
                          <p>Teléfono: {address.telefono}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {!showAddressForm ? (
                  <button className="btn-add-new" onClick={() => setShowAddressForm(true)}>
                    + Agregar nueva dirección
                  </button>
                ) : (
                  <div className="form-add-new">
                    <h3>Nueva dirección</h3>
                    <div className="form-group">
                      <label>Nombre completo *</label>
                      <input
                        type="text"
                        value={addressFormData.nombre}
                        onChange={(e) => setAddressFormData({...addressFormData, nombre: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Dirección *</label>
                      <input
                        type="text"
                        placeholder="Calle, número, colonia"
                        value={addressFormData.direccion}
                        onChange={(e) => setAddressFormData({...addressFormData, direccion: e.target.value})}
                      />
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Ciudad *</label>
                        <input
                          type="text"
                          value={addressFormData.ciudad}
                          onChange={(e) => setAddressFormData({...addressFormData, ciudad: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Estado *</label>
                        <input
                          type="text"
                          value={addressFormData.estado}
                          onChange={(e) => setAddressFormData({...addressFormData, estado: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Código Postal *</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={addressFormData.codigoPostal}
                          onChange={(e) => setAddressFormData({...addressFormData, codigoPostal: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Teléfono *</label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={addressFormData.telefono}
                          onChange={(e) => setAddressFormData({...addressFormData, telefono: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn-save" onClick={handleAddAddress}>Usar esta dirección</button>
                      <button className="btn-cancel" onClick={() => setShowAddressForm(false)}>Cancelar</button>
                    </div>
                  </div>
                )}

                {selectedAddressId && !showAddressForm && (
                  <button className="btn-continue" onClick={() => setExpandedSection('payment')}>
                    Continuar con el pago
                  </button>
                )}
              </div>
            )}
          </section>

          {/* SECCIÓN 2: Método de pago */}
          <section className={`checkout-section ${expandedSection === 'payment' ? 'expanded' : 'collapsed'}`}>
            <div className="section-header" onClick={() => selectedAddressId && setExpandedSection(expandedSection === 'payment' ? null : 'payment')}>
              <div className="section-number">2</div>
              <div className="section-content">
                <h2>Método de pago</h2>
                {selectedPayment && expandedSection !== 'payment' && (
                  <p className="section-summary">
                    Tarjeta que termina en {selectedPayment.numeroTarjeta.slice(-4)}
                  </p>
                )}
              </div>
              {selectedPayment && expandedSection !== 'payment' && (
                <button className="btn-change" onClick={(e) => { e.stopPropagation(); setExpandedSection('payment') }}>
                  Cambiar
                </button>
              )}
            </div>

            {expandedSection === 'payment' && (
              <div className="section-body">
                {paymentMethods.length > 0 && (
                  <div className="payment-list">
                    {paymentMethods.map(payment => (
                      <label key={payment.id} className="payment-item">
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedPaymentId === payment.id}
                          onChange={() => setSelectedPaymentId(payment.id)}
                        />
                        <div className="payment-details">
                          <strong>💳 {payment.tipo === 'tarjeta' ? 'Tarjeta' : 'Otro'}</strong>
                          <p>**** **** **** {payment.numeroTarjeta.slice(-4)}</p>
                          <p>{payment.nombreTarjeta}</p>
                          <p>Expira: {payment.expiracion}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {!showPaymentForm ? (
                  <button className="btn-add-new" onClick={() => setShowPaymentForm(true)}>
                    + Agregar tarjeta de crédito o débito
                  </button>
                ) : (
                  <div className="form-add-new">
                    <h3>Agregar tarjeta</h3>
                    <div className="form-group">
                      <label>Número de tarjeta *</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={paymentFormData.numeroTarjeta}
                        onChange={(e) => setPaymentFormData({...paymentFormData, numeroTarjeta: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Nombre del titular *</label>
                      <input
                        type="text"
                        value={paymentFormData.nombreTarjeta}
                        onChange={(e) => setPaymentFormData({...paymentFormData, nombreTarjeta: e.target.value})}
                      />
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Fecha de vencimiento *</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={paymentFormData.expiracion}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4)
                            }
                            setPaymentFormData({...paymentFormData, expiracion: value})
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={3}
                          value={paymentFormData.cvv}
                          onChange={(e) => setPaymentFormData({...paymentFormData, cvv: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn-save" onClick={handleAddPayment}>Usar esta tarjeta</button>
                      <button className="btn-cancel" onClick={() => setShowPaymentForm(false)}>Cancelar</button>
                    </div>
                  </div>
                )}

                {selectedPaymentId && !showPaymentForm && (
                  <button className="btn-continue" onClick={() => setExpandedSection('review')}>
                    Continuar
                  </button>
                )}
              </div>
            )}
          </section>

          {/* SECCIÓN 3: Revisar pedido */}
          <section className={`checkout-section ${expandedSection === 'review' ? 'expanded' : 'collapsed'}`}>
            <div className="section-header" onClick={() => selectedAddressId && selectedPaymentId && setExpandedSection(expandedSection === 'review' ? null : 'review')}>
              <div className="section-number">3</div>
              <div className="section-content">
                <h2>Revisar artículos y envío</h2>
              </div>
            </div>

            {expandedSection === 'review' && (
              <div className="section-body">
                <div className="review-delivery">
                  <h3>Fecha de entrega estimada:</h3>
                  <p className="delivery-date">23 nov 2025</p>
                  <p className="delivery-note">Si realizas tu pedido en 4 horas y 20 minutos</p>
                </div>

                <div className="review-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="review-item">
                      <div className="review-item-image">
                        {item.imagen ? (
                          <img src={item.imagen} alt={item.nombre} />
                        ) : (
                          <div className="no-image">Sin imagen</div>
                        )}
                      </div>
                      <div className="review-item-details">
                        <h4>{item.nombre}</h4>
                        <p className="review-item-price">${item.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        <p className="review-item-qty">Cantidad: {item.cantidad}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn-place-order-main" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Realizar pedido y pagar'}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar de resumen */}
        <aside className="checkout-sidebar">
          <div className="order-summary-box">
            <button 
              className="btn-place-order-sidebar" 
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddressId || !selectedPaymentId}
            >
              {loading ? 'Procesando...' : 'Realizar pedido y pagar'}
            </button>

            <p className="order-summary-notice">
              Al realizar tu pedido, aceptas el <a href="#">aviso de privacidad</a> y las <a href="#">condiciones de uso</a> de Amazon.
            </p>

            <div className="order-summary-divider"></div>

            <h3>Resumen del pedido</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Productos:</span>
                <span>${getSubtotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>{getShipping() === 0 ? '$0.00' : `$${getShipping().toFixed(2)}`}</span>
              </div>
            </div>

            <div className="order-summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total (IVA incluido, en caso de ser aplicable):</span>
              <span className="total-price">${getTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
