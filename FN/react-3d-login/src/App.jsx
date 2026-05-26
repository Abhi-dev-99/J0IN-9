import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Cars from './pages/Cars'
import Scene from './Scene'
import { Canvas } from '@react-three/fiber'
import './App.css'

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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
        <Route path="/cars" element={<Cars />} />
        <Route path="*" element={<Navigate to="/cars" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
