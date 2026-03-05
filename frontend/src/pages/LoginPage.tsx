import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ApiError } from '../lib/api'
import { login } from '../lib/authApi'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ username, password })
      navigate('/tasks')
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1>Iniciar sesión</h1>
      <p className="muted">Entra con tu usuario y contraseña para ver tus tareas.</p>

      {error && (
        <div className="alert">
          {error.message ?? 'Credenciales inválidas'}
          {error.errors && (
            <ul>
              {Object.entries(error.errors).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {v}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="form">
        <label>
          Usuario
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label>
          Contraseña
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />
        </label>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="muted">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  )
}

