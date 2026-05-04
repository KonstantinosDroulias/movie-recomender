import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'
import { getWatchlist, updateWatchlist, removeWatchlist } from '../api'

function Watchlist() {
  const navigate = useNavigate()
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    getWatchlist()
      .then(res => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleStatus(id, status) {
    try {
      await updateWatchlist(id, { status })
      setItems(items.map(i =>
        i.id === id ? { ...i, status } : i
      ))
    } catch {
      // ignore
    }
  }

  async function handleRemove(id) {
    try {
      await removeWatchlist(id)
      setItems(items.filter(i => i.id !== id))
    } catch {
      // ignore
    }
  }

  function getPosterUrl(path) {
    if (!path) return null
    return `https://image.tmdb.org/t/p/w200${path}`
  }

  const statusLabels = {
    want_to_watch: 'Want to Watch',
    watching:      'Watching',
    watched:       'Watched',
  }

  const statusColors = {
    want_to_watch: 'text-zinc-400',
    watching:      'text-yellow-500',
    watched:       'text-green-500',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600
                        border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-white text-3xl font-bold mb-8">
          My <span className="text-red-600">Watchlist</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg mb-4">Your watchlist is empty</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg
                         hover:bg-red-700 transition-colors text-sm"
            >
              Discover Movies
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl
                           flex items-center gap-4 p-4"
              >
                {/* Poster */}
                {getPosterUrl(item.poster_path) ? (
                  <img
                    src={getPosterUrl(item.poster_path)}
                    alt={item.title}
                    onClick={() => navigate(`/movie/${item.tmdb_id}`)}
                    className="w-12 h-16 object-cover rounded-lg
                               cursor-pointer flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-16 bg-zinc-800 rounded-lg flex-shrink-0" />
                )}

                {/* Title */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/movie/${item.tmdb_id}`)}
                >
                  <p className="text-white font-medium">{item.title}</p>
                  <p className={`text-xs mt-0.5 ${statusColors[item.status]}`}>
                    {statusLabels[item.status]}
                  </p>
                </div>

                {/* Status buttons */}
                <div className="flex items-center gap-2">
                  {['want_to_watch', 'watching', 'watched'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatus(item.id, s)}
                      className={`px-3 py-1 rounded-lg text-xs transition-colors
                        ${item.status === s
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                    >
                      {statusLabels[s]}
                    </button>
                  ))}
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-zinc-600 hover:text-red-500
                             transition-colors ml-2 flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Watchlist