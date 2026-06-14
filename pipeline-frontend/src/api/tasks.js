import api from './client'

const base = (workspaceId, projectId) => `/api/workspaces/${workspaceId}/projects/${projectId}/tasks`

export const listTasks = async (workspaceId, projectId) => {
  const res = await api.get(`${base(workspaceId, projectId)}/`)
  return res.data
}

export const createTask = async (workspaceId, projectId, data) => {
  // data: { title, description, status }
  const res = await api.post(`${base(workspaceId, projectId)}/`, data)
  return res.data
}

export const getTask = async (workspaceId, projectId, taskId) => {
  const res = await api.get(`${base(workspaceId, projectId)}/${taskId}/`)
  return res.data
}

export const updateTask = async (workspaceId, projectId, taskId, data) => {
  const res = await api.patch(`${base(workspaceId, projectId)}/${taskId}/`, data)
  return res.data
}

export const deleteTask = async (workspaceId, projectId, taskId) => {
  const res = await api.delete(`${base(workspaceId, projectId)}/${taskId}/`)
  return res.data
}

export const assignTask = async (workspaceId, projectId, taskId, assignedTo) => {
  const res = await api.patch(`${base(workspaceId, projectId)}/${taskId}/assign/`, { assigned_to: assignedTo })
  return res.data
}

// Comments
export const listComments = async (workspaceId, projectId, taskId) => {
  const res = await api.get(`${base(workspaceId, projectId)}/${taskId}/comments/`)
  return res.data
}

export const createComment = async (workspaceId, projectId, taskId, text) => {
  const res = await api.post(`${base(workspaceId, projectId)}/${taskId}/comments/`, { text })
  return res.data
}

export const deleteComment = async (workspaceId, projectId, taskId, commentId) => {
  const res = await api.delete(`${base(workspaceId, projectId)}/${taskId}/comments/${commentId}/`)
  return res.data
}
