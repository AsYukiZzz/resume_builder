import { reactive, ref, computed, markRaw } from 'vue'
import { resumeSchema as originalSchema } from '../config/schema'
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  FolderGit2,
  School,
  Award,
  Image,
  Microscope,
  LayoutGrid,
  FileText
} from 'lucide-vue-next'

// 图标映射表：将模块 ID 映射到 Lucide 图标组件
const icons = {
  profile: markRaw(User),
  education: markRaw(GraduationCap),
  work: markRaw(Briefcase),
  skill: markRaw(Wrench),
  project: markRaw(FolderGit2),
  university: markRaw(School),
  award: markRaw(Award),
  portfolio: markRaw(Image),
  research: markRaw(Microscope),
  other: markRaw(LayoutGrid)
}

/**
 * 核心数据管理 Composable
 * 负责管理简历数据、模块状态、Schema 配置以及当前选中的模块
 */
export function useData() {
  // 初始化 Schema，为每个模块注入对应的图标
  const resumeSchema = originalSchema.map((mod) => ({
    ...mod,
    // @ts-ignore: 忽略索引类型检查，确保图标存在时使用对应图标，否则使用默认图标
    icon: icons[mod.id] || markRaw(FileText)
  }))

  /**
   * 生成初始状态
   * 根据 Schema 结构自动生成空的数据对象和默认开启的模块状态
   */
  const getInitialState = () => {
    const data: Record<string, any> = { profile: {}, university: {} }
    // 默认开启基本信息和教育背景
    const states: Record<string, boolean> = { profile: true, university: true }

    resumeSchema.forEach((mod) => {
      // 跳过已经手动处理的 profile 和 university
      if (mod.id !== 'profile' && mod.id !== 'university') {
        states[mod.id] = true // 其他模块默认开启
        
        // 根据字段定义生成空数据项
        const defaultItem: Record<string, any> = {}
        mod.fields.forEach((field) => {
          defaultItem[field.key] = ''
        })

        // 根据模块类型初始化数据结构（列表或对象）
        if (mod.type === 'list') data[mod.id] = [defaultItem]
        else data[mod.id] = defaultItem
      }
    })
    return { data, states }
  }

  const { data: initialData, states: initialStates } = getInitialState()

  // 简历内容数据（响应式）
  const resumeData = reactive(JSON.parse(JSON.stringify(initialData)))
  
  // 模块启用状态（响应式）
  const moduleStates = reactive(JSON.parse(JSON.stringify(initialStates)))
  
  // 当前活动的 Schema（支持排序）
  const activeSchema = ref([...resumeSchema])
  
  // 当前选中的编辑器 Tab ID
  const currentTab = ref('profile')
  
  // 当前选中的模块定义
  const currentModule = computed(() => activeSchema.value.find((m) => m.id === currentTab.value))

  /**
   * 重置简历数据
   * 恢复所有数据到初始空白状态，并重置模块顺序和选中状态
   */
  const resetResume = () => {
    const { data, states } = getInitialState()
    
    // 重置数据：先清空再赋值，保持 reactive 引用不变
    Object.keys(resumeData).forEach(key => delete resumeData[key])
    Object.assign(resumeData, data)
    
    // 重置模块状态
    Object.keys(moduleStates).forEach(key => delete moduleStates[key])
    Object.assign(moduleStates, states)
    
    // 重置 Schema 顺序
    activeSchema.value = [...resumeSchema]
    
    // 重置当前 Tab 到基本信息
    currentTab.value = 'profile'
  }

  return { resumeData, moduleStates, activeSchema, currentTab, currentModule, resetResume }
}
