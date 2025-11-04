import { Router } from 'express'
import { Product } from '../models/Product'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

// GET /api/products
// Returns a paginated list of products (simple)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10))
    const limit = Math.max(1, parseInt((req.query.limit as string) || '20', 10))
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments()
    ])

    res.json({ page, limit, total, items })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error listing products', err)
    res.status(500).json({ error: 'Error listing products' })
  }
})

// POST /api/products
// Create a new product (only vendedores)
router.post('/', requireAuth, requireRole('vendedor'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagenes, categoriaId, vendedorId } = req.body
    if (!nombre || typeof precio === 'undefined') {
      return res.status(400).json({ error: 'nombre and precio are required' })
    }

    // Assign vendedorId from token if not provided
    const payload = (req as any).user
    const vendorId = vendedorId || payload?.id

    const product = new Product({
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock) || 0,
      imagenes: Array.isArray(imagenes) ? imagenes : [],
      categoria: categoriaId || undefined,
      vendedorId: vendorId
    })

    await product.save()
    res.status(201).json(product)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating product', err)
    res.status(500).json({ error: 'Error creating product' })
  }
})

export default router
