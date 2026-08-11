import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { auth, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    setForm({ name: auth?.user?.name || '', email: auth?.user?.email || '', password: '' })
  }, [auth?.user])

  const handleSave = async (e) => {
    e.preventDefault()
    setStatus('Saving...')
    try {
      const updated = await updateProfile({ name: form.name, email: form.email, password: form.password || undefined })
      setStatus('Saved successfully')
      setEditing(false)
      setForm((f) => ({ ...f, password: '' }))
      setTimeout(() => setStatus(''), 2000)
    } catch (err) {
      setStatus(err.message || 'Save failed')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  return (
    <section className="card-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h3>Your student profile</h3>
        </div>
        <div className="button-row">
          <button className="ghost-btn" onClick={() => setEditing((s) => !s)}>{editing ? 'Cancel' : 'Edit'}</button>
        </div>
      </div>

      {!editing ? (
        <div className="profile-card">
          <h4>{auth?.user?.name || 'Student'}</h4>
          <p>{auth?.user?.email}</p>
          <p>Focus: On-time submissions and balanced study habits.</p>
        </div>
      ) : (
        <form className="form-panel" onSubmit={handleSave}>
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            New password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
          </label>

          <div className="button-row">
            <button className="action-btn" type="submit">Save changes</button>
            <button type="button" className="ghost-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
          {status && <p className="helper-text">{status}</p>}
        </form>
      )}
    </section>
  )
}

export default ProfilePage
