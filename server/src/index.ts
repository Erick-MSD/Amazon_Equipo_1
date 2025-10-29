import express from 'express'
import dotenv from 'dotenv'
import productsRouter from './routes/products'

dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT || 4000

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productsRouter)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`)
})
