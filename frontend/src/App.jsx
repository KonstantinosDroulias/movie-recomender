import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Watchlist from './pages/Watchlist'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import { setAuthToken } from './api'

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setAuthToken(token)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile"   element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App