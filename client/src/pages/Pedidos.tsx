import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CartSidebar from '../components/CartSidebar'

const Pedidos: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'pendiente' | 'enviado' | 'all'>('pendiente')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) { setOrders([]); setLoading(false); return }
        const user = JSON.parse(userStr)
        const vendedorId = user.id
        const base = import.meta.env.VITE_API_URL || ''
        const statusParam = tab === 'all' ? '' : `?status=${tab}&limit=200`
        const res = await fetch(`${base}/api/orders/seller/${vendedorId}${statusParam}`)
        if (!res.ok) throw new Error('fetch failed')
        const body = await res.json()
        setOrders(Array.isArray(body.items) ? body.items : [])
      } catch (err) {
        console.error('Error fetching orders', err)
        setError('No se pudieron cargar los pedidos')
      } finally { setLoading(false) }
    }
    fetchOrders()
  }, [tab])

  const markAsShipped = async (id: string) => {
    try {
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'enviado' }) })
      if (!res.ok) throw new Error('update failed')
      const updated = await res.json()
      setOrders(prev => prev.map(o => (o._id === updated._id ? updated : o)))
    } catch (err) {
      console.error('Error updating order', err)
      try { window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'No se pudo actualizar el pedido' } })) } catch (e) {}
    }
  }

  const filtered = orders.filter(o => {
    if (!query) return true
    const q = query.toLowerCase()
    const idMatch = String(o._id).toLowerCase().includes(q)
    const client = (o.usuarioId?.nombre || o.usuarioId?.correo || '').toLowerCase()
    const clientMatch = client.includes(q)
    return idMatch || clientMatch
  })

  return (
    <div>
      <Header onCartOpen={() => {}} />
      <CartSidebar isOpen={false} onClose={() => {}} />
      <div style={{ maxWidth: 1100, margin: '24px auto', padding: 16 }}>
        <h1>Pedidos</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`tab-btn ${tab === 'pendiente' ? 'active' : ''}`} onClick={() => setTab('pendiente')}>Pendientes</button>
            <button className={`tab-btn ${tab === 'enviado' ? 'active' : ''}`} onClick={() => setTab('enviado')}>Enviados</button>
            <button className={`tab-btn ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Todos</button>
          </div>
          <div>
            <input type="search" placeholder="Buscar por id o cliente" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', minWidth: 260 }} />
          </div>
        </div>

        {loading ? (<p>Cargando pedidos...</p>) : error ? (<p>{error}</p>) : filtered.length === 0 ? (<p>No se encontraron pedidos</p>) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(o => (
              <div key={o._id} style={{ border: '1px solid #eee', padding: 10, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Pedido #{String(o._id).slice(-6)}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>{o.usuarioId?.nombre || o.usuarioId?.correo || 'Cliente anónimo'} • {new Date(o.fechaPedido).toLocaleString('es-MX')}</div>
                  <div style={{ marginTop: 6 }}>{(o.productos || []).map((it: any, idx: number) => (<span key={idx} style={{ display: 'inline-block', marginRight: 8 }}>{it.productoId?.nombre ? `${it.productoId.nombre} x${it.cantidad}` : `Producto ${String(it.productoId).slice(-4)} x${it.cantidad}`}</span>))}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate(`/order/${o._id}`)} style={{ padding: '8px 10px' }}>Ver</button>
                  {o.estado === 'pendiente' && <button onClick={() => markAsShipped(o._id)} style={{ padding: '8px 10px', background: '#10B981', color: '#fff', border: 'none', borderRadius: 4 }}>Marcar como enviado</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Pedidos
