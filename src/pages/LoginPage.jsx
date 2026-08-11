import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authRequest } from '../utils/api'
import { isEmailValid, isPasswordStrong } from '../utils/validators'

const LoginPage = () => {
  const navigate = useNavigate()
  const { auth, setSession, error, setError, loading, setLoading, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in both fields.')
      return
    }

    if (!isEmailValid(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!isPasswordStrong(form.password)) {
      setError('Password must be at least 8 characters and contain letters and numbers.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const data = await authRequest('/login', form)
      setSession(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <div className="auth-panel">
        <p className="eyebrow">Welcome back</p>
        <h2>Login</h2>
        <form className="form-panel" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="action-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="helper-text">
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
