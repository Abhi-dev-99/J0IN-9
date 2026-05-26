import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Cars from './pages/Cars'
import Dashboard from './pages/Dashboard'
import Scene from './Scene'
import { Canvas } from '@react-three/fiber'
import './App.css'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const hideNav = location.pathname === '/'

  if (hideNav) return null

  return (
    <nav className="app-navbar">
      <div className="app-nav-brand">
        <span className="app-nav-logo">3D</span>
        <span className="app-nav-title">CarWorld</span>
      </div>
      <div className="app-nav-links">
        <Link to="/cars" className={`app-nav-link ${location.pathname === '/cars' ? 'active' : ''}`}>
          Cars
        </Link>
        <Link to="/dashboard" className={`app-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        {token && (
          <button
            className="app-nav-logout"
            onClick={() => {
              localStorage.removeItem('token')
              navigate('/')
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
