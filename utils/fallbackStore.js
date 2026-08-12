const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const STORE_FILE = path.resolve(__dirname, '../data/fallback-store.json')

const loadStoreFromDisk = () => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf8')
      const parsed = JSON.parse(raw)
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      }
    }
  } catch (error) {
    console.warn('Unable to read fallback store file, starting fresh:', error.message)
  }

  return { users: [], tasks: [] }
}

const persistStore = () => {
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true })
    fs.writeFileSync(STORE_FILE, JSON.stringify(getStore(), null, 2))
  } catch (error) {
    console.warn('Unable to persist fallback store:', error.message)
  }
}

const getStore = () => {
  if (!global.__taskflowFallbackStore) {
    global.__taskflowFallbackStore = loadStoreFromDisk()
  }
  return global.__taskflowFallbackStore
}

const createId = () => crypto.randomUUID()

const normalizeEmail = (email = '') => email.toLowerCase().trim()

const serializeUser = (user) => ({
  ...user,
  id: user.id || user._id,
  _id: user._id || user.id,
})

const serializeTask = (task) => ({
  ...task,
  id: task.id || task._id,
  _id: task._id || task.id,
})

const findUserByEmail = (email) => {
  const store = getStore()
  return store.users.find((user) => user.email === normalizeEmail(email)) || null
}

const getUserById = (userId) => {
  const store = getStore()
  return store.users.find((user) => user._id === userId || user.id === userId) || null
}

const createUser = (payload) => {
  const store = getStore()
  const id = createId()
  const user = serializeUser({
    _id: id,
    id,
    name: payload.name,
    email: normalizeEmail(payload.email),
    password: payload.password,
    createdAt: new Date().toISOString(),
  })
  store.users.push(user)
  persistStore()
  return user
}

const updateUser = (userId, updates) => {
  const store = getStore()
  const user = store.users.find((entry) => entry._id === userId || entry.id === userId)
  if (!user) return null

  Object.assign(user, updates)
  persistStore()
  return serializeUser(user)
}

const listTasksForUser = (userId) => {
  const store = getStore()
  return store.tasks
    .filter((task) => task.user === userId)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map(serializeTask)
}

const getTaskById = (taskId, userId) => {
  const store = getStore()
  const task = store.tasks.find((entry) => entry._id === taskId && entry.user === userId)
  return task ? serializeTask(task) : null
}

const createTask = (payload) => {
  const store = getStore()
  const id = createId()
  const task = serializeTask({
    _id: id,
    id,
    ...payload,
    createdAt: new Date().toISOString().slice(0, 10),
  })
  store.tasks.push(task)
  persistStore()
  return task
}

const updateTask = (taskId, userId, updates) => {
  const store = getStore()
  const task = store.tasks.find((entry) => entry._id === taskId && entry.user === userId)
  if (!task) return null

  Object.assign(task, updates)
  persistStore()
  return serializeTask(task)
}

const deleteTask = (taskId, userId) => {
  const store = getStore()
  const index = store.tasks.findIndex((entry) => entry._id === taskId && entry.user === userId)
  if (index === -1) return null

  const [removed] = store.tasks.splice(index, 1)
  persistStore()
  return serializeTask(removed)
}

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
  listTasksForUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
