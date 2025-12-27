import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 布局管理 Composable
 * 负责响应式布局调整，如侧边栏折叠和编辑器展开状态
 */
export function useLayout() {
  const isCollapsed = ref(false)
  const isEditorOpen = ref(true)

  // 根据窗口宽度自动调整布局
  const handleWindowResize = () => {
    const width = window.innerWidth
    if (width < 1366) isCollapsed.value = true // 小屏自动折叠侧边栏
    if (width < 1050) isEditorOpen.value = false // 更小屏自动关闭编辑器
  }

  onMounted(() => {
    window.addEventListener('resize', handleWindowResize)
    handleWindowResize()
  })
  
  onUnmounted(() => window.removeEventListener('resize', handleWindowResize))

  return { isCollapsed, isEditorOpen }
}
