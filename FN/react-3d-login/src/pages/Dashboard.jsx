import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchDashboardStats, fetchDashboardUsers, fetchDashboardCars } from '../services/api'

function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-title">{title}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const [statsData, usersData, carsData] = await Promise.all([
        fetchDashboardStats(),
        fetchDashboardUsers(),
        fetchDashboardCars()
      ])

      setStats(statsData)
      setUsers(usersData.users)
      setCars(carsData.cars)
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        navigate('/')
        return
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <p>{error}</p>
          <button className="enter-btn" onClick={() => navigate('/')}>Back to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="nav-logo">3D</span>
          <span className="nav-title">Admin Dashboard</span>
        </div>
        <div className="nav-links">
          <Link to="/cars" className="nav-link">Cars</Link>
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`dash-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`dash-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
          <button
            className={`dash-tab ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            Cars ({cars.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <>
            <div className="stats-grid">
              <StatCard
                title="Total Users"
                value={stats.stats.totalUsers}
                icon="👤"
                color="#5c6bc0"
              />
              <StatCard
                title="Total Cars"
                value={stats.stats.totalCars}
                icon="🚗"
                color="#3949ab"
              />
              <StatCard
                title="Categories"
                value={stats.stats.totalCategories}
                icon="🏷️"
                color="#283593"
              />
              <StatCard
                title="Most Expensive"
                value={stats.stats.mostExpensive?.price || 'N/A'}
                icon="💰"
                color="#1a237e"
              />
            </div>

            <div className="dashboard-section">
              <h3 className="section-title">Category Breakdown</h3>
              <div className="category-bars">
                {stats.categoryBreakdown.map(cat => (
                  <div key={cat.category} className="category-bar-item">
                    <div className="category-bar-header">
                      <span className="category-bar-name">{cat.category}</span>
                      <span className="category-bar-count">{cat.count} cars</span>
                    </div>
                    <div className="category-bar-track">
                      <div
                        className="category-bar-fill"
                        style={{ width: `${(cat.count / stats.stats.totalCars) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-section">
              <h3 className="section-title">Top Highlights</h3>
              <div className="highlights-grid">
                <div className="highlight-card">
                  <span className="highlight-label">Most Expensive</span>
                  <span className="highlight-value">{stats.stats.mostExpensive?.name || 'N/A'}</span>
                  <span className="highlight-sub">{stats.stats.mostExpensive?.price || ''}</span>
                </div>
                <div className="highlight-card">
                  <span className="highlight-label">Most Powerful</span>
                  <span className="highlight-value">{stats.stats.mostPowerful?.name || 'N/A'}</span>
                  <span className="highlight-sub">{stats.stats.mostPowerful?.horsepower || ''} HP</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="dashboard-section">
            <h3 className="section-title">Registered Users</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Last Sign In</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>{user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never'}</td>
                      <td>
                        <span className={`status-badge ${user.confirmed ? 'confirmed' : 'pending'}`}>
                          {user.confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="no-data">No users found</p>}
            </div>
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div className="dashboard-section">
            <h3 className="section-title">All Cars</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>HP</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id}>
                      <td>#{car.id}</td>
                      <td>{car.name}</td>
                      <td>{car.brand}</td>
                      <td>
                        <span className="table-category">{car.category}</span>
                      </td>
                      <td>{car.price}</td>
                      <td>{car.horsepower}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cars.length === 0 && <p className="no-data">No cars found</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
