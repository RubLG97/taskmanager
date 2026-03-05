export type LoginRequest = {
  username: string
  password: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
}

export type AuthTokenResponse = {
  token: string
}

export type MeResponse = {
  username: string
  email: string
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type TaskRequest = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string // ISO
}

export type TaskResponse = {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  username: string
}

export type Page<T> = {
  content: T[]
  number: number
  size: number
  totalElements: number
  totalPages: number
}

