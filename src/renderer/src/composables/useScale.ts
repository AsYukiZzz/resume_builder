import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const A4_WIDTH = 794
const A4_HEIGHT_PX = 1123 // 96 DPI 下的 A4 高度
// 引入 10px 的安全边距，防止浏览器渲染误差导致内容溢出到下一页
// 将分页线视觉上稍微上移，确保在“线内”的内容一定会被打印在当前页
const SAFE_PAGE_HEIGHT = 1113

/**
 * 缩放控制 Composable
 * 管理预览区域的缩放比例、分页计算和自适应逻辑
 */
export function useScale(previewContainer: any, contentRef: any) {
  // 缩放模式：适应宽度 | 适应整页 | 手动
  const scaleMode = ref<'fit-width' | 'fit-page' | 'manual'>('fit-width')
  const manualScale = ref(100)
  
  // 容器和内容的实时尺寸
  const containerWidth = ref(0)
  const containerHeight = ref(0)
  const contentHeight = ref(0)

  /**
   * 计算当前缩放比例
   * 根据不同的缩放模式和容器尺寸动态计算
   */
  const currentScale = computed(() => {
    if (scaleMode.value === 'manual') return manualScale.value
    if (!containerWidth.value) return 100
    
    // 动态内边距：容器较窄时减少边距以留出更多空间
    const padding = containerWidth.value < 1000 ? 48 : 96
    
    // 基础宽度缩放比例
    const widthScale = Math.floor(((containerWidth.value - padding) / A4_WIDTH) * 100)
    
    if (scaleMode.value === 'fit-width') {
      // 限制缩放范围在 20% - 200% 之间
      return Math.min(Math.max(widthScale, 20), 200)
    }
    
    // 适应整页模式：同时计算高度缩放比，取宽高中较小者
    if (scaleMode.value === 'fit-page') {
      if (!containerHeight.value) return widthScale
      const heightScale = Math.floor(((containerHeight.value - padding) / A4_HEIGHT_PX) * 100)
      const finalScale = Math.min(widthScale, heightScale)
      return Math.min(Math.max(finalScale, 20), 200)
    }
    
    return 100
  })

  // 计算总页数
  const totalPages = computed(() => {
    if (!contentHeight.value) return 1
    return Math.max(Math.ceil(contentHeight.value / SAFE_PAGE_HEIGHT), 1)
  })
  
  // 计算预览容器的总高度（确保至少显示一页高度）
  const computedPageHeight = computed(() => {
    return Math.max(totalPages.value * A4_HEIGHT_PX, A4_HEIGHT_PX)
  })

  // 切换缩放模式
  const setScaleMode = (mode: 'fit-width' | 'fit-page' | 'manual') => {
    scaleMode.value = mode
    // 如果切换到手动模式，保持当前计算出的缩放比例作为初始值
    if (mode === 'manual') manualScale.value = currentScale.value
  }

  // 处理 Ctrl + 滚轮缩放
  const handleScroll = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      scaleMode.value = 'manual'
      
      const delta = e.deltaY > 0 ? -5 : 5
      const newScale = manualScale.value + delta
      
      manualScale.value = Math.min(Math.max(newScale, 20), 200)
    }
  }

  // 尺寸监听器
  let resizeObserver: ResizeObserver | null = null
  let contentObserver: ResizeObserver | null = null

  const initObservers = () => {
    if (resizeObserver) resizeObserver.disconnect()
    if (contentObserver) contentObserver.disconnect()

    // 监听容器尺寸变化（调整缩放）
    if (previewContainer.value) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          containerWidth.value = entry.contentRect.width
          containerHeight.value = entry.contentRect.height
        }
      })
      resizeObserver.observe(previewContainer.value)
    }

    // 监听内容高度变化（调整页数）
    if (contentRef.value) {
      contentObserver = new ResizeObserver((entries) => {
        for (const entry of entries) contentHeight.value = entry.contentRect.height
      })
      contentObserver.observe(contentRef.value)
    }
  }

  onMounted(() => {
    initObservers()
  })

  // 当 DOM 引用变化时重新绑定（例如在重新加载项目后）
  watch([previewContainer, contentRef], () => {
    initObservers()
  })

  onUnmounted(() => {
    if (resizeObserver) resizeObserver.disconnect()
    if (contentObserver) contentObserver.disconnect()
  })

  return {
    scaleMode,
    manualScale,
    currentScale,
    totalPages,
    computedPageHeight,
    setScaleMode,
    handleScroll
  }
}
