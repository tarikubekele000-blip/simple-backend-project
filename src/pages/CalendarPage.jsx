import { useMemo } from 'react'
import { useTasks } from '../context/TaskContext'

const CalendarPage = () => {
  const { tasks } = useTasks()

  const events = useMemo(() => tasks.slice(0, 5), [tasks])

  return (
    <section className="card-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Calendar view</p>
          <h3>Upcoming deadlines</h3>
        </div>
      </div>

      <div className="calendar-grid">
        {events.map((task) => (
          <div key={task.id} className="calendar-card">
            <h4>{task.title}</h4>
            <p>{task.dueDate}</p>
            <span>{task.priority}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CalendarPage
