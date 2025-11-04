import { Schema, model, Document, Types } from 'mongoose'

export interface IOrderItem {
  productoId: Types.ObjectId
  cantidad: number
  precioUnitario: number
}

export interface IAddress {
  calle?: string
  numero?: string
  colonia?: string
  ciudad?: string
  estado?: string
  codigoPostal?: string
  pais?: string
}

export interface IOrder extends Document {
  usuarioId: Types.ObjectId
  productos: IOrderItem[]
  direccionEnvio: IAddress
  total: number
  metodoPago?: string
  estado: 'pendiente' | 'enviado' | 'entregado' | 'cancelado'
  fechaPedido: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productoId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number, required: true }
}, { _id: false })

const AddressSchema = new Schema<IAddress>({
  calle: String,
  numero: String,
  colonia: String,
  ciudad: String,
  estado: String,
  codigoPostal: String,
  pais: String
}, { _id: false })

const OrderSchema = new Schema<IOrder>({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productos: { type: [OrderItemSchema], required: true },
  direccionEnvio: { type: AddressSchema, required: true },
  total: { type: Number, required: true },
  metodoPago: String,
  estado: { type: String, enum: ['pendiente', 'enviado', 'entregado', 'cancelado'], default: 'pendiente' },
  fechaPedido: { type: Date, default: Date.now }
})

export const Order = model<IOrder>('Order', OrderSchema)
