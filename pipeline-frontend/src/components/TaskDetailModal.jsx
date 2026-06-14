import { useState, useEffect } from 'react'
import { X, Trash2, Send } from 'lucide-react'
import {
  updateTask, deleteTask, assignTask,
  listComments, createComment, deleteComment,
} from '../api/tasks'

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'Todo', dot: '#888780' },
  { value: 'IN_PROGRESS', label: 'In progress', dot: '#BA7517' },
  { value: 'DONE', label: 'Done', dot: '#1D9E75' },
]

export default function TaskDetailModal({
  task, workspaceId, projectId, members, currentUser,
  onClose, onUpdated, onDeleted,
}) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState(task.status)
  const [assignedTo, setAssignedTo] = useState(task.assigned_to?.id || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  const loadComments = async () => {
    setCommentsLoading(true)
    try {
      const data = await listComments(workspaceId, projectId, task.id)
      setComments(data)
    } finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id])

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus)
    try {
      await updateTask(workspaceId, projectId, task.id, { status: newStatus })
      onUpdated()
    } catch {
      setError('Failed to update status')
    }
  }

  const handleAssign = async (e) => {
    const userId = e.target.value
    setAssignedTo(userId)
    if (!userId) return
    try {
      await assignTask(workspaceId, projectId, task.id, userId)
      onUpdated()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : 'Failed to assign task')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateTask(workspaceId, projectId, task.id, { title, description })
      onUpdated()
      onClose()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(workspaceId, projectId, task.id)
      onDeleted()
    } catch {
      setError('Failed to delete task')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setCommentLoading(true)
    try {
      await createComment(workspaceId, projectId, task.id, newComment)
      setNewComment('')
      loadComments()
    } catch {
      setError('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(workspaceId, projectId, task.id, commentId)
      loadComments()
    } catch (err) {
      const data = err.response?.data
      alert(typeof data === 'string' ? data : 'You can only delete your own comments')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 pt-5">
          <span className="font-mono text-xs text-text-tertiary">TM-{String(task.id).padStart(3, '0')}</span>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pt-2">
          {error && (
            <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Status pills */}
          <div className="flex gap-2 mb-4">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                  status === opt.value
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-border text-text-secondary hover:border-blue-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.dot }} />
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <input
              type="text"
              className="input-field font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="input-field"
              rows={3}
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div>
              <label className="text-sm text-text-secondary block mb-1">Assigned to</label>
              <select className="input-field" value={assignedTo} onChange={handleAssign}>
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.first_name} {m.user.last_name} ({m.user.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm text-red-700 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors"
              >
                <Trash2 size={15} /> Delete task
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>

          {/* Comments */}
          <div className="border-t border-border mt-5 pt-4">
            <p className="text-sm font-medium mb-3">Comments</p>

            {commentsLoading ? (
              <p className="text-sm text-text-tertiary">Loading...</p>
            ) : (
              <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                {comments.length === 0 && (
                  <p className="text-sm text-text-tertiary">No comments yet.</p>
                )}
                {comments.map((c) => {
                  const initials = `${c.user.first_name?.[0] || ''}${c.user.last_name?.[0] || ''}`.toUpperCase() || c.user.username[0].toUpperCase()
                  const isOwn = c.user.id === currentUser?.id
                  return (
                    <div key={c.id} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-medium text-blue-600 flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <div className="bg-task-bg rounded-lg px-3 py-2">
                          <p className="text-xs font-medium text-text-secondary">
                            {c.user.first_name || c.user.username}
                          </p>
                          <p className="text-sm mt-0.5">{c.text}</p>
                        </div>
                      </div>
                      {isOwn && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-text-tertiary hover:text-red-600 p-1 self-start"
                          title="Delete comment"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="btn-primary px-3" disabled={commentLoading}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
