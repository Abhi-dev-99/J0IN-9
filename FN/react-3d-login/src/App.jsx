import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Cars from './pages/Cars'
import Scene from './Scene'
import { Canvas } from '@react-three/fiber'
import './App.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="overlay">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/" replace />
}

function AppContent() {
  return (
    <>
      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <Cars />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/cars" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
