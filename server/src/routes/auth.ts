import { Router } from 'express'
import { User } from '../models/User'
import jwt from 'jsonwebtoken'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, contraseña, telefono, rol, vendedorInfo } = req.body
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ error: 'nombre, email y contraseña son requeridos' })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email ya registrado' })

    const user = new User({ nombre, apellido, email, contraseña, telefono, rol, vendedorInfo })
    await user.save()

    // Do not return contraseña
    const payload = { id: user._id, email: user.email, rol: user.rol }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })

    res.status(201).json({ user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }, token })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Register error', err)
    res.status(500).json({ error: 'Error registering user' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body
    if (!email || !contraseña) return res.status(400).json({ error: 'email y contraseña son requeridos' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

    // @ts-ignore
    const match = await user.comparePassword(contraseña)
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' })

    const payload = { id: user._id, email: user.email, rol: user.rol }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })

    res.json({ user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }, token })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Login error', err)
    res.status(500).json({ error: 'Error during login' })
  }
})

export default router
