import { Router } from 'express';

const router = Router();

// 🔔 Simulación temporal de base de datos
let notifications: any[] = [];

// Crear una notificación
router.post('/', (req, res) => {
  try {
    const { userId, title, message } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const newNotification = {
      id: Date.now(),
      userId,
      title,
      message,
      read: false,
      createdAt: new Date()
    };

    notifications.push(newNotification);

    return res.status(201).json({
      message: 'Notificación creada correctamente',
      notification: newNotification
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error al crear notificación', error });
  }
});

// Obtener todas las notificaciones
router.get('/', (_req, res) => {
  try {
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener notificaciones', error });
  }
});

// Marcar como leída
router.patch('/read/:id', (req, res) => {
  try {
    const { id } = req.params;

    const notification = notifications.find(n => n.id === Number(id));

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    notification.read = true;

    return res.json({
      message: 'Notificación marcada como leída',
      notification
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error al marcar como leída', error });
  }
});

export default router;
