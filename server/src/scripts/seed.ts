import { connectDB } from '../db'
import dotenv from 'dotenv'
import path from 'path'
import { User, Product, Category, Review, Cart, Order, Payment } from '../models'
import mongoose from 'mongoose'

async function seed() {
  // load .env from server folder
  const envPath = path.resolve(__dirname, '..', '..', '.env')
  dotenv.config({ path: envPath })

  await connectDB()

  try {
    console.log('Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Payment.deleteMany({})
    ])

    console.log('Creating categories...')
    const categories = await Category.create([
      { nombre: 'Electrónica', descripcion: 'Aparatos y gadgets' },
      { nombre: 'Libros', descripcion: 'Libros y ebooks' },
      { nombre: 'Ropa', descripcion: 'Prendas y accesorios' }
    ])

    console.log('Creating users (seller and customer)...')
    const seller = await User.create({
      nombre: 'Tienda',
      apellido: 'Vendedor',
      email: 'seller@example.com',
      contraseña: 'sellerpass',
      rol: 'vendedor',
      vendedorInfo: { nombreTienda: 'Tienda Demo', descripcion: 'Vendedor de prueba' }
    })

    const customer = await User.create({
      nombre: 'Cliente',
      apellido: 'Demo',
      email: 'cliente@example.com',
      contraseña: 'clientpass',
      rol: 'cliente'
    })

    console.log('Creating products...')
    const products = await Product.create([
      {
        nombre: 'Auriculares Bluetooth',
        descripcion: 'Auriculares con cancelación de ruido',
        precio: 49.99,
        stock: 100,
        imagenes: [],
        categoria: 'Electrónica',
        vendedorId: seller._id
      },
      {
        nombre: 'Camiseta Deportiva',
        descripcion: 'Camiseta transpirable',
        precio: 19.99,
        stock: 200,
        imagenes: [],
        categoria: 'Ropa',
        vendedorId: seller._id
      }
    ])

    console.log('Creating a review...')
    const review = await Review.create({
      usuarioId: customer._id,
      productoId: products[0]._id,
      comentario: 'Muy buenos auriculares',
      calificacion: 5
    })

    // Link review to product
    products[0].reseñas.push(review._id)
    products[0].numReseñas = (products[0].numReseñas || 0) + 1
    products[0].ratingPromedio = ((products[0].ratingPromedio || 0) * (products[0].numReseñas - 1) + review.calificacion) / products[0].numReseñas
    await products[0].save()

    console.log('Creating cart for customer...')
    await Cart.create({ usuarioId: customer._id, productos: [{ productoId: products[1]._id, cantidad: 2 }] })

    console.log('Creating order and payment...')
    const order = await Order.create({
      usuarioId: customer._id,
      productos: [
        { productoId: products[1]._id, cantidad: 2, precioUnitario: products[1].precio }
      ],
      direccionEnvio: {
        calle: 'Av. Demo', numero: '123', colonia: 'Centro', ciudad: 'Ciudad', estado: 'Estado', codigoPostal: '00000', pais: 'Pais'
      },
      total: products[1].precio * 2,
      metodoPago: 'efectivo',
      estado: 'pendiente'
    })

    await Payment.create({ pedidoId: order._id, usuarioId: customer._id, metodoPago: 'efectivo', monto: order.total, estado: 'pendiente' })

    console.log('Seeding completed successfully')
  } catch (err) {
    console.error('Seeding error', err)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()
