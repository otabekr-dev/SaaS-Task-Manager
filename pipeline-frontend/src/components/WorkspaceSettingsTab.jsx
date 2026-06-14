import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { updateWorkspace, deleteWorkspace } from '../api/workspaces'

export default function WorkspaceSettingsTab({ workspaceId, workspace, onUpdated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (workspace) {
      setName(workspace.name)
      setDescription(workspace.description || '')
    }
  }, [workspace])

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await updateWorkspace(workspaceId, { name, description })
      setSuccess('Workspace updated')
      onUpdated()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : 'Failed to update workspace')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${workspace?.name}"? This cannot be undone.`)) return
    try {
      await deleteWorkspace(workspaceId)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      alert(typeof data === 'string' ? data : 'Failed to delete workspace')
    }
  }

  return (
    <div className="max-w-md space-y-6">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-3">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Name</label>
          <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-text-secondary block mb-1">Description</label>
          <textarea className="input-field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <div className="border-t border-border pt-5">
        <p className="text-sm font-medium text-red-700 mb-2">Danger zone</p>
        <p className="text-sm text-text-secondary mb-3">
          Deleting this workspace will permanently remove all its projects, tasks, and comments.
        </p>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-sm font-medium text-red-700 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
          Delete workspace
        </button>
      </div>
    </div>
  )
}
