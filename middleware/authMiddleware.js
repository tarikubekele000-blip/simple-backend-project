const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret'

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(decoded.userId).select('-password').lean()
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email }
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = auth
