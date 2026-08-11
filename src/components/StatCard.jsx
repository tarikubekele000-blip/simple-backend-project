const StatCard = ({ title, value, hint, accent }) => {
  return (
    <article className={`stat-card ${accent}`}>
      <p className="eyebrow">{title}</p>
      <h3>{value}</h3>
      <span>{hint}</span>
    </article>
  )
}

export default StatCard
