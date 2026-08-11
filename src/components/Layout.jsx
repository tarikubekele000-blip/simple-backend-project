import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useTasks } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/helpers'

const Layout = () => {
  const { darkMode, toggleTheme } = useTheme()
  const { selectedTask, setSelectedTaskId } = useTasks()
  const { auth, clearSession } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">✓</span>
          <span>TaskFlow</span>
        </div>

        <div className="sidebar-card user-card">
          <p className="eyebrow">Signed in as</p>
          <h4>{auth?.user?.name || 'Student'}</h4>
          <p>{auth?.user?.email || ''}</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/calendar">Calendar</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Selected task</p>
          {selectedTask ? (
            <>
              <h4>{selectedTask.title}</h4>
              <p>{formatDate(selectedTask.dueDate)}</p>
              <button className="ghost-btn" onClick={() => setSelectedTaskId(selectedTask.id)}>
                Open details
              </button>
            </>
          ) : (
            <p>No task selected yet.</p>
          )}
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Student Task Manager</p>
            <h1>Stay on top of your studies</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" onClick={toggleTheme}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="action-btn" onClick={clearSession}>
              Logout
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}

export default Layout
