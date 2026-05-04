import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faFilm, faClock } from '@fortawesome/free-solid-svg-icons'
import { getHistory } from '../api'

function Profile() {
  const navigate              = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const username              = localStorage.getItem('username')
  const token                 = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    getHistory()
      .then(res => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
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

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-full
                          flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">{username}</h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              {history.length} searches made
            </p>
          </div>
        </div>

        {/* Search history */}
        <h2 className="text-white text-xl font-semibold mb-6">
          Search <span className="text-red-600">History</span>
        </h2>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faFilm} className="text-zinc-700 text-4xl mb-4" />
            <p className="text-zinc-500">No searches yet</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-red-600 text-white
                         rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Start Searching
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map(item => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                {/* Search query */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-xs uppercase tracking-wider">
                      Searched for
                    </span>
                    <span
                      className="text-white font-semibold cursor-pointer
                                 hover:text-red-500 transition-colors"
                      onClick={() => navigate(`/?q=${item.searched_movie}`)}
                    >
                      {item.searched_movie}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-600 text-xs">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{timeAgo(item.searched_at)}</span>
                  </div>
                </div>

                {/* Recommendations */}
                {item.recommended?.length > 0 && (
                  <>
                    <p className="text-zinc-500 text-xs uppercase
                                  tracking-wider mb-3">
                      Recommended
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.recommended.map((title, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-zinc-800 text-zinc-300
                                     text-xs rounded-full border border-zinc-700
                                     hover:border-red-600 hover:text-white
                                     transition-colors cursor-pointer"
                          onClick={() => navigate(`/?q=${title.split('(')[0].trim()}`)}
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile