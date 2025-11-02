import { Schema, model, Document, Types } from 'mongoose'

export interface ICartItem {
  productoId: Types.ObjectId
  cantidad: number
}

export interface ICart extends Document {
  usuarioId: Types.ObjectId
  productos: ICartItem[]
  fechaActualizacion: Date
}

const CartItemSchema = new Schema<ICartItem>({
  productoId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  cantidad: { type: Number, required: true, default: 1 }
}, { _id: false })

const CartSchema = new Schema<ICart>({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  productos: { type: [CartItemSchema], default: [] },
  fechaActualizacion: { type: Date, default: Date.now }
})

export const Cart = model<ICart>('Cart', CartSchema)
