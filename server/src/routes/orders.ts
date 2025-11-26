import { Router } from 'express'
import { Order } from '../models/Order'
import { Product } from '../models/Product'

const router = Router()

// GET /api/orders/seller/:sellerId?status=pendiente&limit=20
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params
    const { status, limit } = req.query
    // Find products for this seller
    const prods = await Product.find({ vendedorId: sellerId }).select('_id').lean()
    const prodIds = prods.map(p => p._id)

    const query: any = { 'productos.productoId': { $in: prodIds } }
    if (status) query.estado = status

    const lim = parseInt((limit as string) || '20', 10)
    const orders = await Order.find(query)
      .populate('usuarioId', 'nombre correo')
      .populate({ path: 'productos.productoId', select: 'nombre imagenes precio' })
      .sort({ fechaPedido: -1 })
      .limit(Math.max(1, Math.min(100, lim)))
      .lean()

    res.json({ items: orders })
  } catch (err) {
    console.error('Error fetching seller orders', err)
    res.status(500).json({ error: 'failed' })
  }
})

// PATCH /api/orders/:id/status { estado: 'enviado' }
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body
    if (!estado) return res.status(400).json({ error: 'missing estado' })
    const order = await Order.findByIdAndUpdate(id, { estado }, { new: true })
      .populate('usuarioId', 'nombre correo')
    if (!order) return res.status(404).json({ error: 'not found' })
    res.json(order)
  } catch (err) {
    console.error('Error updating order status', err)
    res.status(500).json({ error: 'failed' })
  }
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)
      .populate('usuarioId', 'nombre correo direccion')
      .populate({ path: 'productos.productoId', select: 'nombre imagenes precio vendedorId' })
      .lean()
    if (!order) return res.status(404).json({ error: 'not found' })
    res.json(order)
  } catch (err) {
    console.error('Error fetching order', err)
    res.status(500).json({ error: 'failed' })
  }
})

// POST /api/orders  (create a new order)
router.post('/', async (req, res) => {
  try {
    const { usuarioId, productos, direccionEnvio, total, metodoPago } = req.body
    if (!usuarioId || !Array.isArray(productos) || productos.length === 0 || !direccionEnvio || !total) {
      return res.status(400).json({ error: 'missing fields' })
    }
    const order = await Order.create({ usuarioId, productos, direccionEnvio, total, metodoPago, estado: 'pendiente' })
    const populated = await Order.findById(order._id)
      .populate('usuarioId', 'nombre correo')
      .populate({ path: 'productos.productoId', select: 'nombre imagenes precio vendedorId' })
      .lean()
    res.status(201).json(populated)
  } catch (err) {
    console.error('Error creating order', err)
    res.status(500).json({ error: 'failed' })
  }
})

export default router
