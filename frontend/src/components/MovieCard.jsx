import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

function MovieCard({ movie }) {
  const navigate = useNavigate()

  function getPosterUrl(path) {
    if (!path) return null
    return `https://image.tmdb.org/t/p/w500${path}`
  }

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer
                 hover:scale-105 hover:ring-2 hover:ring-red-600
                 transition-all duration-200 group"
    >
      {/* Poster */}
      {getPosterUrl(movie.poster_path) ? (
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center
                        justify-center text-zinc-600 text-sm">
          No Image
        </div>
      )}

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white text-sm font-medium truncate">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-zinc-400 text-xs">
            {movie.release_date
              ? movie.release_date.split('-')[0]
              : 'N/A'}
          </span>
          {movie.vote_average > 0 && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon
                icon={faStar}
                className="text-yellow-500 text-xs"
              />
              <span className="text-zinc-400 text-xs">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard