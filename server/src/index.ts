import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import productsRouter from './routes/products'
import authRouter from './routes/auth'
import orderRoutes from './routes/Order.routes'
import reviewRoutes from './routes/Review.routes'
import notificationRoutes from './routes/Notification.routes'
import { connectDB } from './db'
import fs from 'fs'

const envPath = path.resolve(__dirname, '..', '.env')
dotenv.config({ path: envPath })

const port = process.env.PORT || 4000

async function start() {
  try {
    await connectDB()
  } catch (err) {
    console.error('Failed to connect to database:', err)
    process.exit(1)
  }

  const app = express()

  app.use(cors({ origin: true }))
  app.use(express.json())

  // Ruta de prueba para ver si el backend está vivo
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  // Rutas principales
  app.use('/api/auth', authRouter)
  app.use('/api/products', productsRouter)
  app.use('/api/orders', orderRoutes)
  app.use('/api/reviews', reviewRoutes)
  app.use('/api/notifications', notificationRoutes)

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

start()
