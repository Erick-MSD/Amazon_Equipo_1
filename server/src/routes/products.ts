import { Router } from 'express'
import { Product } from '../models/Product'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()


router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10))
    const limit = Math.max(1, parseInt((req.query.limit as string) || '20', 10))
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments()
    ])

    res.json({ page, limit, total, items })
  } catch (err) {
    console.error('Error listando productos', err)
    res.status(500).json({ message: 'Error listando productos' })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'reseñas',
        populate: {
          path: 'usuarioId',
          select: 'nombre apellido'
        }
      })
      .lean()

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json(product)
  } catch (err) {
    console.error('Error obteniendo producto', err)
    res.status(500).json({ message: 'Error obteniendo producto' })
  }
})


router.post('/', requireAuth, requireRole('vendedor'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagenes, categoriaId } = req.body
    if (!nombre || typeof precio === 'undefined') {
      return res.status(400).json({ message: 'nombre y precio son requeridos' })
    }

    const payload = (req as any).user
    const vendedorId = payload?.id

    const product = new Product({
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock) || 0,
      imagenes: Array.isArray(imagenes) ? imagenes : [],
      categoria: categoriaId || undefined,
      vendedorId
    })

    await product.save()
    res.status(201).json(product)
  } catch (err) {
    console.error('Error creando producto', err)
    res.status(500).json({ message: 'Error creando producto' })
  }
})

export default router
