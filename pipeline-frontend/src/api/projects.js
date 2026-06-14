import api from './client'

export const listProjects = async (workspaceId) => {
  const res = await api.get(`/api/workspaces/${workspaceId}/projects/`)
  return res.data
}

export const createProject = async (workspaceId, data) => {
  // data: { name, description }
  const res = await api.post(`/api/workspaces/${workspaceId}/projects/`, data)
  return res.data
}

export const getProject = async (workspaceId, projectId) => {
  const res = await api.get(`/api/workspaces/${workspaceId}/projects/${projectId}/`)
  return res.data
}

export const updateProject = async (workspaceId, projectId, data) => {
  const res = await api.patch(`/api/workspaces/${workspaceId}/projects/${projectId}/`, data)
  return res.data
}

export const deleteProject = async (workspaceId, projectId) => {
  const res = await api.delete(`/api/workspaces/${workspaceId}/projects/${projectId}/`)
  return res.data
}
