import { apiFetch, clearToken, setToken } from './api'
import type { AuthTokenResponse, LoginRequest, MeResponse, RegisterRequest } from './types'

export async function register(payload: RegisterRequest) {
  const res = await apiFetch<AuthTokenResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  })
  setToken(res.token)
  return res
}

export async function login(payload: LoginRequest) {
  const res = await apiFetch<AuthTokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  })
  setToken(res.token)
  return res
}

export async function me() {
  return await apiFetch<MeResponse>('/api/auth/me')
}

export function logout() {
  clearToken()
}

