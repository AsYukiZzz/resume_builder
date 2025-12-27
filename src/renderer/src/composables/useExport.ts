import { ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
// @ts-ignore: 使用 Vite 的 ?url 导入 worker，解决路径问题
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { useToast } from './useToast'

// 设置 PDF.js Worker 路径
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

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
      // 遍历 document 中的 style 标签，确保样式被正确内联到生成的 PDF 中
      let styleContent = ''
      const styles = document.querySelectorAll('style')
      styles.forEach(style => {
        styleContent += style.innerHTML + '\n'
      })

      // 3. 将 HTML 写入临时文件（通过 Electron 主进程）
      // @ts-ignore: window.electron 是通过 preload 注入的
      const tempHtmlPath = await window.electron.ipcRenderer.invoke('write-temp-file', htmlContent)

      // 4. 生成 PDF Buffer
      // 对于 PNG 导出，增加额外高度缓冲以防止内容在分页处被截断
      const contentHeight = type === 'png' ? contentElement.scrollHeight + 20 : undefined
      
      // @ts-ignore
      const pdfBuffer = await window.electron.ipcRenderer.invoke('generate-pdf-data', {
        tempHtmlPath,
        styleContent,
        contentHeight
      })

      if (type === 'pdf') {
        // --- PDF 导出流程 ---
        // 直接调用主进程保存文件对话框
        // @ts-ignore
        const result = await window.electron.ipcRenderer.invoke('save-file', {
          content: pdfBuffer,
          type: 'pdf',
          defaultName: '我的简历.pdf'
        })
        if (result) toast.success('PDF 导出成功！')
      } else {
        // --- PNG 导出流程 ---
        console.log('Starting PNG export...')
        
        // 1. 加载生成的 PDF 数据
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) })
        const pdf = await loadingTask.promise
        const numPages = pdf.numPages
        
        // 2. 预计算画布尺寸
        const scale = 3.0 // 使用 3 倍缩放以保证高清晰度
        let totalHeight = 0
        let maxWidth = 0
        const pageViewports: any[] = []

        // 遍历所有页面计算总高度和最大宽度
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale })
          pageViewports.push({ page, viewport })
          totalHeight += viewport.height
          maxWidth = Math.max(maxWidth, viewport.width)
        }
        
        // 3. 创建主 Canvas
        const canvas = document.createElement('canvas')
        canvas.width = maxWidth
        canvas.height = totalHeight
        const context = canvas.getContext('2d')
        
        if (!context) throw new Error('Could not get canvas context')

        // 4. 逐页渲染并拼接到主 Canvas
        let currentY = 0
        for (const { page, viewport } of pageViewports) {
          // 创建临时 Canvas 渲染单页
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = viewport.width
          pageCanvas.height = viewport.height
          const pageContext = pageCanvas.getContext('2d')
          
          if (!pageContext) continue

          await page.render({
            canvasContext: pageContext,
            viewport
          }).promise
          
          // 将单页内容绘制到主画布对应位置
          context.drawImage(pageCanvas, 0, currentY)
          currentY += viewport.height
          
          // 释放页面资源
          page.cleanup()
        }

        // 5. 转换为 Data URL 并保存
        const dataUrl = canvas.toDataURL('image/png')
        
        // @ts-ignore
        const result = await window.electron.ipcRenderer.invoke('save-file', {
          content: dataUrl,
          type: 'png',
          defaultName: '我的简历.png'
        })
        
        if (result) toast.success('PNG 导出成功！')
      }
    } catch (e) {
      console.error('Export failed:', e)
      toast.error('导出失败，请重试')
    } finally {
      isExporting.value = false
    }
  }

  return { isExporting, isExportMenuOpen, handleExport }
}
