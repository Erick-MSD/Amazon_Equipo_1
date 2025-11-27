import { Router } from 'express'
import { Order } from '../models/Order'
import { Notification } from '../models/Notification'

const router = Router()

// Crear una orden
router.post('/', async (req, res) => {
  try {
    const nuevaOrden = new Order(req.body)
    await nuevaOrden.save()

    // Crear notificación al vendedor
    if (nuevaOrden.vendedorId) {
      await Notification.create({
        userId: nuevaOrden.vendedorId.toString(),
        title: "Nueva compra",
        body: "Has recibido una nueva orden.",
        read: false,
        meta: { orderId: nuevaOrden._id }
      })
    }

    res.status(201).json(nuevaOrden)
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear la orden', details: error })
  }
})

// Obtener órdenes por usuario
router.get('/mis-ordenes/:userId', async (req, res) => {
  try {
    const ordenes = await Order.find({ usuarioId: req.params.userId })
      .populate('productos.productoId')

    res.json(ordenes)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' })
  }
})

// Obtener orden por ID
router.get('/:id', async (req, res) => {
  try {
    const orden = await Order.findById(req.params.id)
      .populate('productos.productoId')

    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' })
    res.json(orden)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden' })
  }
})

// Actualizar estado
router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body

    const ordenActualizada = await Order.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    )

    res.json(ordenActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' })
  }
})

export default router
