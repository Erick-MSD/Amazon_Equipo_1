import { Schema, model, Document, Types } from 'mongoose'

export interface IReview extends Document {
  usuarioId: Types.ObjectId
  productoId: Types.ObjectId
  comentario?: string
  calificacion: number
  fecha: Date
}

const ReviewSchema = new Schema<IReview>({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productoId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  comentario: String,
  calificacion: { type: Number, min: 1, max: 5, required: true },
  fecha: { type: Date, default: Date.now }
})

export const Review = model<IReview>('Review', ReviewSchema)
