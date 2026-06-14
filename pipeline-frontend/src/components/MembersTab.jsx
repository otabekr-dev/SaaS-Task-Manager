import { useState, useEffect } from 'react'
import { UserPlus, X } from 'lucide-react'
import { listMembers, inviteMember, updateMemberRole, removeMember } from '../api/workspaces'

const ROLES = ['MEMBER', 'ADMIN']

export default function MembersTab({ workspaceId, currentUser, workspace }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)

  const isOwner = workspace?.owner?.id === currentUser?.id
  const myMembership = members.find((m) => m.user.id === currentUser?.id)
  const isAdmin = myMembership?.role === 'ADMIN'
  const canManage = isOwner || isAdmin

  const load = async () => {
    setLoading(true)
    try {
      const data = await listMembers(workspaceId)
      setMembers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  const handleInvite = async (e) => {
    e.preventDefault()
    setInviteError('')
    setInviteLoading(true)
    try {
      await inviteMember(workspaceId, email)
      setEmail('')
      load()
    } catch (err) {
      const data = err.response?.data
      setInviteError(typeof data === 'string' ? data : 'Failed to invite member')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRoleChange = async (userId, role) => {
    try {
      await updateMemberRole(workspaceId, userId, role)
      load()
    } catch (err) {
      const data = err.response?.data
      alert(typeof data === 'string' ? data : 'Failed to update role')
    }
  }

  const handleRemove = async (userId) => {
    if (!confirm('Remove this member from the workspace?')) return
    try {
      await removeMember(workspaceId, userId)
      load()
    } catch (err) {
      const data = err.response?.data
      alert(typeof data === 'string' ? data : 'Failed to remove member')
    }
  }

  return (
    <div>
      {canManage && (
        <form onSubmit={handleInvite} className="flex gap-2 mb-4">
          <input
            type="email"
            placeholder="Invite by email"
            className="input-field flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary flex items-center gap-1.5 whitespace-nowrap" disabled={inviteLoading}>
            <UserPlus size={16} />
            {inviteLoading ? 'Inviting...' : 'Invite'}
          </button>
        </form>
      )}
      {inviteError && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {inviteError}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-text-tertiary">Loading...</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => {
            const initials = `${m.user.first_name?.[0] || ''}${m.user.last_name?.[0] || ''}`.toUpperCase() || m.user.username[0].toUpperCase()
            const isSelf = m.user.id === currentUser?.id
            return (
              <div key={m.id} className="flex items-center justify-between card p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-600">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {m.user.first_name} {m.user.last_name}
                      {isSelf && <span className="text-text-tertiary"> (you)</span>}
                    </p>
                    <p className="text-xs text-text-tertiary">{m.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {m.role === 'OWNER' ? (
                    <span className="badge bg-blue-50 text-blue-800">Owner</span>
                  ) : isOwner && !isSelf ? (
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.user.id, e.target.value)}
                      className="text-sm border border-border rounded-lg px-2 py-1 bg-white"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="badge bg-task-bg text-text-primary">{m.role}</span>
                  )}

                  {canManage && m.role !== 'OWNER' && !isSelf && (
                    <button
                      onClick={() => handleRemove(m.user.id)}
                      className="text-text-tertiary hover:text-red-600 p-1"
                      title="Remove member"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
