import { Schema, model, Document, Types } from 'mongoose'

export interface IPayment extends Document {
  pedidoId: Types.ObjectId
  usuarioId: Types.ObjectId
  metodoPago?: string
  monto: number
  estado: 'pendiente' | 'pagado' | 'fallido'
  fechaPago: Date
}

const PaymentSchema = new Schema<IPayment>({
  pedidoId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  metodoPago: String,
  monto: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'pagado', 'fallido'], default: 'pendiente' },
  fechaPago: { type: Date, default: Date.now }
})

export const Payment = model<IPayment>('Payment', PaymentSchema)
