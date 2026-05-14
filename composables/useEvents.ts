import type { EventItem, EventCreate, EventUpdate } from '~/types'

export const useEvents = () => {
  const config = useRuntimeConfig()
  const { getAuthHeader } = useAuth()

  function authHeaders(): Record<string, string> {
    const h: Record<string, string> = {}
    const auth = getAuthHeader()
    if (auth) h['Authorization'] = auth
    return h
  }

  async function fetchEvents(params?: Record<string, string>): Promise<EventItem[]> {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return await $fetch<EventItem[]>(`${config.public.apiBase}/api/events${query}`)
  }

  async function fetchEventsByDate(dateStr: string): Promise<EventItem[]> {
    return fetchEvents({ date: dateStr })
  }

  async function fetchEventsByWeek(week: number, year: number): Promise<EventItem[]> {
    return fetchEvents({ week: String(week), year: String(year) })
  }

  async function fetchEvent(id: string): Promise<EventItem> {
    return await $fetch<EventItem>(`${config.public.apiBase}/api/events/${id}`)
  }

  async function createEvent(data: EventCreate): Promise<EventItem> {
    return await $fetch<EventItem>(`${config.public.apiBase}/api/events`, {
      method: 'POST',
      headers: authHeaders(),
      body: data,
    })
  }

  async function updateEvent(id: string, data: EventUpdate): Promise<EventItem> {
    const response = await fetch(`${config.public.apiBase}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('PUT error response:', response.status, errorData)
      throw { data: errorData, message: `HTTP ${response.status}` }
    }
    return await response.json()
  }

  async function deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${config.public.apiBase}/api/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw { data: errorData, message: `HTTP ${response.status}` }
    }
  }

  async function downloadReport(): Promise<void> {
    const blob = await $fetch<Blob>(`${config.public.apiBase}/api/events/report`, {
      responseType: 'blob',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'raport_wydarzen.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    fetchEvents,
    fetchEventsByDate,
    fetchEventsByWeek,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    downloadReport,
  }
}
