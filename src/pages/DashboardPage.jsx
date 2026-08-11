import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ProgressOverview from '../components/ProgressOverview'
import { useTasks } from '../context/TaskContext'

const DashboardPage = () => {
  const { tasks, filteredTasks, search, setSearch, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, sortBy, setSortBy, selectedTask, setSelectedTaskId, addTask, updateTask, deleteTask, xpPoints, streakDays, feedbackMessage, achievements, completedCount, totalTasks, progressPercent } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const stats = useMemo(() => {
    const pending = tasks.filter((task) => task.status === 'Pending').length
    const completed = tasks.filter((task) => task.status === 'Completed').length
    const inProgress = tasks.filter((task) => task.status === 'In Progress').length
    return [
      { title: 'Pending', value: pending, hint: 'Needs attention', accent: 'accent-purple' },
      { title: 'In Progress', value: inProgress, hint: 'Moving forward', accent: 'accent-blue' },
      { title: 'Completed', value: completed, hint: 'Great progress', accent: 'accent-green' }
    ]
  }, [tasks])

  const handleAddTask = (task) => {
    addTask(task)
    setShowForm(false)
    setToast('Task added successfully')
  }

  const handleEditTask = (task) => {
    updateTask(task)
    setEditingTask(null)
    setToast('Task updated')
  }

  const confirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id)
      setShowDeleteModal(false)
      setToast('Task deleted')
    }
  }

  return (
    <section className="content-stack">
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <ProgressOverview xpPoints={xpPoints} streakDays={streakDays} completed={completedCount} total={totalTasks} progressPercent={progressPercent} achievements={achievements} feedbackMessage={feedbackMessage} />

      <div className="card-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Task board</p>
            <h3>Manage your workload</h3>
          </div>
          <button className="action-btn" onClick={() => setShowForm(true)}>
            + Add task
          </button>
        </div>

        <div className="toolbar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Sort by due date</option>
            <option value="priority">Sort by priority</option>
            <option value="title">Sort by title</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks match these filters yet.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onSelect={setSelectedTaskId} />
            ))}
          </div>
        )}
      </div>

      <div className="card-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Quick view</p>
            <h3>{selectedTask ? selectedTask.title : 'Select a task'}</h3>
          </div>
          <div className="button-row">
            <button className="ghost-btn" onClick={() => setEditingTask(selectedTask)} disabled={!selectedTask}>
              Edit
            </button>
            <button className="ghost-btn danger" onClick={() => setShowDeleteModal(true)} disabled={!selectedTask}>
              Delete
            </button>
          </div>
        </div>

        {selectedTask ? (
          <div className="detail-box">
            <p>{selectedTask.description}</p>
            <div className="task-meta">
              <span>{selectedTask.category}</span>
              <span>{selectedTask.priority}</span>
              <span>{selectedTask.status}</span>
            </div>
            <Link className="action-btn small" to={`/tasks/${selectedTask.id}`}>
              Open full details
            </Link>
          </div>
        ) : (
          <p className="helper-text">Choose a task to view details.</p>
        )}
      </div>

      <Modal open={showForm} title="Add task" onClose={() => setShowForm(false)}>
        <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal open={Boolean(editingTask)} title="Edit task" onClose={() => setEditingTask(null)}>
        {editingTask && <TaskForm mode="edit" task={editingTask} onSubmit={handleEditTask} onCancel={() => setEditingTask(null)} />}
      </Modal>

      <Modal open={showDeleteModal} title="Confirm deletion" onClose={() => setShowDeleteModal(false)}>
        <div className="modal-actions">
          <p>Are you sure you want to delete this task?</p>
          <div className="button-row">
            <button className="ghost-btn" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="action-btn" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} visible={Boolean(toast)} />
    </section>
  )
}

export default DashboardPage
