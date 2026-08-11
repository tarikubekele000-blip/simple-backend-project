const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/authMiddleware')

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 }).lean()
    res.json(tasks.map((task) => ({ ...task, id: task._id.toString() })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load tasks' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id }).lean()
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.json({ ...task, id: task._id.toString() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load task' })
  }
})

router.post('/', async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id,
    })
    const createdTask = task.toObject()
    createdTask.id = createdTask._id.toString()
    res.status(201).json(createdTask)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to create task' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, 
      req.body,
      { new: true, runValidators: true }
    ).lean()

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ ...task, id: task._id.toString() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to update task' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const removed = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }).lean()
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
