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

// ================================
// Login
// POST /api/auth/login
// ================================
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (!user.comparePassword) {
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    const isMatch = await user.comparePassword(contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = { id: user._id, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    // Retornar info del usuario incluyendo nombre y rol
    res.status(200).json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        nombreTienda: user.rol === 'vendedor' ? user.vendedorInfo?.nombreTienda : undefined
      }
    });
  } catch (err) {
    console.error('Error en login', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ================================
// Actualizar Perfil de Usuario
// PATCH /api/auth/profile/:id
// ================================
router.patch('/profile/:id', async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;
    const userId = req.params.id;

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (correo) updateData.email = correo;
    if (telefono !== undefined) updateData.telefono = telefono;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ 
      _id: user._id,
      id: user._id, 
      nombre: user.nombre, 
      correo: user.email,
      telefono: user.telefono,
      email: user.email, 
      rol: user.rol 
    });
  } catch (err) {
    console.error('Error actualizando perfil', err);
    res.status(500).json({ message: 'Error actualizando perfil' });
  }
});

export default router;
