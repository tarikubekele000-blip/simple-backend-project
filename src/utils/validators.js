export const isEmailValid = (email) => {
  if (!email) return false
  const normalized = String(email).trim().toLowerCase()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(normalized)
}

export const isPasswordStrong = (password) => {
  if (!password || typeof password !== 'string') return false
  return password.length >= 8 && /[0-9]/.test(password) && /[A-Za-z]/.test(password)
}

export const isNameValid = (name) => {
  return typeof name === 'string' && name.trim().length >= 2
}
