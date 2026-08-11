const isEmailValid = (email) => {
  if (!email || typeof email !== 'string') return false
  const normalized = email.trim().toLowerCase()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(normalized)
}

const isPasswordStrong = (password) => {
  if (!password || typeof password !== 'string') return false
  return password.length >= 8 && /[0-9]/.test(password) && /[A-Za-z]/.test(password)
}

const isNameValid = (name) => {
  return typeof name === 'string' && name.trim().length >= 2
}

module.exports = { isEmailValid, isPasswordStrong, isNameValid }
