import api from './client'

export const listWorkspaces = async () => {
  const res = await api.get('/api/workspaces/')
  return res.data
}

export const createWorkspace = async (data) => {
  // data: { name, description }
  const res = await api.post('/api/workspaces/', data)
  return res.data
}

export const getWorkspace = async (workspaceId) => {
  const res = await api.get(`/api/workspaces/${workspaceId}/`)
  return res.data
}

export const updateWorkspace = async (workspaceId, data) => {
  const res = await api.patch(`/api/workspaces/${workspaceId}/`, data)
  return res.data
}

export const deleteWorkspace = async (workspaceId) => {
  const res = await api.delete(`/api/workspaces/${workspaceId}/`)
  return res.data
}

export const getWorkspaceStats = async (workspaceId) => {
  const res = await api.get(`/api/workspaces/${workspaceId}/stats/`)
  return res.data
}

// Members
export const listMembers = async (workspaceId) => {
  const res = await api.get(`/api/workspaces/${workspaceId}/members/`)
  return res.data
}

export const inviteMember = async (workspaceId, email) => {
  const res = await api.post(`/api/workspaces/${workspaceId}/members/`, { email })
  return res.data
}

export const updateMemberRole = async (workspaceId, userId, role) => {
  const res = await api.patch(`/api/workspaces/${workspaceId}/members/${userId}/`, { role })
  return res.data
}

export const removeMember = async (workspaceId, userId) => {
  const res = await api.delete(`/api/workspaces/${workspaceId}/members/${userId}/`)
  return res.data
}
