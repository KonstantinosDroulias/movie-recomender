import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import { loginUser, setAuthToken } from '../api'

function Login() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginUser(form)
      localStorage.setItem('token',    res.data.token)
      localStorage.setItem('username', res.data.username)
      setAuthToken(res.data.token)
      navigate('/')
      window.location.reload()
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <FontAwesomeIcon icon={faFilm} className="text-red-600 text-3xl mb-3" />
          <h1 className="text-white text-2xl font-bold">Welcome back</h1>
          <p className="text-zinc-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400
                            text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700
                           text-white rounded-lg outline-none text-sm
                           focus:border-red-600 transition-colors placeholder-zinc-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700
                           text-white rounded-lg outline-none text-sm
                           focus:border-red-600 transition-colors placeholder-zinc-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50
                         text-white font-semibold rounded-lg transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-500 hover:text-red-400">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login