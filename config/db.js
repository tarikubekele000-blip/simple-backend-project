const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    console.warn('MONGO_URI is not set. Using local fallback storage.')
    return
  }

  try {
    const mongoose = require('mongoose')
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.warn('MongoDB connection failed, using local fallback storage:', error.message)
  }
}

module.exports = connectDB
