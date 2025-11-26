import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CartSidebar from '../components/CartSidebar'
import resolveImg from '../utils/resolveImg'

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        const base = import.meta.env.VITE_API_URL || ''
        const res = await fetch(`${base}/api/orders/${id}`)
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        console.error('Error loading order', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const markAsShipped = async () => {
    if (!order) return
    try {
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/orders/${order._id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'enviado' })
      })
      if (!res.ok) throw new Error('update failed')
      const updated = await res.json()
      setOrder(updated)
    } catch (err) {
      console.error('Error updating order', err)
      try { window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'No se pudo actualizar el pedido' } })) } catch (e) {}
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Cargando pedido...</div>
  if (!order) return <div style={{ padding: 20 }}>Pedido no encontrado</div>

  return (
    <div>
      <Header onCartOpen={() => {}} />
      <CartSidebar isOpen={false} onClose={() => {}} />
      <div style={{ maxWidth: 1000, margin: '24px auto', padding: 16 }}>
        <h1>Pedido #{String(order._id).slice(-8)}</h1>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 2 }}>
            <h3>Productos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {order.productos.map((it: any) => (
                <div key={String(it.productoId?._id || it.productoId)} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={resolveImg(it.productoId?.imagenes?.[0] || undefined)} alt={it.productoId?.nombre || 'Producto'} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{it.productoId?.nombre || 'Producto'}</div>
                    <div>{it.cantidad} x ${it.precioUnitario?.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Detalles</h3>
            <div><strong>Cliente:</strong> {order.usuarioId?.nombre || order.usuarioId?.correo}</div>
            <div><strong>Estado:</strong> {order.estado}</div>
            <div><strong>Fecha:</strong> {new Date(order.fechaPedido).toLocaleString('es-MX')}</div>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>Volver</button>
              {order.estado === 'pendiente' && (<button onClick={markAsShipped} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '8px 10px' }}>Marcar como enviado</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
