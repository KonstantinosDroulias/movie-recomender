import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faBookmark, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { logoutUser, setAuthToken } from '../api'

function Navbar() {
  const navigate   = useNavigate()
  const token      = localStorage.getItem('token')
  const username   = localStorage.getItem('username')
  const isLoggedIn = !!token

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      setAuthToken(null)
      navigate('/')
      window.location.reload()
    }
  }

  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-2 text-white font-bold text-xl tracking-tight"
        >
          <FontAwesomeIcon icon={faFilm} className="text-red-600" />
          Movie<span className="text-red-600">Recommend</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/watchlist"
                className="flex items-center gap-1 text-zinc-400
                           hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faBookmark} />
                Watchlist
              </Link>

              <span className="text-zinc-600">|</span>

              {/* Username → goes to profile */}
              <Link
                to="/profile"
                className="text-zinc-400 hover:text-white
                           transition-colors text-xs"
              >
                {username}
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-zinc-400
                           hover:text-red-500 transition-colors"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-zinc-400
                           hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg
                           hover:bg-red-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar