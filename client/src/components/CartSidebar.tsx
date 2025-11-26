import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/CartSidebar.css'

interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Cargar items del carrito desde localStorage
    const loadCart = () => {
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        try {
          setCartItems(JSON.parse(cartData))
        } catch (err) {
          console.error('Error parsing cart:', err)
        }
      }
    }

    if (isOpen) {
      loadCart()
    }
    // Also listen to cartUpdated events so sidebar reflects changes in real-time
    const onCartUpdated = () => loadCart()
    window.addEventListener('cartUpdated', onCartUpdated)

    return () => {
      window.removeEventListener('cartUpdated', onCartUpdated)
    }
  }, [isOpen])

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, cantidad: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-sidebar-header">
          <h2>Carrito de compras</h2>
          <button onClick={onClose} className="cart-close-btn">✕</button>
        </div>

        {/* Items */}
        <div className="cart-sidebar-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu Carrito está vacío</p>
              <Link to="/search" onClick={onClose} className="cart-shop-link">
                Ir a comprar
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} />
                      ) : (
                        <div className="cart-item-no-image">Sin imagen</div>
                      )}
                    </div>
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.nombre}</h4>
                      <p className="cart-item-price">
                        ${item.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="cart-item-quantity">
                        <button 
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="qty-btn"
                        >
                          −
                        </button>
                        <span className="qty-value">{item.cantidad}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="cart-item-remove"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal ({getTotalItems()} artículos):</span>
                  <span className="cart-summary-price">
                    ${getTotalPrice().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Link to="/checkout" className="cart-checkout-btn" onClick={onClose}>
                  Proceder al pago
                </Link>
                <button onClick={clearCart} className="cart-clear-btn">
                  Vaciar Carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CartSidebar
