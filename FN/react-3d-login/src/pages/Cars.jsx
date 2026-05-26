import { useState, useMemo, useEffect } from 'react'
import { API_BASE_URL } from '../config'

const API_URL = `${API_BASE_URL}/cars`

function CarCard({ car, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="car-card"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`car-image-wrapper ${hovered ? 'hovered' : ''}`}>
        <img src={car.image} alt={car.name} loading="lazy" />
        <div className="car-image-overlay" />
        <div className="car-price-badge">{car.price}</div>
      </div>
      <div className="car-info">
        <div className="car-header">
          <span className="car-brand">{car.brand}</span>
          <span className="car-category">{car.category}</span>
        </div>
        <h3 className="car-name">{car.name}</h3>
        <p className="car-desc">{car.description}</p>
        <div className="car-stats">
          <div className="stat">
            <span className="stat-value">{car.horsepower}</span>
            <span className="stat-label">HP</span>
          </div>
          <div className="stat">
            <span className="stat-value">{car.topSpeed}</span>
            <span className="stat-label">Top Speed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{car.acceleration}</span>
            <span className="stat-label">0-60</span>
          </div>
          <div className="stat">
            <span className="stat-value">{car.engine.split(' ').slice(0, 2).join(' ')}</span>
            <span className="stat-label">Engine</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cars() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [cars, setCars] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch cars from backend
  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (activeCategory !== 'All') params.append('category', activeCategory)
        if (searchQuery) params.append('search', searchQuery)
        if (sortBy) params.append('sortBy', sortBy)

        const response = await fetch(`${API_URL}?${params.toString()}`)
        const data = await response.json()

        if (response.ok) {
          setCars(data.cars)
          setError('')
        } else {
          setError(data.message || 'Failed to fetch cars')
        }
      } catch (err) {
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [activeCategory, searchQuery, sortBy])

  // Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_URL}/categories`)
        const data = await response.json()
        if (response.ok) {
          setCategories(data.categories)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="cars-page">
      {/* Hero Section */}
      <div className="cars-hero">
        <div className="hero-content">
          <h1 className="hero-title">World of Automobiles</h1>
          <p className="hero-subtitle">
            Discover every car on Earth — from hypercars to daily drivers, complete with specs and price tags.
          </p>
          <div className="hero-stats-bar">
            <div className="hero-stat">
              <span className="hero-stat-num">{cars.length}</span>
              <span className="hero-stat-label">Cars Listed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{categories.length - 1}</span>
              <span className="hero-stat-label">Categories</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">50+</span>
              <span className="hero-stat-label">Brands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="cars-controls">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search cars by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sort-dropdown">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="hp">Horsepower</option>
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && <div className="loading-message">Loading cars...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Car Grid */}
      {!loading && !error && (
        <div className="cars-grid">
          {cars.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      )}

      {!loading && !error && cars.length === 0 && (
        <div className="no-results">
          <h3>No cars found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Footer */}
      <footer className="cars-footer">
        <p> World Automobiles Showcase. All prices are approximate MSRP.</p>
      </footer>
    </div>
  )
}
