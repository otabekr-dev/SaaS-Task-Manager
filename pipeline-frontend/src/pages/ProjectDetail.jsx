import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, ArrowLeft, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import StripScenery from '../components/StripScenery'
import Modal from '../components/Modal'
import TaskCard from '../components/TaskCard'
import TaskDetailModal from '../components/TaskDetailModal'
import { useAuth } from '../context/AuthContext'
import { getProject, deleteProject } from '../api/projects'
import { listTasks, createTask } from '../api/tasks'
import { listMembers, getWorkspace } from '../api/workspaces'

const COLUMNS = [
  { key: 'TODO', label: 'Todo', dot: '#888780' },
  { key: 'IN_PROGRESS', label: 'In progress', dot: '#BA7517' },
  { key: 'DONE', label: 'Done', dot: '#1D9E75' },
]

export default function ProjectDetail() {
  const { workspaceId, projectId } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [proj, ws, taskList, memberList] = await Promise.all([
        getProject(workspaceId, projectId),
        getWorkspace(workspaceId),
        listTasks(workspaceId, projectId),
        listMembers(workspaceId),
      ])
      setProject(proj)
      setWorkspace(ws)
      setTasks(taskList)
      setMembers(memberList)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, projectId])

  const isOwner = workspace?.owner?.id === user?.id

  const handleDeleteProject = async () => {
    if (!confirm(`Delete project "${project?.name}"? All its tasks will be deleted too.`)) return
    try {
      await deleteProject(workspaceId, projectId)
      window.location.href = `/workspaces/${workspaceId}`
    } catch (err) {
      const data = err.response?.data
      alert(typeof data === 'string' ? data : 'Failed to delete project')
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto">
        <Navbar />

        <div className="bg-white border border-border rounded-2xl overflow-hidden mx-4">
          <div className="relative h-9 overflow-hidden bg-blue-50">
            <StripScenery />
          </div>

          <div className="p-6">
            <Link to={`/workspaces/${workspaceId}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-blue-600 mb-3">
              <ArrowLeft size={14} /> {workspace?.name || 'Workspace'}
            </Link>

            <div className="flex justify-between items-end mb-5">
              <div>
                <p className="text-xs text-text-tertiary">{workspace?.name}</p>
                <h1 className="text-xl font-semibold mt-0.5">{project?.name}</h1>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && (
                  <button
                    onClick={handleDeleteProject}
                    className="text-text-tertiary hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-1.5">
                  <Plus size={16} /> New task
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-text-tertiary">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {COLUMNS.map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col.key)
                  return (
                    <div key={col.key}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dot }} />
                        <span className="text-sm font-medium">{col.label}</span>
                        <span className="text-xs text-text-tertiary">{colTasks.length}</span>
                      </div>
                      <div className="space-y-2 min-h-[60px]">
                        {colTasks.map((task) => (
                          <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                        ))}
                        {colTasks.length === 0 && (
                          <div className="border border-dashed border-border rounded-xl p-4 text-center text-xs text-text-tertiary">
                            No tasks
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          workspaceId={workspaceId}
          projectId={projectId}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            load()
          }}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          workspaceId={workspaceId}
          projectId={projectId}
          members={members}
          currentUser={user}
          onClose={() => setSelectedTask(null)}
          onUpdated={load}
          onDeleted={() => {
            setSelectedTask(null)
            load()
          }}
        />
      )}
    </div>
  )
}

function CreateTaskModal({ workspaceId, projectId, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createTask(workspaceId, projectId, { title, description })
      onCreated()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : 'Failed to create task. You may need admin or owner permissions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="New task" onClose={onClose}>
      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Title</label>
          <input
            type="text" className="input-field" value={title}
            onChange={(e) => setTitle(e.target.value)} required autoFocus
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
            {loading ? 'Creating...' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
