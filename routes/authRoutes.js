const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authMiddleware')
const { isEmailValid, isPasswordStrong, isNameValid } = require('../utils/backendValidators')
const fallbackStore = require('../utils/fallbackStore')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret'

const createToken = (user) => jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' })

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    if (!isNameValid(name)) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' })
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' })
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain letters and numbers' })
    }

    const existingUser = fallbackStore.findUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = fallbackStore.createUser({ name, email, password: hashedPassword })
    const token = createToken(user)

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to register user' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' })
    }

    const user = fallbackStore.findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user)
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to login user' })
  }
})

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user })
})

router.put('/me', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingUser = fallbackStore.getUserById(req.user.id)
    if (!existingUser) return res.status(404).json({ message: 'User not found' })

    if (email && email !== existingUser.email) {
      const exists = fallbackStore.findUserByEmail(email)
      if (exists) return res.status(409).json({ message: 'Email already in use' })
      existingUser.email = email
    }

    if (name) existingUser.name = name
    if (password) existingUser.password = await bcrypt.hash(password, 10)

    const updatedUser = fallbackStore.updateUser(req.user.id, existingUser)

    res.json({ user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

module.exports = router
