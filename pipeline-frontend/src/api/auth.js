import api from './client'

export const login = async (username, password) => {
  const res = await api.post('/auth/login/', { username, password })
  localStorage.setItem('access_token', res.data.access)
  localStorage.setItem('refresh_token', res.data.refresh)
  return res.data
}

export const register = async (data) => {
  // data: { first_name, last_name, username, email, password, confirm }
  const res = await api.post('/auth/register/', data)
  return res.data
}

export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token')
  try {
    if (refresh) {
      await api.post('/auth/logout/', { refresh })
    }
  } finally {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
}

export const getMe = async () => {
  const res = await api.get('/auth/me/')
  return res.data
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token')
}
