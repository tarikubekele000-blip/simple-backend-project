export const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  return new Date(dateString).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const priorityClass = (priority) => {
  const map = {
    Low: 'priority-low',
    Medium: 'priority-medium',
    High: 'priority-high'
  }

  return map[priority] || 'priority-medium'
}

export const statusClass = (status) => {
  const map = {
    Pending: 'status-pending',
    'In Progress': 'status-progress',
    Completed: 'status-completed'
  }

  return map[status] || 'status-pending'
}
