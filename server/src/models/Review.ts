import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  usuarioId: Types.ObjectId;
  productoId: Types.ObjectId;
  comentario?: string;
  calificacion: number;
  fecha: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productoId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    comentario: { type: String, default: '' },
    calificacion: { type: Number, required: true, min: 1, max: 5 },
    fecha: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Review = model<IReview>('Review', ReviewSchema);
