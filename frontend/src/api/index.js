import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1'
})

// Auth token helper
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Movies
export const getPopular   = ()      => api.get('/popular/')
export const searchMovies = (q)     => api.get(`/search/?q=${q}`)
export const getMovie     = (id)    => api.get(`/movie/${id}/`)
export const getRecommend = (title) => api.get(`/recommend/?title=${title}`)

// Auth
export const registerUser = (data)  => api.post('/auth/register/', data)
export const loginUser    = (data)  => api.post('/auth/login/', data)
export const logoutUser   = ()      => api.post('/auth/logout/')

// History
export const getHistory = () => api.get('/auth/history/')

// Watchlist
export const getWatchlist    = ()         => api.get('/auth/watchlist/')
export const addToWatchlist  = (data)     => api.post('/auth/watchlist/', data)
export const updateWatchlist = (id, data) => api.patch(`/auth/watchlist/${id}/`, data)
export const removeWatchlist = (id)       => api.delete(`/auth/watchlist/${id}/`)