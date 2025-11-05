import { Router } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = Router();

// ================================
// Registro Cliente
// POST /api/auth/registerCliente
// ================================
router.post('/RegistroCliente', async (req, res) => {
  try {
    const { nombre, correo, password, direccion } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'nombre, correo y password son requeridos' });
    }

    const existing = await User.findOne({ email: correo });
    if (existing) return res.status(409).json({ message: 'Correo ya registrado' });

    const user = new User({
      nombre,
      email: correo,
      contraseña: password,
      direccion,
      rol: 'cliente',
    });

    await user.save();

    const payload = { id: user._id, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    res.status(201).json({ user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }, token });
  } catch (err) {
    console.error('Error registrando cliente', err);
    res.status(500).json({ message: 'Error registrando cliente' });
  }
});

// ================================
// Registro Vendedor
// POST /api/auth/registerVendedor
// ================================
router.post('/RegistroVendedor', async (req, res) => {
  try {
    const { nombre, correo, password, nombreTienda, rfc, tipoProducto, telefono } = req.body;

    if (!nombre || !correo || !password || !nombreTienda) {
      return res.status(400).json({ message: 'nombre, correo, password y nombreTienda son requeridos' });
    }

    const existing = await User.findOne({ email: correo });
    if (existing) return res.status(409).json({ message: 'Correo ya registrado' });

    const user = new User({
      nombre,
      email: correo,
      contraseña: password,
      rol: 'vendedor',
      vendedorInfo: { nombreTienda, rfc, tipoProducto, telefono },
    });

    await user.save();

    const payload = { id: user._id, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    res.status(201).json({ user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }, token });
  } catch (err) {
    console.error('Error registrando vendedor', err);
    res.status(500).json({ message: 'Error registrando vendedor' });
  }
});

export default router;
