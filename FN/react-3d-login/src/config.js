// API Configuration
// Uses current origin for deployed apps, falls back to localhost for dev
const prodUrl = window.location.origin.replace(/:\d+$/, '') + '/api';
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? prodUrl : 'http://localhost:5000/api');
