import { Link } from 'react-router-dom'
import { formatDate, priorityClass, statusClass } from '../utils/helpers'

const TaskCard = ({ task, onSelect }) => {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <h4>{task.title}</h4>
          <p>{task.subject}</p>
        </div>
        <span className={`pill ${priorityClass(task.priority)}`}>{task.priority}</span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span className={`pill ${statusClass(task.status)}`}>{task.status}</span>
        <span>Due {formatDate(task.dueDate)}</span>
      </div>

      <div className="task-actions">
        <button className="ghost-btn" onClick={() => onSelect(task.id)}>
          View
        </button>
        <Link className="action-btn small" to={`/tasks/${task.id}`}>
          Details
        </Link>
      </div>
    </article>
  )
}

export default TaskCard
