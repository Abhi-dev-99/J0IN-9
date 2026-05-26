import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()

  const addLog = (msg) => {
    const line = `[${new Date().toLocaleTimeString()}] ${msg}`
    console.log(line)
    setLogs(prev => [...prev.slice(-4), line])
  }

  // Redirect if already logged in
  if (user) {
    addLog('Already logged in, redirecting...')
    navigate('/cars', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    addLog('=== FORM SUBMITTED ===')
    addLog(`Mode: ${isSignUp ? 'SIGN UP' : 'SIGN IN'}, Email: ${email}`)
    
    setError('')
    setLoading(true)

    try {
      let result
      if (isSignUp) {
        addLog('Calling signUp()...')
        result = await signUp(email, password)
      } else {
        addLog('Calling signIn()...')
        result = await signIn(email, password)
      }

      addLog(`Result received. Has error: ${!!result.error}`)
      
      if (result.error) {
        addLog(`ERROR: ${result.error.message}`)
        setError(result.error.message)
      } else {
        addLog('SUCCESS! User authenticated.')
        addLog(`User ID: ${result.data?.user?.id}`)
        addLog('Navigating to /cars...')
        navigate('/cars')
      }
    } catch (err) {
      addLog(`EXCEPTION: ${err.message}`)
      console.error('[Login] Full error:', err)
      setError(`Exception: ${err.message}`)
    } finally {
      setLoading(false)
      addLog('=== FORM HANDLER DONE ===')
    }
  }

  return (
    <div className="overlay">
      <div className="login-box">
        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {error && (
          <div className="auth-error">
            <strong>Login Failed</strong>
            <p>{error}</p>
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
              setLogs([])
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {/* Debug Console */}
        <div className="debug-console">
          <p className="debug-title">Debug Console</p>
          {logs.length === 0 ? (
            <p className="debug-line">Click "Enter" to see debug logs...</p>
          ) : (
            logs.map((log, i) => (
              <p key={i} className="debug-line">{log}</p>
            ))
          )}
        </div>

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
