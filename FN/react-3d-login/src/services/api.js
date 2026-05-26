const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function fetchCars(params = {}) {
  const query = new URLSearchParams()
  if (params.category && params.category !== 'All') query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.sort) query.set('sort', params.sort)

  const res = await fetch(`${API_URL}/api/cars?${query.toString()}`)
  const data = await res.json()
  return data.cars || []
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/api/categories`)
  const data = await res.json()
  return data.categories || []
}
