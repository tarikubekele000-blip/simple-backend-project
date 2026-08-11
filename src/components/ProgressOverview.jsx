import AchievementBadge from './AchievementBadge'

const ProgressOverview = ({ xpPoints, streakDays, completed, total, progressPercent, achievements, feedbackMessage }) => {
  return (
    <section className="progress-overview card-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Student progress</p>
          <h3>Keep your momentum going</h3>
        </div>
      </div>

      <div className="progress-summary">
        <div className="progress-pill">
          <span>✨ XP</span>
          <strong>{xpPoints}</strong>
        </div>
        <div className="progress-pill">
          <span>🔥 Streak</span>
          <strong>{streakDays} days</strong>
        </div>
      </div>

      <div className="progress-bar-card">
        <div className="progress-topline">
          <span>Completed Tasks: {completed}/{total}</span>
          <span>Progress: {progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <p className="feedback-text">{feedbackMessage}</p>

      <div className="achievement-list">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.title} {...achievement} />
        ))}
      </div>
    </section>
  )
}

export default ProgressOverview
