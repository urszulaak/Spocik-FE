import type { User } from '~/types'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const user = useState<User | null>('auth-user', () => null)
  const credentials = useCookie<{ username: string; password: string } | null>('auth-credentials', {
    default: () => null,
    watch: true,
  })

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.is_admin === true)

  function getAuthHeader(): string | null {
    if (!credentials.value) return null
    const encoded = btoa(`${credentials.value.username}:${credentials.value.password}`)
    return `Basic ${encoded}`
  }

  async function login(username: string, password: string): Promise<void> {
    const encoded = btoa(`${username}:${password}`)

    const data = await $fetch<User>(`${config.public.apiBase}/api/users/me`, {
      headers: {
        Authorization: `Basic ${encoded}`,
      },
    })

    user.value = data
    credentials.value = { username, password }
  }

  async function register(username: string, password: string): Promise<void> {
    await $fetch(`${config.public.apiBase}/api/users/register`, {
      method: 'POST',
      body: { username, password },
    })

    await login(username, password)
  }

  function logout(): void {
    user.value = null
    credentials.value = null
    navigateTo('/login')
  }

  // Restore session from cookie on app init
  async function restoreSession(): Promise<void> {
    if (credentials.value && !user.value) {
      try {
        await login(credentials.value.username, credentials.value.password)
      } catch {
        credentials.value = null
        user.value = null
      }
    }
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    getAuthHeader,
    login,
    register,
    logout,
    restoreSession,
  }
}
