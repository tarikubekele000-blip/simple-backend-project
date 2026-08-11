const API_BASE = '/api'

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
})

const request = async (path, method = 'GET', body = null, token = null) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: jsonHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const authRequest = (path, body) => request(`/auth${path}`, 'POST', body)
export const fetchTasks = (token) => request('/tasks', 'GET', null, token)
export const createTask = (task, token) => request('/tasks', 'POST', task, token)
export const updateTask = (id, task, token) => request(`/tasks/${id}`, 'PUT', task, token)
export const deleteTask = (id, token) => request(`/tasks/${id}`, 'DELETE', null, token)
export const updateProfile = (data, token) => request('/auth/me', 'PUT', data, token)
