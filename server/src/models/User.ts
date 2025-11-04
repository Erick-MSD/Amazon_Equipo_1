import { Schema, model, Document, Types } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface Address {
  calle?: string
  numero?: string
  colonia?: string
  ciudad?: string
  estado?: string
  codigoPostal?: string
  pais?: string
}

export interface IUser extends Document {
  nombre: string
  apellido?: string
  email: string
  contraseña: string
  telefono?: string
  rol: 'cliente' | 'admin'
  fechaRegistro: Date
  direcciones: Address[]
  vendedorInfo?: {
    nombreTienda?: string
    descripcion?: string
    logo?: string
    ratingPromedio?: number
  }
}

const AddressSchema = new Schema<Address>({
  calle: String,
  numero: String,
  colonia: String,
  ciudad: String,
  estado: String,
  codigoPostal: String,
  pais: String
}, { _id: false })

const UserSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  apellido: String,
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  telefono: String,
  rol: { type: String, enum: ['cliente', 'vendedor', 'admin'], default: 'cliente' },
  fechaRegistro: { type: Date, default: Date.now },
  direcciones: { type: [AddressSchema], default: [] }
  ,
  vendedorInfo: {
    nombreTienda: String,
    descripcion: String,
    logo: String,
    ratingPromedio: { type: Number, default: 0 }
  }
})

// Hash password before save
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('contraseña')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.contraseña = await bcrypt.hash(this.contraseña, salt)
    return next()
  } catch (err) {
    return next(err as any)
  }
})

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.contraseña)
}

export const User = model<IUser & { comparePassword?: (p: string) => Promise<boolean> }>('User', UserSchema)
