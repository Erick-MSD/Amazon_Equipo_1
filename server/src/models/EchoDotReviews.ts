export interface EchoDotReview {
  id: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
}

export const echoDotReviews: EchoDotReview[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Carlos M.',
    rating: 5,
    title: 'Excelente calidad de sonido',
    comment: 'El Echo Dot superó mis expectativas. El sonido es mucho mejor que la generación anterior y Alexa responde muy rápido. Perfecto para mi sala.',
    date: '2024-12-10T10:30:00Z',
    verified: true,
    helpful: 45
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Ana L.',
    rating: 4,
    title: 'Muy bueno, pero podría mejorar',
    comment: 'Me gusta mucho, el sonido es claro y Alexa funciona bien. Solo que a veces no entiende bien cuando hay ruido de fondo.',
    date: '2024-12-08T14:20:00Z',
    verified: true,
    helpful: 23
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Miguel R.',
    rating: 5,
    title: 'Perfecto para casa inteligente',
    comment: 'Lo uso para controlar todas mis luces y dispositivos. Funciona perfecto y el diseño se ve muy bien en cualquier lugar.',
    date: '2024-12-05T09:15:00Z',
    verified: true,
    helpful: 67
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Laura S.',
    rating: 3,
    title: 'Cumple pero sin más',
    comment: 'Está bien para el precio, pero esperaba un poco más de graves. Para música casual está bien.',
    date: '2024-12-03T16:45:00Z',
    verified: false,
    helpful: 12
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Roberto P.',
    rating: 5,
    title: 'Increíble por el precio',
    comment: 'No puedo creer la calidad que tiene por este precio. Lo recomiendo 100%. Alexa es muy útil para rutinas diarias.',
    date: '2024-12-01T11:30:00Z',
    verified: true,
    helpful: 89
  }
]