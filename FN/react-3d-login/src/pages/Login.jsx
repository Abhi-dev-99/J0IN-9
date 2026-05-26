import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

const AUTH_URL = `${API_BASE_URL}/auth`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const endpoint = isRegister ? `${AUTH_URL}/register` : `${AUTH_URL}/login`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType('success')
        setMessage(data.message)

        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        if (!isRegister) {
          setTimeout(() => navigate('/cars'), 800)
        } else {
          setTimeout(() => {
            setIsRegister(false)
            setMessage('')
            setPassword('')
          }, 800)
        }
      } else {
        setMessageType('error')
        setMessage(data.message || 'Something went wrong')
      }
    } catch (err) {
      setMessageType('error')
      setMessage('Failed to connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setMessage('')
  }

  return (
    <div className="overlay">
      <div className="login-box">
        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <button className="enter-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Enter')}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" className="toggle-btn" onClick={toggleMode}>
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
