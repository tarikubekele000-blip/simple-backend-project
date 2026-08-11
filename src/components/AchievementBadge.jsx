const AchievementBadge = ({ title, description, earned }) => {
  return (
    <div className={`achievement-badge ${earned ? 'earned' : ''}`}>
      <div className="achievement-icon">{earned ? '✓' : '★'}</div>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default AchievementBadge
