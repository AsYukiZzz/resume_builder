import { ref } from 'vue'
import { useToast } from './useToast'

/**
 * 导出功能 Composable
 * 处理 PDF 和 PNG 的生成与下载
 */
export function useExport() {
  const isExporting = ref(false)
  const isExportMenuOpen = ref(false)
  const toast = useToast()

  /**
   * 处理导出请求
   * @param type 导出类型：'pdf' 或 'png'
   * @param contentElement 包含简历内容的 DOM 元素
   */
  const handleExport = async (type: 'pdf' | 'png', contentElement: HTMLElement | null) => {
    if (!contentElement) {
      toast.error('无法获取简历内容')
      return
    }

    isExporting.value = true
    isExportMenuOpen.value = false // 点击后自动关闭菜单

    try {
      // 1. 获取 HTML 内容
      const htmlContent = contentElement.outerHTML

      // 2. 获取所有样式内容
      // 遍历所有样式表（包括 <style> 和 <link>），确保样式被正确内联
      let styleContent = ''
      Array.from(document.styleSheets).forEach((sheet) => {
        try {
          const rules = sheet.cssRules
          if (rules) {
            Array.from(rules).forEach((rule) => {
              styleContent += rule.cssText + '\n'
            })
          }
        } catch (e) {
          console.warn('Error reading css rules from stylesheet:', e)
        }
      })

      // 3. 将 HTML 写入临时文件（通过 Electron 主进程）
      // @ts-ignore: window.electron 是通过 preload 注入的
      const tempHtmlPath = await window.electron.ipcRenderer.invoke('write-temp-file', htmlContent)

      let fileBuffer = null
      
      if (type === 'pdf') {
        // --- PDF 生成 ---
        // @ts-ignore
        fileBuffer = await window.electron.ipcRenderer.invoke('generate-pdf-data', {
          tempHtmlPath,
          styleContent,
          contentHeight: undefined
        })
      } else {
        // --- PNG 生成 (主进程截图方案) ---
        // 获取内容实际高度和宽度，增加一点内边距缓冲
        const width = contentElement.scrollWidth
        const height = contentElement.scrollHeight
        
        // @ts-ignore
        fileBuffer = await window.electron.ipcRenderer.invoke('generate-png-data', {
          tempHtmlPath,
          styleContent,
          width,
          height
        })
      }

      // 4. 保存文件
      // @ts-ignore
      const result = await window.electron.ipcRenderer.invoke('save-file', {
        content: fileBuffer,
        type: type,
        defaultName: `我的简历.${type}`
      })
      
      if (result) toast.success(`${type.toUpperCase()} 导出成功！`)

    } catch (error) {
      console.error('Export failed:', error)
      toast.error(`导出失败: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    isExportMenuOpen,
    handleExport
  }
}
