import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faStar } from '@fortawesome/free-solid-svg-icons'
import { searchMovies } from '../api'

function SearchBar({ onSelect }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const ref                   = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchMovies(query)
        setResults(res.data.results.slice(0, 6))
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  function handleSelect(movie) {
    setQuery(movie.title)
    setOpen(false)
    setResults([])
    onSelect(movie)
  }

  function getPosterUrl(path) {
    if (!path) return null
    return `https://image.tmdb.org/t/p/w92${path}`
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">

      <div className="relative">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a movie you liked..."
          className="w-full pl-11 pr-5 py-4 rounded-xl bg-zinc-800 text-white
                     border border-zinc-700 outline-none
                     focus:border-red-600 placeholder-zinc-500
                     transition-colors text-sm"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent
                            rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900
                        border border-zinc-700 rounded-xl overflow-y-auto
                        shadow-2xl z-50 max-h-64">
          {results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelect(movie)}
              className="w-full flex items-center gap-3 px-4 py-3
                         hover:bg-zinc-800 transition-colors text-left
                         border-b border-zinc-800 last:border-0"
            >
              {getPosterUrl(movie.poster_path) ? (
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-10 h-14 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-14 bg-zinc-700 rounded flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {movie.title}
                </div>
                <div className="flex items-center gap-2 mt-1 text-zinc-400 text-xs">
                  <span>
                    {movie.release_date
                      ? movie.release_date.split('-')[0]
                      : 'N/A'}
                  </span>
                  {movie.vote_average > 0 && (
                    <>
                      <span>•</span>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500 text-xs"
                      />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default SearchBar