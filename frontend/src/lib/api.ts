const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export type ApiError = {
  status?: number
  message?: string
  errors?: Record<string, string>
}

async function parseError(res: Response): Promise<ApiError> {
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      const json = await res.json()
      return {
        status: json?.status ?? res.status,
        message: json?.message ?? res.statusText,
        errors: json?.errors,
      }
    } catch {
      // ignore
    }
  }
  return { status: res.status, message: res.statusText }
}

export function getToken(): string | null {
  return localStorage.getItem('tm_token')
}

export function setToken(token: string) {
  localStorage.setItem('tm_token', token)
}

export function clearToken() {
  localStorage.removeItem('tm_token')
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options
  const finalHeaders = new Headers(headers)
  finalHeaders.set('Content-Type', 'application/json')

  if (auth) {
    const token = getToken()
    if (token) finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders })
  if (!res.ok) {
    throw await parseError(res)
  }
  return (await res.json()) as T
}

