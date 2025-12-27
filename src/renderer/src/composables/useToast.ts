import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

/**
 * 全局 Toast 通知 Composable
 * 提供简单的消息提示功能
 */
export function useToast() {
  const addToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 3000
  ) => {
    const id = idCounter++
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (msg: string, duration?: number) => addToast(msg, 'success', duration)
  const error = (msg: string, duration?: number) => addToast(msg, 'error', duration)
  const info = (msg: string, duration?: number) => addToast(msg, 'info', duration)
  const warning = (msg: string, duration?: number) => addToast(msg, 'warning', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}
