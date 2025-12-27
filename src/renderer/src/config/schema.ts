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
  LayoutGrid
} from 'lucide-vue-next'

export type FieldType = 'text' | 'textarea' | 'select'

/**
 * 字段定义接口
 * 用于描述编辑器中的单个输入项
 */
export interface FieldDef {
  key: string // 数据键名
  label: string // 显示标签
  type: FieldType // 输入框类型
  placeholder?: string
  options?: string[] // 下拉选项
  colSpan?: number // 栅格占据列数 (1-12)
}

/**
 * 模块定义接口
 * 描述简历的一个功能模块（如教育经历、工作经历等）
 */
export interface ModuleDef {
  id: string // 唯一标识符
  name: string // 模块显示名称
  icon: any // 侧边栏图标组件
  /**
   * 模块类型：
   * - 'static': 静态对象结构（如基本信息），只有一份数据
   * - 'list': 列表数组结构（如工作经历），可以包含多条数据
   */
  type: 'static' | 'list'
  fields: FieldDef[] // 动态字段配置（主要用于通用列表模块）
}

/**
 * 简历数据结构定义 (Schema)
 * 定义了简历包含的所有模块及其默认顺序和配置
 */
export const resumeSchema: ModuleDef[] = [
  {
    id: 'profile',
    name: '基本信息',
    icon: User,
    type: 'static',
    fields: [] // 基本信息使用专用编辑器，不依赖此处配置
  },
  {
    id: 'education',
    name: '教育经历',
    icon: GraduationCap,
    type: 'list',
    fields: []
  },
  {
    id: 'work',
    name: '工作经历',
    icon: Briefcase,
    type: 'list',
    fields: []
  },
  {
    id: 'project',
    name: '项目经历',
    icon: FolderGit2,
    type: 'list',
    fields: []
  },
  {
    id: 'research',
    name: '研究经历',
    icon: Microscope,
    type: 'list',
    fields: []
  },
  {
    id: 'other',
    name: '其他经历',
    icon: LayoutGrid,
    type: 'list',
    fields: []
  },
  {
    id: 'portfolio',
    name: '个人作品',
    icon: Image,
    type: 'list',
    fields: []
  },
  {
    id: 'award',
    name: '荣誉奖项',
    icon: Award,
    type: 'list',
    fields: []
  },
  {
    id: 'skill',
    name: '专业技能',
    icon: Wrench,
    type: 'list',
    fields: []
  },
  {
    id: 'university',
    name: '大学信息',
    icon: School,
    type: 'static',
    fields: []
  }
]
