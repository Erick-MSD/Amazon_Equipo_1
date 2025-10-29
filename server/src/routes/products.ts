import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.json([
    { id: 'p1', title: 'Producto de ejemplo', price: 9.99 }
  ])
})

export default router
