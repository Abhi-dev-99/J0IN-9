import { useState, useMemo, useRef, useEffect } from 'react'
import { cars, categories } from '../data/cars'

function CarCard({ car, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="car-card"
      style={{ animationDelay: `${index * 0.03}s` }}
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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Build suggestion list based on search query
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return cars.filter(car =>
      car.name.toLowerCase().includes(query) ||
      car.brand.toLowerCase().includes(query)
    ).slice(0, 8)
  }, [searchQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(true)
    setHighlightedIndex(-1)
  }

  const handleSuggestionClick = (carName) => {
    setSearchQuery(carName)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[highlightedIndex].name)
      } else {
        setShowSuggestions(false)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const filteredCars = useMemo(() => {
    let result = cars.filter(car => {
      const matchesCategory = activeCategory === 'All' || car.category === activeCategory
      const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.priceNum - b.priceNum)
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.priceNum - a.priceNum)
    } else if (sortBy === 'hp') {
      result = [...result].sort((a, b) => b.horsepower - a.horsepower)
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [activeCategory, searchQuery, sortBy])

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
        <div className="search-box" ref={searchRef}>
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search cars by name or brand..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
          />
          {/* Auto-suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown" ref={suggestionsRef}>
              {suggestions.map((car, idx) => (
                <div
                  key={car.id}
                  className={`suggestion-item ${idx === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => handleSuggestionClick(car.name)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  <img src={car.image} alt="" className="suggestion-thumb" />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{car.name}</span>
                    <span className="suggestion-meta">{car.brand} · {car.category} · {car.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Car Grid */}
      <div className="cars-grid">
        {filteredCars.map((car, i) => (
          <CarCard key={car.id} car={car} index={i} />
        ))}
      </div>

      {filteredCars.length === 0 && (
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
