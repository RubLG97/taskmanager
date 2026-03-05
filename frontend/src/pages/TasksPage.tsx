import React, { useEffect, useMemo, useState } from 'react'
import type { ApiError } from '../lib/api'
import { createTask, deleteTask, listTasks, updateTask } from '../lib/tasksApi'
import type { Page, TaskPriority, TaskResponse, TaskStatus } from '../lib/types'

const STATUS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
const PRIORITY: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH']

export function TasksPage(props: { username?: string }) {
  const [page, setPage] = useState<Page<TaskResponse> | null>(null)
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [priority, setPriority] = useState<TaskPriority | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const query = useMemo(
    () => ({ status: status || undefined, priority: priority || undefined, page: 0, size: 20 }),
    [status, priority],
  )

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const res = await listTasks(query)
      setPage(res)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.status, query.priority])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setLoading(true)
    setError(null)
    try {
      await createTask({ title: newTitle.trim(), description: newDescription.trim() || undefined })
      setNewTitle('')
      setNewDescription('')
      await load()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  async function toggleDone(t: TaskResponse) {
    const next: TaskStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    setLoading(true)
    setError(null)
    try {
      await updateTask(t.id, { title: t.title, description: t.description, status: next, priority: t.priority })
      await load()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id: number) {
    setLoading(true)
    setError(null)
    try {
      await deleteTask(id)
      await load()
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack">
      <div className="hero">
        <h1>Tus tareas</h1>
        <p className="muted">
          {props.username ? `Sesión iniciada como ${props.username}.` : 'Gestiona tus tareas de forma simple y rápida.'}
        </p>
      </div>

      <div className="card">
        <h2>Nueva tarea</h2>
        <form onSubmit={onCreate} className="form">
          <label>
            Título
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ej: Estudiar JWT" />
          </label>
          <label>
            Descripción (opcional)
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Ej: practicar con Swagger"
            />
          </label>
          <button className="btn btn-primary" disabled={loading}>
            Crear
          </button>
        </form>
      </div>

      <div className="card">
        <div className="row">
          <h2>Listado</h2>
          <div className="filters">
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | '')}>
              <option value="">Todos los estados</option>
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority | '')}>
              <option value="">Todas las prioridades</option>
              {PRIORITY.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button className="btn btn-ghost" onClick={() => load()} disabled={loading}>
              Refrescar
            </button>
          </div>
        </div>

        {error && <div className="alert">{error.message ?? 'Error cargando tareas'}</div>}
        {loading && <div className="muted">Cargando…</div>}

        {!loading && page && page.content.length === 0 && <div className="muted">No hay tareas todavía.</div>}

        {page && page.content.length > 0 && (
          <ul className="tasks">
            {page.content.map((t) => (
              <li key={t.id} className={`task ${t.status === 'COMPLETED' ? 'done' : ''}`}>
                <div className="task-main">
                  <div className="task-title">
                    <strong>{t.title}</strong>
                    <span className="pill">{t.priority}</span>
                    <span className="pill">{t.status}</span>
                  </div>
                  {t.description && <div className="muted">{t.description}</div>}
                </div>
                <div className="task-actions">
                  <button className="btn btn-ghost" onClick={() => toggleDone(t)} disabled={loading}>
                    {t.status === 'COMPLETED' ? 'Reabrir' : 'Completar'}
                  </button>
                  <button className="btn btn-danger" onClick={() => onDelete(t.id)} disabled={loading}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

