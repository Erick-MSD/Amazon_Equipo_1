import { Schema, model, Document } from 'mongoose'

export interface ICategory extends Document {
  nombre: string
  descripcion?: string
  imagen?: string
}

const CategorySchema = new Schema<ICategory>({
  nombre: { type: String, required: true },
  descripcion: String,
  imagen: String
})

export const Category = model<ICategory>('Category', CategorySchema)
