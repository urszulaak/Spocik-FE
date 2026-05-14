export const useToast = () => {
  const toasts = useState<Array<{ id: number; message: string; type: 'success' | 'error' }>>('toasts', () => [])

  let counter = 0

  function show(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function success(message: string) {
    show(message, 'success')
  }

  function error(message: string) {
    show(message, 'error')
  }

  return { toasts, show, success, error }
}
