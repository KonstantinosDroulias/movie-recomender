import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import { getPopular, getRecommend } from '../api'

function Home() {
  const [popular, setPopular]           = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [selected, setSelected]         = useState(null)
  const [loading, setLoading]           = useState(false)

  // Fetch popular on load
  useEffect(() => {
    getPopular()
      .then(res => setPopular(res.data.results))
      .catch(() => setPopular([]))
  }, [])

  async function handleSelect(movie) {
    setSelected(movie)
    setLoading(true)
    setRecommendations([])

    try {
      const res = await getRecommend(movie.title)
      setRecommendations(res.data.results)
    } catch {
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-white text-5xl font-bold mb-3 tracking-tight">
            Find Your Next{' '}
            <span className="text-red-600">Favourite</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-10">
            Search a movie you loved and discover similar ones
          </p>
          <SearchBar onSelect={handleSelect} />
        </div>

        {/* Recommendations */}
        {selected && (
          <div className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">
              Because you liked{' '}
              <span className="text-red-500">{selected.title}</span>
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-red-600
                                border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {recommendations.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">
                No recommendations found for this movie.
              </p>
            )}
          </div>
        )}

        {/* Popular */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-6">
            Popular Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {popular.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home