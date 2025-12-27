import { Ref, nextTick } from 'vue'
import { resumeSchema, ModuleDef } from '../config/schema'
import { useToast } from './useToast'

interface StyleConfig {
  fontFamily: string
  fontSize: number
  lineHeight: number
}

interface ProjectData {
  version: string
  resumeData: Record<string, any>
  styleConfig: StyleConfig
  currentTemplateName: string
  schemaOrder: string[]
  moduleStates: Record<string, boolean>
}

/**
 * 项目文件管理 Composable
 * 负责简历工程文件 (.cvjson) 的保存和加载
 */
export function useProjectFile(
  resumeData: Record<string, any>,
  styleConfig: StyleConfig,
  activeSchema: Ref<ModuleDef[]>,
  currentTemplateName: Ref<string>,
  rootKey: Ref<number>,
  moduleStates: Record<string, boolean>
) {
  const toast = useToast()

  /**
   * 保存当前项目状态
   * 将所有核心数据序列化为 JSON 并调用 Electron 保存对话框
   */
  const saveProject = async (): Promise<void> => {
    // 提取当前模块顺序
    const schemaOrder = activeSchema.value.map((m: ModuleDef) => m.id)
    
    const projectData = {
      version: '3.0',
      resumeData,
      styleConfig,
      currentTemplateName: currentTemplateName.value,
      schemaOrder,
      moduleStates
    }
    
    try {
      // @ts-ignore
      await window.electron.ipcRenderer.invoke('save-file', {
        content: JSON.stringify(projectData, null, 2),
        type: 'json',
        defaultName: 'resume-project.cvjson'
      })
      toast.success('工程文件保存成功！')
    } catch (e) {
      console.error('Save failed:', e)
      toast.error('保存失败，请重试')
    }
  }

  /**
   * 加载项目文件
   * 读取 JSON 文件并恢复应用状态
   */
  const loadProject = async (): Promise<void> => {
    try {
      // @ts-ignore
      const data: ProjectData | null = await window.electron.ipcRenderer.invoke('load-project-file')
      if (!data) return

      // --- 数据恢复与合并逻辑 ---

      // 1. 恢复简历内容：使用递归合并，防止覆盖现有结构中可能存在但文件中缺失的新字段
      if (data.resumeData) {
        Object.keys(resumeData).forEach(key => {
          if (data.resumeData[key]) {
            Object.assign(resumeData[key], data.resumeData[key])
          }
        })
      }
      
      // 2. 恢复样式配置
      if (data.styleConfig) Object.assign(styleConfig, data.styleConfig)
      
      // 3. 恢复模板选择
      if (data.currentTemplateName) currentTemplateName.value = data.currentTemplateName
      
      // 4. 恢复模块启用状态
      if (data.moduleStates) Object.assign(moduleStates, data.moduleStates)

      // 5. 恢复模块顺序
      if (data.schemaOrder && Array.isArray(data.schemaOrder)) {
        // 按照保存的顺序重组 activeSchema
        const restored = data.schemaOrder
          .map((id: string) => resumeSchema.find((m) => m.id === id))
          .filter(Boolean)
        
        // 检查是否有新版本新增的模块未在保存文件中，将其追加到末尾
        const missing = resumeSchema.filter(m => !data.schemaOrder.includes(m.id))
        
        activeSchema.value = [...(restored as ModuleDef[]), ...missing]
      }

      // 6. 强制刷新视图
      rootKey.value++
      await nextTick()
      toast.success('项目加载成功！')
    } catch (e) {
      console.error('Load failed:', e)
      toast.error('加载项目文件失败，请检查文件是否损坏。')
    }
  }

  return { saveProject, loadProject }
}
