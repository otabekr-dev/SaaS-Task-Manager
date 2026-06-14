import { Link, useNavigate } from 'react-router-dom'
import { GitBranch, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user
    ? `${(user.first_name?.[0] || '')}${(user.last_name?.[0] || '')}`.toUpperCase() || user.username[0].toUpperCase()
    : ''

  return (
    <div className="flex justify-between items-center px-6 py-4">
      <Link to="/" className="flex items-center gap-2">
        <GitBranch size={20} className="text-blue-600" />
        <span className="font-display font-bold text-lg text-text-primary">Pipeline</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary hidden sm:inline">
          {user?.first_name || user?.username}
        </span>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-600">
          {initials}
        </div>
        <button
          onClick={handleLogout}
          className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-cream"
          title="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}
