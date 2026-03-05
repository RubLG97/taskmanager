import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Shell } from './components/Shell'
import type { ApiError } from './lib/api'
import { getToken } from './lib/api'
import { me } from './lib/authApi'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TasksPage } from './pages/TasksPage'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [bootError, setBootError] = useState<ApiError | null>(null)
  const hasToken = Boolean(getToken())

  useEffect(() => {
    let cancelled = false
    async function boot() {
      setBootError(null)
      if (!hasToken) {
        setUser(null)
        return
      }
      try {
        const res = await me()
        if (!cancelled) setUser({ username: res.username })
      } catch (err) {
        if (!cancelled) {
          setBootError(err as ApiError)
          setUser(null)
        }
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [hasToken, location.pathname])

  return (
    <Shell user={user}>
      {bootError && (
        <div className="alert">
          {bootError.message ?? 'No se pudo validar la sesión'}
          <button
            className="btn btn-ghost"
            onClick={() => {
              navigate('/login')
            }}
            style={{ marginLeft: 12 }}
          >
            Ir a login
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/tasks"
          element={hasToken ? <TasksPage username={user?.username} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<div className="card">404</div>} />
      </Routes>
    </Shell>
  )
}

