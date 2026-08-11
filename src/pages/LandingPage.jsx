import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <section className="landing-page">
      <div className="hero-card">
        <p className="eyebrow">Welcome to TaskFlow</p>
        <h2>Organize schoolwork, projects, and deadlines in one calm dashboard.</h2>
        <p>
          Track homework, manage priorities, and keep your routine simple with a friendly student task manager.
        </p>
        <div className="button-row">
          <Link className="action-btn" to="/login">
            Login
          </Link>
          <Link className="ghost-btn" to="/register">
            Create account
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
