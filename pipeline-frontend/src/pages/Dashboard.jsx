import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Folder, Users } from 'lucide-react'
import Navbar from '../components/Navbar'
import BannerScenery from '../components/BannerScenery'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'
import { listWorkspaces, createWorkspace } from '../api/workspaces'
import { listProjects } from '../api/projects'
import { listMembers } from '../api/workspaces'
import { getRandomQuote } from '../components/quotes'

export default function Dashboard() {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState([])
  const [counts, setCounts] = useState({}) // { [workspaceId]: { projects, members } }
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await listWorkspaces()
      setWorkspaces(data)

      // Fetch project/member counts for each workspace
      const countEntries = await Promise.all(
        data.map(async (ws) => {
          try {
            const [projects, members] = await Promise.all([
              listProjects(ws.id),
              listMembers(ws.id),
            ])
            return [ws.id, { projects: projects.length, members: members.length }]
          } catch {
            return [ws.id, { projects: 0, members: 0 }]
          }
        })
      )
      setCounts(Object.fromEntries(countEntries))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const totalProjects = Object.values(counts).reduce((sum, c) => sum + (c.projects || 0), 0)

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto">
        <Navbar />

        <div className="bg-white border border-border rounded-2xl overflow-hidden mx-4">
          {/* Banner */}
          <div className="relative h-28 overflow-hidden bg-blue-50">
            <BannerScenery />
            <p className="relative font-display font-medium text-lg text-blue-950 p-6 pt-7 max-w-md">
              {`Good to see you, ${user?.first_name || user?.username}. ${getRandomQuote()}`}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-xl font-semibold">Your workspaces</h1>
                <p className="text-sm text-text-secondary mt-1">
                  {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}, {totalProjects} project{totalProjects !== 1 ? 's' : ''} total
                </p>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-text-tertiary">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {workspaces.map((ws) => {
                  const c = counts[ws.id] || { projects: 0, members: 0 }
                  const isOwner = ws.owner?.id === user?.id
                  return (
                    <Link
                      to={`/workspaces/${ws.id}`}
                      key={ws.id}
                      className="card p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-base">{ws.name}</p>
                        <span className={`badge ${isOwner ? 'bg-blue-50 text-blue-800' : 'bg-task-bg text-text-primary'}`}>
                          {isOwner ? 'Owner' : 'Member'}
                        </span>
                      </div>
                      {ws.description && (
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{ws.description}</p>
                      )}
                      <div className="flex gap-4 mt-3 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Folder size={14} /> {c.projects} project{c.projects !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {c.members} member{c.members !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </Link>
                  )
                })}

                <button
                  onClick={() => setShowModal(true)}
                  className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[110px] text-text-secondary hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus size={20} />
                  <span className="text-sm">New workspace</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CreateWorkspaceModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false)
            load()
          }}
        />
      )}
    </div>
  )
}

function CreateWorkspaceModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createWorkspace({ name, description })
      onCreated()
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Failed to create workspace')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="New workspace" onClose={onClose}>
      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Name</label>
          <input
            type="text" className="input-field" value={name}
            onChange={(e) => setName(e.target.value)} required autoFocus
          />
        </div>
        <div>
          <label className="text-sm text-text-secondary block mb-1">Description (optional)</label>
          <textarea
            className="input-field" rows={3} value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create workspace'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
