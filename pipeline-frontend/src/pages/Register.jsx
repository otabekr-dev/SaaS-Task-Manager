import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import Scenery from '../components/Scenery'
import { register } from '../api/auth'
import { getRandomQuote } from '../components/quotes'

export default function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const quote = getRandomQuote()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'string') {
        setError(data)
      } else if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0]
        const firstError = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey]
        setError(`${firstKey}: ${firstError}`)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-3xl bg-white border border-border rounded-2xl overflow-hidden grid md:grid-cols-[1fr_1.3fr]">

        {/* Left panel - scenery */}
        <div className="relative min-h-[220px] md:min-h-[480px] overflow-hidden bg-blue-50">
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
              <span className="font-mono text-xs text-text-tertiary">TM-009</span>
              <p className="text-sm font-medium mt-1 text-text-primary">Set up Postgres on staging</p>
              <span className="badge bg-blue-50 text-blue-800 mt-2 inline-block">Done</span>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="p-7 md:p-9 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-1">Create your account</h2>
          <p className="text-sm text-text-secondary mb-6">Start organizing your team's work</p>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-text-secondary block mb-1">First name</label>
                <input
                  type="text" name="first_name" className="input-field"
                  placeholder="John" value={form.first_name} onChange={handleChange} required
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Last name</label>
                <input
                  type="text" name="last_name" className="input-field"
                  placeholder="Doe" value={form.last_name} onChange={handleChange} required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Username</label>
              <input
                type="text" name="username" className="input-field"
                placeholder="johndoe" value={form.username} onChange={handleChange} required
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Email</label>
              <input
                type="email" name="email" className="input-field"
                placeholder="john@example.com" value={form.email} onChange={handleChange} required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-text-secondary block mb-1">Password</label>
                <input
                  type="password" name="password" className="input-field"
                  placeholder="********" value={form.password} onChange={handleChange} required
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Confirm</label>
                <input
                  type="password" name="confirm" className="input-field"
                  placeholder="********" value={form.confirm} onChange={handleChange} required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
