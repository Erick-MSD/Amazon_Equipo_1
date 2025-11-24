import { Router } from 'express'
import { Product } from '../models/Product'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

// GET /api/products
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
    console.error('Error listing products', err)
    res.status(500).json({ message: 'Error listando productos' })
  }
})

// POST /api/products (solo vendedores)
router.post('/', requireAuth, requireRole('vendedor'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagenes, categoriaId } = req.body
    
    console.log('📦 Creando producto:', { nombre, precio, stock, imagenes })
    
    if (!nombre || typeof precio === 'undefined') {
      return res.status(400).json({ message: 'nombre y precio son requeridos' })
    }

    const payload = (req as any).user
    const vendedorId = payload?.id

    if (!vendedorId) {
      return res.status(401).json({ message: 'Usuario no autenticado' })
    }

    const product = new Product({
      nombre,
      descripcion: descripcion || '',
      precio: Number(precio),
      stock: Number(stock) || 0,
      imagenes: Array.isArray(imagenes) ? imagenes : [],
      categoria: categoriaId || undefined,
      vendedorId
    })

    await product.save()
    console.log('✅ Producto creado:', product._id)
    res.status(201).json(product)
  } catch (err) {
    console.error('❌ Error creating product:', err)
    res.status(500).json({ message: 'Error creando producto', error: String(err) })
  }
})

export default router

