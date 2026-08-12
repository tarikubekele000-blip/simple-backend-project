const jwt = require('jsonwebtoken')
const User = require('../models/User')
const fallbackStore = require('../utils/fallbackStore')

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret'

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    let user = null

    try {
      user = await User.findById(decoded.userId).select('-password').lean()
    } catch (error) {
      console.warn('MongoDB user lookup failed, using fallback store:', error.message)
    }

    if (!user) {
      user = fallbackStore.getUserById(decoded.userId)
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = {
      id: user._id ? user._id.toString() : user.id,
      name: user.name,
      email: user.email,
    }
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = auth
