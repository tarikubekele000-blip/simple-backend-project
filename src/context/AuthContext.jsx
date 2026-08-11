import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { updateProfile as updateProfileApi } from '../utils/api'

const AuthContext = createContext()

const initialUser = () => {
  try {
    const stored = localStorage.getItem('taskflow-auth')
    return stored ? JSON.parse(stored) : { user: null, token: null }
  } catch {
    return { user: null, token: null }
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialUser)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('taskflow-auth', JSON.stringify(auth))
  }, [auth])

  const setSession = (data) => {
    setAuth({ user: data.user, token: data.token })
  }

  const updateProfile = async (profileData) => {
    if (!auth?.token) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const data = await updateProfileApi(profileData, auth.token)
      // keep same token, update user
      setAuth((prev) => ({ ...prev, user: data.user }))
      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearSession = () => {
    setAuth({ user: null, token: null })
  }

  const value = useMemo(
    () => ({
      auth,
      setSession,
      updateProfile,
      clearSession,
      error,
      setError,
      loading,
      setLoading,
      isAuthenticated: Boolean(auth?.token)
    }),
    [auth, error, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
