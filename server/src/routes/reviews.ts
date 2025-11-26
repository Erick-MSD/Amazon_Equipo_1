import { Router } from 'express'
import { echoDotReviews } from '../models/EchoDotReviews'

const router = Router()

// Get reviews for Echo Dot
router.get('/products/echo-dot/reviews', (req, res) => {
  const totalReviews = 63237
  const ratingBreakdown = {
    5: 45234,
    4: 12456,
    3: 3421,
    2: 1234,
    1: 892
  }
  
  const averageRating = (5*ratingBreakdown[5] + 4*ratingBreakdown[4] + 3*ratingBreakdown[3] + 2*ratingBreakdown[2] + 1*ratingBreakdown[1]) / totalReviews

  const response = {
    productId: 'echo-dot',
    averageRating,
    totalReviews,
    ratingBreakdown,
    reviews: echoDotReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  res.json(response)
})

// Add review for Echo Dot
router.post('/products/echo-dot/reviews', (req, res) => {
  const { userId, userName, rating, title, comment } = req.body

  if (!userId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid review data' })
  }

  const newReview = {
    id: Date.now().toString(),
    userId,
    userName: userName || 'Usuario Anónimo',
    rating,
    title: title || '',
    comment: comment || '',
    date: new Date().toISOString(),
    verified: Math.random() > 0.3,
    helpful: 0
  }

  echoDotReviews.unshift(newReview)
  res.json({ success: true, review: newReview })
})

export default router