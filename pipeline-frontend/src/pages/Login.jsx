import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import Scenery from '../components/Scenery'
import { useAuth } from '../context/AuthContext'
import { getRandomQuote } from '../components/quotes'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const quote = getRandomQuote()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'string') {
        setError(data)
      } else {
        setError('Invalid username or password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-3xl bg-white border border-border rounded-2xl overflow-hidden grid md:grid-cols-[1fr_1.3fr]">

        {/* Left panel - scenery */}
        <div className="relative min-h-[220px] md:min-h-[420px] overflow-hidden bg-blue-50">
          <Scenery />
          <div className="relative h-full flex flex-col justify-between p-7 z-10">
            <div>
              <div className="flex items-center gap-2">
                <GitBranch size={22} className="text-blue-950" />
                <span className="font-display font-bold text-xl text-blue-950">Pipeline</span>
              </div>
              <p className="font-display font-medium text-xl text-blue-950 mt-8 leading-snug max-w-[80%]">
                {quote}
              </p>
            </div>
            <div className="hidden md:block bg-white border-l-[3px] border-amber-dot p-3 rounded-r-lg">
              <span className="font-mono text-xs text-text-tertiary">TM-042</span>
              <p className="text-sm font-medium mt-1 text-text-primary">Fix login redirect bug</p>
              <span className="badge bg-amber-bg text-amber-text mt-2 inline-block">In progress</span>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="p-7 md:p-9 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-1">Welcome back</h2>
          <p className="text-sm text-text-secondary mb-6">Sign in to continue to your workspaces</p>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary block mb-1">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
