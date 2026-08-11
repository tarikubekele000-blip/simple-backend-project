import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="card-panel not-found">
      <p className="eyebrow">404</p>
      <h3>Page not found</h3>
      <p>The page you are looking for does not exist.</p>
      <Link className="action-btn" to="/">
        Go home
      </Link>
    </section>
  )
}

export default NotFoundPage
