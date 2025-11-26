import { Schema, model, Document, Types } from 'mongoose'

export interface IProduct extends Document {
  nombre: string
  descripcion?: string
  precio: number
  precioOriginal?: number
  descuento?: {
    porcentaje: number
    fechaInicio: Date
    fechaFin: Date
    activo: boolean
  }
  stock: number
  imagenes: string[]
  categoria?: string
  vendedorId: Types.ObjectId
  reseñas: Types.ObjectId[]
  fechaCreacion: Date
  ratingPromedio?: number
  numReseñas?: number
}

const ProductSchema = new Schema<IProduct>({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true, default: 0 },
  precioOriginal: { type: Number },
  descuento: {
    porcentaje: { type: Number, min: 0, max: 100 },
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    activo: { type: Boolean, default: false }
  },
  stock: { type: Number, required: true, default: 0 },
  imagenes: { type: [String], default: [] },
  categoria: { type: String },
  vendedorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reseñas: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  fechaCreacion: { type: Date, default: Date.now },
  ratingPromedio: { type: Number, default: 0 },
  numReseñas: { type: Number, default: 0 }
}, { timestamps: true })

export const Product = model<IProduct>('Product', ProductSchema)
