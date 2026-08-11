import { useNavigate, useParams } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { formatDate } from '../utils/helpers'

const TaskDetailPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks } = useTasks()
  const task = tasks.find((item) => item.id === taskId)

  if (!task) {
    return (
      <section className="card-panel">
        <p className="eyebrow">Not found</p>
        <h3>This task does not exist.</h3>
        <button className="action-btn" onClick={() => navigate('/tasks')}>
          Back to tasks
        </button>
      </section>
    )
  }

  return (
    <section className="card-panel detail-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Task detail</p>
          <h3>{task.title}</h3>
        </div>
        <button className="ghost-btn" onClick={() => navigate('/tasks')}>
          Back
        </button>
      </div>

      <div className="detail-box">
        <p>{task.description}</p>
        <div className="task-meta">
          <span>Subject: {task.subject}</span>
          <span>Category: {task.category}</span>
          <span>Priority: {task.priority}</span>
          <span>Status: {task.status}</span>
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
      </div>
    </section>
  )
}

export default TaskDetailPage
