import mongoose from 'mongoose'

/**
 * Connect to MongoDB using Mongoose.
 * Reads URI from process.env.MONGODB_URI unless `uri` is provided.
 */
export async function connectDB(uri?: string) {
  const mongoUri = uri || process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Please set it in .env or pass it as an argument.')
  }

  // Optional stable API options — cast to any because Mongoose types don't include serverApi
  // Build options passed to mongoose.connect. Include serverApi and optional dbName.
  const clientOptions: any = {
    serverApi: { version: '1', strict: true, deprecationErrors: true }
  }

  // If MONGODB_DB is specified, set it so the driver connects to that database name
  const dbName = process.env.MONGODB_DB || 'Amazon'
  if (dbName) clientOptions.dbName = dbName

  await mongoose.connect(mongoUri, clientOptions)

  // Ping the server to ensure the connection is healthy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (mongoose.connection.db as any).admin().command({ ping: 1 })
  console.log('Pinged your deployment. Successfully connected to MongoDB!')
}
