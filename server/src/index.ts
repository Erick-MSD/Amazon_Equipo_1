import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import productsRouter from './routes/products'
import authRouter from './routes/auth'
import reviewsRouter from './routes/reviews'
import { connectDB } from './db'
import fs from 'fs'

// Ensure dotenv reads the .env file located in the server folder (not necessarily process.cwd())
const envPath = path.resolve(__dirname, '..', '.env')
dotenv.config({ path: envPath })

const port = process.env.PORT || 4000

async function start() {
  try {
    // Diagnostic logs to help debug dotenv issues
    console.log('Using env file path:', envPath)
    console.log('.env exists:', fs.existsSync(envPath))
    console.log('MONGODB_URI present in process.env:', !!process.env.MONGODB_URI)

    // Connect to DB first. Will throw if MONGODB_URI is not set or connection fails.
    await connectDB()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to database:', err)
    process.exit(1)
  }

  const app = express()
  // Enable CORS for local development. Adjust origin in production.
  app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/auth', authRouter)

  app.use('/api/products', productsRouter)

  app.use('/api', reviewsRouter)

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`)
  })
}

start()
