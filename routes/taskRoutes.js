const express = require('express')
const auth = require('../middleware/authMiddleware')
const fallbackStore = require('../utils/fallbackStore')

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const tasks = fallbackStore.listTasksForUser(req.user.id)
    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load tasks' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const task = fallbackStore.getTaskById(req.params.id, req.user.id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.json(task)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load task' })
  }
})

router.post('/', async (req, res) => {
  try {
    const task = fallbackStore.createTask({
      ...req.body,
      user: req.user.id,
    })
    res.status(201).json(task)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to create task' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const task = fallbackStore.updateTask(req.params.id, req.user.id, req.body)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to update task' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const removed = fallbackStore.deleteTask(req.params.id, req.user.id)
    if (!removed) {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.json({ message: 'Task deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to delete task' })
  }
})

module.exports = router
