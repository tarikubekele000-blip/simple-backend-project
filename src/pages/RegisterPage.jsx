import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authRequest } from '../utils/api'
import { isEmailValid, isPasswordStrong, isNameValid } from '../utils/validators'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { auth, setSession, error, setError, loading, setLoading, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    if (!isNameValid(form.name)) {
      setError('Name must be at least 2 characters.')
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
      const data = await authRequest('/register', form)
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
        <p className="eyebrow">Create account</p>
        <h2>Register</h2>
        <form className="form-panel" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="helper-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
