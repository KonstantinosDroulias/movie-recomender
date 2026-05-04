import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faArrowLeft, faCalendar, faClock, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { getMovie, addToWatchlist } from '../api'

function MovieDetail() {
  const { id }                      = useParams()
  const navigate                    = useNavigate()
  const [movie, setMovie]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [added, setAdded]           = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    getMovie(id)
      .then(res => setMovie(res.data))
      .catch(() => setMovie(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAddToWatchlist() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    setBtnLoading(true)
    try {
      await addToWatchlist({
        tmdb_id:     movie.id,
        title:       movie.title,
        poster_path: movie.poster_path || '',
      })
      setAdded(true)
    } catch {
      setAdded(true) // already in watchlist
    } finally {
      setBtnLoading(false)
    }
  }

  function getPosterUrl(path) {
    if (!path) return null
    return `https://image.tmdb.org/t/p/w500${path}`
  }

  function getBackdropUrl(path) {
    if (!path) return null
    return `https://image.tmdb.org/t/p/original${path}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600
                        border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Movie not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">

      {getBackdropUrl(movie.backdrop_path) && (
        <div className="relative w-full h-72 overflow-hidden">
          <img
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b
                          from-transparent to-zinc-950" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400
                     hover:text-white transition-colors mb-8 text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        <div className="flex gap-8 flex-col sm:flex-row">

          <div className="flex-shrink-0">
            {getPosterUrl(movie.poster_path) ? (
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-48 rounded-xl shadow-2xl"
              />
            ) : (
              <div className="w-48 h-72 bg-zinc-800 rounded-xl" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-white text-4xl font-bold tracking-tight mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-red-500 text-sm italic mb-4">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                  <span className="text-white font-medium">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    ({movie.vote_count?.toLocaleString()} votes)
                  </span>
                </div>
              )}

              {movie.release_date && (
                <div className="flex items-center gap-1 text-zinc-400 text-sm">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>{movie.release_date.split('-')[0]}</span>
                </div>
              )}

              {movie.runtime > 0 && (
                <div className="flex items-center gap-1 text-zinc-400 text-sm">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{movie.runtime} min</span>
                </div>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300
                               text-xs rounded-full border border-zinc-700"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <div className="mb-6">
                <h2 className="text-white font-semibold mb-2">Overview</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Watchlist button */}
            <button
              onClick={handleAddToWatchlist}
              disabled={btnLoading || added}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg
                         font-medium text-sm transition-colors
                         ${added
                           ? 'bg-zinc-700 text-zinc-400 cursor-default'
                           : 'bg-red-600 hover:bg-red-700 text-white'
                         }`}
            >
              <FontAwesomeIcon icon={faBookmark} />
              {added ? 'Added to Watchlist' : 'Add to Watchlist'}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail