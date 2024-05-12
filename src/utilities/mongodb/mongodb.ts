import mongoose from 'mongoose'

export const connectMongoDB = async (): Promise<void> => {
  await mongoose.connect('mongodb://root:verysecret@127.0.0.1:27017/')
}
