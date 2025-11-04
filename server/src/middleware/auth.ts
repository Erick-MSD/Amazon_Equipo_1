import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  id: string
  email: string
  rol: string
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' })
  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as AuthPayload
    ;(req as any).user = payload
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthPayload | undefined
    if (!user) return res.status(401).json({ error: 'Missing auth' })
    if (user.rol !== role) return res.status(403).json({ error: 'Insufficient role' })
    return next()
  }
}
