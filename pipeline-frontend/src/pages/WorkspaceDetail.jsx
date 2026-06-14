import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Folder, ArrowLeft, BarChart3, Users as UsersIcon, Settings } from 'lucide-react'
import Navbar from '../components/Navbar'
import StripScenery from '../components/StripScenery'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'
import { getWorkspace, getWorkspaceStats } from '../api/workspaces'
import { listProjects, createProject } from '../api/projects'
import MembersTab from '../components/MembersTab'
import WorkspaceSettingsTab from '../components/WorkspaceSettingsTab'

const STATUS_COLORS = {
  TODO: '#888780',
  IN_PROGRESS: '#BA7517',
  DONE: '#1D9E75',
}

export default function WorkspaceDetail() {
  const { workspaceId } = useParams()
  const { user } = useAuth()
  const [workspace, setWorkspace] = useState(null)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState(null)
  const [tab, setTab] = useState('projects')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [ws, projs] = await Promise.all([
        getWorkspace(workspaceId),
        listProjects(workspaceId),
      ])
      setWorkspace(ws)
      setProjects(projs)

      // Stats may fail for plain members (admin/owner only) - that's fine
      try {
        const s = await getWorkspaceStats(workspaceId)
        setStats(s)
      } catch {
        setStats(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  const isOwner = workspace?.owner?.id === user?.id

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto">
        <Navbar />

        <div className="bg-white border border-border rounded-2xl overflow-hidden mx-4">
          {/* Strip scenery */}
          <div className="relative h-9 overflow-hidden bg-blue-50">
            <StripScenery />
          </div>

          <div className="p-6">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-blue-600 mb-3">
              <ArrowLeft size={14} /> All workspaces
            </Link>

            {workspace && (
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h1 className="text-xl font-semibold">{workspace.name}</h1>
                  {workspace.description && (
                    <p className="text-sm text-text-secondary mt-1">{workspace.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mt-5 border-b border-border">
              <TabButton active={tab === 'projects'} onClick={() => setTab('projects')} icon={<Folder size={15} />}>
                Projects
              </TabButton>
              <TabButton active={tab === 'members'} onClick={() => setTab('members')} icon={<UsersIcon size={15} />}>
                Members
              </TabButton>
              {stats && (
                <TabButton active={tab === 'stats'} onClick={() => setTab('stats')} icon={<BarChart3 size={15} />}>
                  Stats
                </TabButton>
              )}
              {isOwner && (
                <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} icon={<Settings size={15} />}>
                  Settings
                </TabButton>
              )}
            </div>

            {/* Tab content */}
            <div className="mt-5">
              {tab === 'projects' && (
                <div>
                  {loading ? (
                    <p className="text-sm text-text-tertiary">Loading...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {projects.map((p) => (
                        <Link
                          to={`/workspaces/${workspaceId}/projects/${p.id}`}
                          key={p.id}
                          className="card p-4 hover:border-blue-200 transition-colors"
                        >
                          <p className="font-medium text-base">{p.name}</p>
                          {p.description && (
                            <p className="text-sm text-text-secondary mt-1 line-clamp-2">{p.description}</p>
                          )}
                          <p className="text-xs text-text-tertiary mt-3">
                            Owner: {p.owner?.first_name || p.owner?.username}
                          </p>
                        </Link>
                      ))}

                      <button
                        onClick={() => setShowModal(true)}
                        className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[100px] text-text-secondary hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <Plus size={20} />
                        <span className="text-sm">New project</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {tab === 'members' && <MembersTab workspaceId={workspaceId} currentUser={user} workspace={workspace} />}

              {tab === 'stats' && stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Members" value={stats.total_members} />
                  <StatCard label="Projects" value={stats.total_projects} />
                  <StatCard label="Tasks" value={stats.total_tasks} />
                  <div className="card p-4 col-span-2 sm:col-span-1">
                    <p className="text-xs text-text-tertiary mb-2">Tasks by status</p>
                    <div className="space-y-1.5">
                      {stats.tasks_by_status?.map((s) => (
                        <div key={s.status} className="flex items-center gap-2 text-sm">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: STATUS_COLORS[s.status] || '#888780' }}
                          />
                          <span className="text-text-secondary">{s.status.replace('_', ' ')}</span>
                          <span className="ml-auto font-medium">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'settings' && isOwner && (
                <WorkspaceSettingsTab workspaceId={workspaceId} workspace={workspace} onUpdated={load} />
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CreateProjectModal
          workspaceId={workspaceId}
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

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-xs text-text-tertiary mt-1">{label}</p>
    </div>
  )
}

function CreateProjectModal({ workspaceId, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createProject(workspaceId, { name, description })
      onCreated()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : 'Failed to create project. You may need admin or owner permissions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="New project" onClose={onClose}>
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
            {loading ? 'Creating...' : 'Create project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
