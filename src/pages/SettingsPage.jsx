import { useTheme } from '../context/ThemeContext'

const SettingsPage = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <section className="card-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h3>Personalize your workspace</h3>
        </div>
      </div>

      <div className="settings-list">
        <div className="setting-item">
          <div>
            <h4>Dark mode</h4>
            <p>Switch between light and dark themes.</p>
          </div>
          <button className="action-btn" onClick={toggleTheme}>
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default SettingsPage
