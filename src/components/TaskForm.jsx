import { useEffect, useState } from 'react'

const initialState = {
  title: '',
  description: '',
  subject: '',
  category: 'Homework',
  priority: 'Medium',
  status: 'Pending',
  dueDate: ''
}

const TaskForm = ({ mode = 'add', task, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm(task)
    } else {
      setForm(initialState)
    }
  }, [task])

  const validate = () => {
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required'
    if (!form.subject.trim()) nextErrors.subject = 'Subject is required'
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, title: form.title.trim(), subject: form.subject.trim() })
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </label>
        <label>
          Subject
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          {errors.subject && <span className="error-text">{errors.subject}</span>}
        </label>
      </div>

      <label>
        Description
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>

      <div className="form-row">
        <label>
          Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Homework</option>
            <option>Assignment</option>
            <option>Project</option>
            <option>Exam</option>
            <option>Reading</option>
            <option>Personal</option>
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>urgent </option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Status
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>
        <label>
          Due date
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
        </label>
      </div>

      <div className="button-row">
        <button type="submit" className="action-btn">
          {mode === 'edit' ? 'Save changes' : 'Add task'}
        </button>
        {onCancel && (
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
