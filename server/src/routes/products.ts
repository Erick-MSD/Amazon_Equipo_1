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

// PUT /api/products/:id (solo vendedores pueden editar sus propios productos)
router.put('/:id', requireAuth, requireRole('vendedor'), async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, precio, stock, imagenes, categoria, porcentajeDescuento, fechaInicioDescuento, fechaFinDescuento } = req.body
    
    console.log('✏️ Editando producto:', id, req.body)
    
    const payload = (req as any).user
    const vendedorId = payload?.id

    if (!vendedorId) {
      return res.status(401).json({ message: 'Usuario no autenticado' })
    }

    // Buscar producto y verificar propiedad
    const product = await Product.findById(id)
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    if (product.vendedorId.toString() !== vendedorId) {
      return res.status(403).json({ message: 'No tienes permiso para editar este producto' })
    }

    // Actualizar campos básicos
    if (nombre) product.nombre = nombre
    if (descripcion !== undefined) product.descripcion = descripcion
    if (stock !== undefined) product.stock = Number(stock)
    if (categoria !== undefined) product.categoria = categoria
    if (Array.isArray(imagenes)) product.imagenes = imagenes

    // Manejo de descuento
    if (porcentajeDescuento !== undefined && porcentajeDescuento > 0) {
      // Si se está aplicando un descuento
      if (!product.precioOriginal) {
        product.precioOriginal = product.precio
      }
      
      const porcentaje = Math.min(100, Math.max(0, Number(porcentajeDescuento)))
      const precioConDescuento = product.precioOriginal * (1 - porcentaje / 100)
      
      product.precio = precioConDescuento
      product.descuento = {
        porcentaje,
        fechaInicio: fechaInicioDescuento ? new Date(fechaInicioDescuento) : new Date(),
        fechaFin: fechaFinDescuento ? new Date(fechaFinDescuento) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días por defecto
        activo: true
      }
    } else if (porcentajeDescuento === 0 || porcentajeDescuento === null) {
      // Si se está quitando el descuento
      if (product.precioOriginal) {
        product.precio = product.precioOriginal
        product.precioOriginal = undefined
      }
      product.descuento = undefined
    } else if (precio !== undefined) {
      // Cambio de precio sin descuento
      product.precio = Number(precio)
      if (product.descuento) {
        product.descuento = undefined
        product.precioOriginal = undefined
      }
    }

    await product.save()
    console.log('✅ Producto actualizado:', product._id)
    res.json(product)
  } catch (err) {
    console.error('❌ Error updating product:', err)
    res.status(500).json({ message: 'Error actualizando producto', error: String(err) })
  }
})

export default router

