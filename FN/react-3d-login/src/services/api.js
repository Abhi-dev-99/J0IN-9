import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchCars(params = {}) {
  const query = new URLSearchParams()
  if (params.category && params.category !== 'All') query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.sort) query.set('sort', params.sort)

  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/api/cars?${query.toString()}`, { headers })
  const data = await res.json()
  return data.cars || []
}

export async function fetchCategories() {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/api/categories`, { headers })
  const data = await res.json()
  return data.categories || []
}
