import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (user) {
    navigate('/cars', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password)
      } else {
        result = await signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        navigate('/cars')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay">
      <div className="login-box">
        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {error && (
          <div className="auth-error">
            {error}
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
              minLength={6}
            />
          </div>
          <button className="enter-btn" type="submit" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Enter'}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {!isSignUp && (
          <div className="demo-creds">
            <p>Demo Accounts:</p>
            <code>demo@automobiles.com / password123</code>
            <code>alice@automobiles.com / password123</code>
          </div>
        )}
      </div>
    </div>
  )
}
