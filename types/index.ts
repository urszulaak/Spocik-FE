export interface User {
  id: string
  username: string
  is_admin: boolean
}

export interface HateoasLink {
  href: string
  method: string
}

export interface EventItem {
  id: string
  name: string
  type: string
  description: string | null
  date: string
  week: number
  month: number
  year: number
  author: User
  _links?: Record<string, HateoasLink>
}

export interface EventCreate {
  name: string
  type: string
  date: string
  description?: string
}

export interface EventUpdate {
  name?: string
  type?: string
  date?: string
  description?: string
}

export interface ApiError {
  error: string
}
