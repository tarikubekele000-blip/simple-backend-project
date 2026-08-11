const Toast = ({ message, visible }) => {
  if (!visible || !message) return null

  return <div className="toast">{message}</div>
}

export default Toast
