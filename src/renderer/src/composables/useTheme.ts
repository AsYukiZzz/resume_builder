import { ref, watch } from 'vue'

const isDark = ref(false)

/**
 * 主题管理 Composable
 * 负责切换亮色/暗色模式，并持久化存储到 localStorage
 */
export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const initTheme = () => {
    // 1. 优先读取本地存储的偏好
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      isDark.value = storedTheme === 'dark'
    } else {
      // 2. 如果没有存储，则跟随系统设置
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  // 监听主题变化，实时更新 DOM class 和 localStorage
  watch(
    isDark,
    (val) => {
      if (val) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    },
    { immediate: true }
  )

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
