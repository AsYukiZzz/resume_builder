import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { writeFile, readFile, unlink, readdir } from 'fs/promises'
import os from 'os'
import path from 'path'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => mainWindow.show())
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.resume.builder')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ============================================================
  //  IPC 通信
  // ============================================================

  // 1. 写入临时文件 (保持不变)
  ipcMain.handle('write-temp-file', async (_event, htmlContent: string) => {
    const tempDir = os.tmpdir()
    const tempHtmlPath = path.join(tempDir, `resume_${Date.now()}.html`)
    await writeFile(tempHtmlPath, htmlContent)
    return tempHtmlPath
  })

  // ============================================================
  //  核心修复：在 PDF 生成前，读取并内联 CSS
  // ============================================================
  ipcMain.handle('generate-pdf-data', async (_event, { tempHtmlPath, styleContent, contentHeight }) => {
    const printWindow = new BrowserWindow({ show: false, webPreferences: { webSecurity: false } })

    let styles = styleContent || ''

    // 如果前端没有传递样式（比如旧版本调用），尝试从文件读取作为后备
    if (!styles) {
      // 读取最终编译出的 CSS 文件
      let cssPath = ''
      if (is.dev) {
        // 开发环境下，直接读取源文件往往无效（因为包含 @tailwind 指令），
        // 但如果没有前端传来的样式，我们也只能死马当活马医
        cssPath = join(__dirname, '../../src/renderer/src/assets/main.css')
      } else {
        // 生产环境：查找 assets 目录下唯一的 .css 文件 (vite 打包后文件名带有 hash)
        const assetsDir = join(__dirname, '../renderer/assets')
        try {
          const files = await readdir(assetsDir)
          const cssFile = files.find((f) => f.endsWith('.css'))
          if (cssFile) {
            cssPath = join(assetsDir, cssFile)
          }
        } catch (e) {
          console.error('Error finding CSS file:', e)
        }
      }

      if (cssPath) {
        try {
          styles = await readFile(cssPath, 'utf-8')
        } catch (e) {
          console.warn('Could not load main CSS for PDF export. Using inline styles only.', e)
        }
      }
    }

    const htmlWithStyle = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; }
            ${styles}
          </style>
        </head>
        <body>
          <div id="resume-preview">${await readFile(tempHtmlPath, 'utf-8')}</div>
        </body>
      </html>
    `

    // 修复：先定义 Promise 并监听事件，再加载 URL，防止事件丢失
    // 同时增加超时处理
    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      let isResolved = false
      const timeout = setTimeout(() => {
        if (!isResolved) {
          isResolved = true
          reject(new Error('PDF generation timed out (15s)'))
        }
      }, 15000)

      printWindow.webContents.on('did-finish-load', async () => {
        if (isResolved) return
        // 清除超时
        clearTimeout(timeout)
        
        try {
          const pdfOptions: any = {
            printBackground: true,
            margins: { top: 0, bottom: 0, left: 0, right: 0 }
          }
          
          if (contentHeight) {
            // 自定义高度模式 (用于 PNG 长图)
            // 将像素转换为微米 (1 inch = 25.4mm = 25400 microns, 96px = 1 inch)
            // A4 width (210mm) = 210000 microns
            // height = (px / 96) * 25400
            // 额外增加一点高度缓冲防止内容被切
            const heightMicrons = Math.ceil((contentHeight / 96) * 25400) + 1000
            pdfOptions.pageSize = { width: 210000, height: heightMicrons }
          } else {
            pdfOptions.pageSize = 'A4'
          }

          const pdfData = await printWindow.webContents.printToPDF(pdfOptions)
          isResolved = true
          resolve(pdfData)
        } catch (error) {
          if (!isResolved) {
            isResolved = true
            reject(error)
          }
        }
      })

      printWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
        if (!isResolved) {
          clearTimeout(timeout)
          isResolved = true
          reject(new Error(`Failed to load PDF page: ${errorDescription} (${errorCode})`))
        }
      })
    })

    // 启动加载
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlWithStyle)}`)

    // 等待结果
    try {
      const pdfData = await pdfPromise
      printWindow.close()
      await unlink(tempHtmlPath)
      return pdfData
    } catch (error) {
      printWindow.close()
      try {
        await unlink(tempHtmlPath)
      } catch (_) {}
      console.error('PDF Generation Error:', error)
      throw error
    }
  })

  // 新增：PNG 生成 Handler (主进程截图)
  ipcMain.handle('generate-png-data', async (_event, { tempHtmlPath, styleContent, width, height }) => {
    // 限制最大高度，防止内存溢出或窗口创建失败 (Windows 限制通常在 32k 左右，安全起见设为 8000)
    const safeHeight = Math.min(height + 50, 8000) 
    const safeWidth = Math.max(width + 20, 800)

    const captureWindow = new BrowserWindow({
      show: false,
      width: safeWidth,
      height: safeHeight,
      useContentSize: true, // 确保 width/height 是视口大小
      webPreferences: {
        webSecurity: false,
        offscreen: true // 启用离屏渲染，性能更好且不会闪烁
      }
    })

    let styles = styleContent || ''
    // 样式加载逻辑复用 (简略版，因为通常 styleContent 已经足够)
    if (!styles) {
        // ... (省略备用样式加载逻辑，假设前端传递的 styleContent 足够)
    }

    const htmlWithStyle = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            /* 关键修改：允许 body 自由撑开，去除 overflow: hidden 和 height 限制 */
            body { margin: 0; padding: 20px; background: white; width: fit-content; }
            #resume-preview { width: 100%; }
            ${styles}
          </style>
        </head>
        <body>
          <div id="resume-preview">${await readFile(tempHtmlPath, 'utf-8')}</div>
        </body>
      </html>
    `

    const pngPromise = new Promise<Buffer>((resolve, reject) => {
        let isResolved = false
        const timeout = setTimeout(() => {
            if (!isResolved) {
                isResolved = true
                reject(new Error('PNG generation timed out'))
            }
        }, 15000)

        captureWindow.webContents.on('did-finish-load', async () => {
            if (isResolved) return
            clearTimeout(timeout)
            
            try {
                // 关键修复：动态计算实际内容高度并调整窗口大小，确保截取完整内容
                // 获取 body 的实际渲染高度和宽度
                const bodyHeight = await captureWindow.webContents.executeJavaScript(`
                    Math.max(
                        document.body.scrollHeight, 
                        document.documentElement.scrollHeight,
                        document.querySelector('#resume-preview').scrollHeight
                    )
                `)
                const bodyWidth = await captureWindow.webContents.executeJavaScript(`document.body.scrollWidth`)
                
                // 增加一些 padding 缓冲，防止边缘被切
                const finalHeight = Math.ceil(bodyHeight) + 40
                const finalWidth = Math.max(Math.ceil(bodyWidth), safeWidth)
                
                // 动态调整窗口大小以包裹所有内容
                // 注意：在离屏模式下，这会调整渲染 Surface 的大小
                captureWindow.setSize(finalWidth, finalHeight)
                
                // 等待重排和渲染 (给一点时间让 GPU 缓冲区更新)
                await new Promise(r => setTimeout(r, 500))
                
                // 截图
                const image = await captureWindow.webContents.capturePage()
                const pngBuffer = image.toPNG()
                
                isResolved = true
                resolve(pngBuffer)
            } catch (err) {
                if (!isResolved) {
                    isResolved = true
                    reject(err)
                }
            }
        })

        captureWindow.webContents.on('did-fail-load', (_event, _errorCode, errorDescription) => {
             if (!isResolved) {
                isResolved = true
                reject(new Error(`Failed to load PNG page: ${errorDescription}`))
             }
        })
    })

    captureWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlWithStyle)}`)

    try {
        const buffer = await pngPromise
        captureWindow.close()
        return buffer
    } catch (err) {
        captureWindow.close()
        console.error('PNG Generation Error:', err)
        throw err
    }
  })

  // 3. 通用文件保存
  ipcMain.handle('save-file', async (_event, { content, type, defaultName }) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters:
        type === 'pdf'
          ? [{ name: 'PDF Document', extensions: ['pdf'] }]
          : type === 'png'
            ? [{ name: 'PNG Image', extensions: ['png'] }]
            : [{ name: 'Resume Project', extensions: ['cvjson'] }]
    })

    if (canceled || !filePath) return false

    if (type === 'png' && typeof content === 'string') {
       // 兼容旧逻辑 (Base64 String)
       const base64Data = content.replace(/^data:image\/\w+;base64,/, '')
       await writeFile(filePath, Buffer.from(base64Data, 'base64'))
    } else {
       // Buffer (PDF 或 新版 PNG) 或 String (JSON)
       await writeFile(filePath, content)
    }
    return true
  })

  // 4. 读取工程文件
  ipcMain.handle('load-project-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Resume Project', extensions: ['cvjson'] }]
    })

    if (canceled || filePaths.length === 0) return null

    try {
      const content = await readFile(filePaths[0], 'utf-8')
      return JSON.parse(content)
    } catch (e) {
      console.error('Failed to read project file:', e)
      return null
    }
  })

  // 5. 导入 Vue 模板
  ipcMain.handle('import-template', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Vue Component', extensions: ['vue'] }]
    })

    if (canceled || filePaths.length === 0) return null

    try {
      const content = await readFile(filePaths[0], 'utf-8')
      const name = path.basename(filePaths[0], '.vue')
      return { name, content }
    } catch (e) {
      console.error('Failed to import template:', e)
      return null
    }
  })

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
