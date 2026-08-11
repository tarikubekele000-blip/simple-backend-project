import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchTasks, createTask as createTaskApi, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from '../utils/api'

const TaskContext = createContext()

const getToday = () => new Date().toISOString().slice(0, 10)

export const TaskProvider = ({ children }) => {
  const { auth } = useAuth()
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortBy, setSortBy] = useState('dueDate')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [xpPoints, setXpPoints] = useState(60)
  const [streakDays, setStreakDays] = useState(3)
  const [feedbackMessage, setFeedbackMessage] = useState('Great job! Keep going!')
  const [lastCompletedDate, setLastCompletedDate] = useState(getToday())
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!auth?.token) {
      setTasks([])
      setSelectedTaskId(null)
      return
    }

    const loadTasks = async () => {
      setLoadingTasks(true)
      setError('')

      try {
        const data = await fetchTasks(auth.token)
        setTasks(data)
        setSelectedTaskId(data[0]?.id || null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingTasks(false)
      }
    }

    loadTasks()
  }, [auth?.token])

  const addTask = async (task) => {
    if (!auth?.token) return

    const newTask = await createTaskApi(task, auth.token)
    setTasks((prev) => [newTask, ...prev])
    setSelectedTaskId(newTask.id)
  }

  const updateTask = async (task) => {
    if (!auth?.token) return

    const updated = await updateTaskApi(task.id, task, auth.token)
    setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    if (updated.status === 'Completed') {
      handleTaskCompletion(updated)
    }
  }

  const deleteTask = async (id) => {
    if (!auth?.token) return

    await deleteTaskApi(id, auth.token)
    setTasks((prev) => prev.filter((task) => task.id !== id))
    if (selectedTaskId === id) {
      setSelectedTaskId(null)
    }
  }

  const handleTaskCompletion = (task) => {
    if (!task || task.status !== 'Completed') return

    const today = getToday()
    const xpEarned = task.priority === 'High' ? 30 : task.priority === 'Medium' ? 20 : 10

    setXpPoints((prev) => prev + xpEarned)
    setFeedbackMessage(`Great job! Keep going! You earned ${xpEarned} XP!`)

    if (lastCompletedDate !== today) {
      setStreakDays((prev) => prev + 1)
      setLastCompletedDate(today)
    }
  }

  const filteredTasks = useMemo(() => {
    const normalized = [...tasks]
      .filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'All' ? true : task.status === statusFilter
        const matchesPriority = priorityFilter === 'All' ? true : task.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const order = { High: 3, Medium: 2, Low: 1 }
          return order[b.priority] - order[a.priority]
        }
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate)
        }
        return a.title.localeCompare(b.title)
      })

    return normalized
  }, [tasks, search, statusFilter, priorityFilter, sortBy])

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null

  const achievements = useMemo(() => {
    const completedCount = tasks.filter((task) => task.status === 'Completed').length
    return [
      { title: 'First Task Completed', description: 'Complete your first task', earned: completedCount >= 1 },
      { title: '10 Tasks Completed', description: 'Finish 10 tasks', earned: completedCount >= 10 },
      { title: '7 Day Streak', description: 'Stay active for 7 days', earned: streakDays >= 7 }
    ]
  }, [tasks, streakDays])

  const completedCount = tasks.filter((task) => task.status === 'Completed').length
  const totalTasks = tasks.length
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100)

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      search,
      setSearch,
      statusFilter,
      setStatusFilter,
      priorityFilter,
      setPriorityFilter,
      sortBy,
      setSortBy,
      selectedTask,
      setSelectedTaskId,
      addTask,
      updateTask,
      deleteTask,
      xpPoints,
      streakDays,
      feedbackMessage,
      achievements,
      completedCount,
      totalTasks,
      progressPercent,
      loadingTasks,
      error
    }),
    [tasks, filteredTasks, search, statusFilter, priorityFilter, sortBy, selectedTask, xpPoints, streakDays, feedbackMessage, achievements, completedCount, totalTasks, progressPercent, loadingTasks, error]
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTasks = () => useContext(TaskContext)
