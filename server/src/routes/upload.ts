import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { requireAuth } from '../middleware/auth'

const router = Router()

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configurar multer para guardar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// Filtrar solo imágenes JPG y PNG
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos JPG y PNG'))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
})

// POST /api/upload - Subir una imagen
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna imagen' })
    }

    // Retornar la URL relativa del archivo
    const fileUrl = `/uploads/${req.file.filename}`
    res.status(200).json({ url: fileUrl })
  } catch (err) {
    console.error('Error subiendo imagen:', err)
    res.status(500).json({ message: 'Error subiendo imagen' })
  }
})

// POST /api/upload/multiple - Subir múltiples imágenes
router.post('/multiple', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron imágenes' })
    }

    // Retornar las URLs de todos los archivos
    const urls = req.files.map(file => `/uploads/${file.filename}`)
    res.status(200).json({ urls })
  } catch (err) {
    console.error('Error subiendo imágenes:', err)
    res.status(500).json({ message: 'Error subiendo imágenes' })
  }
})

export default router
