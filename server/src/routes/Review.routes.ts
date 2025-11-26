import { Router } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';

const router = Router();

// Crear una reseña
router.post('/', async (req, res) => {
  try {
    const { usuarioId, productoId, comentario, calificacion } = req.body;

    if (!usuarioId || !productoId || !calificacion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // 1️⃣ Crear la reseña
    const nuevaReview = new Review({
      usuarioId,
      productoId,
      comentario,
      calificacion
    });
    await nuevaReview.save();

    // 2️⃣ Agregar la reseña al producto
    const product = await Product.findById(productoId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    product.reseñas.push(nuevaReview._id);

    // 3️⃣ Recalcular rating
    const reviews = await Review.find({ productoId });

    const total = reviews.reduce((acc, r) => acc + r.calificacion, 0);
    const promedio = total / reviews.length;

    product.ratingPromedio = promedio;
    product.numReseñas = reviews.length;

    await product.save();

    res.status(201).json(nuevaReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reseña', details: error });
  }
});

// Obtener reseñas por producto
router.get('/producto/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ productoId: req.params.id })
      .populate('usuarioId', 'nombre apellido');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
});

export default router;
