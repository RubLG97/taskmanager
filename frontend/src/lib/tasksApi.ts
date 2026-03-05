import { apiFetch } from './api'
import type { Page, TaskPriority, TaskRequest, TaskResponse, TaskStatus } from './types'

export async function listTasks(params: {
  status?: TaskStatus
  priority?: TaskPriority
  page?: number
  size?: number
}) {
  const qs = new URLSearchParams()
  if (params.status) qs.set('status', params.status)
  if (params.priority) qs.set('priority', params.priority)
  if (typeof params.page === 'number') qs.set('page', String(params.page))
  if (typeof params.size === 'number') qs.set('size', String(params.size))

  const query = qs.toString()
  return await apiFetch<Page<TaskResponse>>(`/api/tasks${query ? `?${query}` : ''}`)
}

export async function createTask(payload: TaskRequest) {
  return await apiFetch<TaskResponse>('/api/tasks', { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateTask(id: number, payload: TaskRequest) {
  return await apiFetch<TaskResponse>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function deleteTask(id: number) {
  return await apiFetch<string>(`/api/tasks/${id}`, { method: 'DELETE' })
}

