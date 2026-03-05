import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../lib/authApi'

export function Shell(props: { children: ReactNode; user?: { username: string } | null }) {
  const navigate = useNavigate()

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/tasks" className="brand">
          Task Manager
        </Link>
        <nav className="nav">
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Tareas
          </NavLink>
        </nav>
        <div className="spacer" />
        {props.user ? (
          <div className="userbox">
            <span className="muted">Hola,</span> <strong>{props.user.username}</strong>
            <button
              className="btn btn-ghost"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="userbox">
            <Link className="btn btn-ghost" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary" to="/register">
              Crear cuenta
            </Link>
          </div>
        )}
      </header>

      <main className="container">{props.children}</main>
    </div>
  )
}

