import { reactive, computed, ref } from 'vue'
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'
import TemplateClassic from '../components/templates/TemplateClassic.vue'
import TemplateModern from '../components/templates/TemplateModern.vue'
import TemplateProfessional from '../components/templates/TemplateProfessional.vue'
import TemplateMinimal from '../components/templates/TemplateMinimal.vue'
import TemplateCreative from '../components/templates/TemplateCreative.vue'

/**
 * 样式配置 Composable
 * 提供字体、字号、行距的选项配置
 */
function useTemplateStyles() {
  const styleConfig = reactive({ fontFamily: 'sans-serif', fontSize: 14, lineHeight: 1.5 })
  
  const fontOptions = [
    { label: '默认黑体', value: 'sans-serif' },
    { label: '微软雅黑', value: "'Microsoft YaHei', sans-serif" },
    { label: '宋体', value: "'SimSun', serif" },
    { label: '仿宋', value: "'FangSong', serif" },
    { label: '楷体', value: "'KaiTi', serif" },
    { label: '隶书', value: "'LiSu', serif" },
    { label: '幼圆', value: "'YouYuan', sans-serif" },
    { label: 'Arial', value: "Arial, sans-serif" },
    { label: 'Times New Roman', value: "'Times New Roman', serif" },
    { label: 'Georgia', value: "Georgia, serif" },
    { label: 'Verdana', value: "Verdana, sans-serif" },
    { label: 'Roboto', value: "'Roboto', sans-serif" },
    { label: 'Open Sans', value: "'Open Sans', sans-serif" }
  ]
  
  const fontSizeOptions = [
    { label: '12px', value: 12 },
    { label: '13px', value: 13 },
    { label: '14px', value: 14 },
    { label: '15px', value: 15 },
    { label: '16px', value: 16 },
    { label: '18px', value: 18 },
    { label: '20px', value: 20 },
    { label: '22px', value: 22 },
    { label: '24px', value: 24 }
  ]
  
  const lineHeightOptions = [
    { label: '1.0', value: 1.0 },
    { label: '1.2', value: 1.2 },
    { label: '1.3', value: 1.3 },
    { label: '1.4', value: 1.4 },
    { label: '1.5', value: 1.5 },
    { label: '1.6', value: 1.6 },
    { label: '1.8', value: 1.8 },
    { label: '2.0', value: 2.0 },
    { label: '2.5', value: 2.5 },
    { label: '3.0', value: 3.0 }
  ]
  
  return { styleConfig, fontOptions, fontSizeOptions, lineHeightOptions }
}

/**
 * 模板管理 Composable
 * 负责模板的注册、切换和动态导入
 */
export function useTemplate() {
  // 注册内置模板
  const templates = reactive<Record<string, any>>({
    Professional: TemplateProfessional,
    Classic: TemplateClassic,
    Modern: TemplateModern,
    Minimal: TemplateMinimal,
    Creative: TemplateCreative
  })
  
  const currentTemplateName = ref('Professional')
  
  // 模板选项列表
  const templateOptions = computed(() => [
    { label: '商务简约', value: 'Professional' },
    { label: '经典白底', value: 'Classic' },
    { label: '现代双栏', value: 'Modern' },
    { label: '极简主义', value: 'Minimal' },
    { label: '创意设计', value: 'Creative' }
  ])

  // vue3-sfc-loader 配置，用于动态加载用户导入的 .vue 模板文件
  const loaderOptions = {
    moduleCache: { vue: Vue },
    getFile: () => '',
    addStyle: (c: string) => {
      const s = document.createElement('style')
      s.textContent = c
      document.head.appendChild(s)
    }
  }

  // 导入自定义模板（.vue 文件）
  const handleImportTemplate = async (): Promise<void> => {
    try {
      // @ts-ignore: electron API is injected
      const result = await window.electron.ipcRenderer.invoke('import-template')
      if (result) {
        const loaded = await loadModule(`${result.name}.vue`, {
          ...loaderOptions,
          getFile: () => result.content
        })
        templates[`Custom-${result.name}`] = loaded
        currentTemplateName.value = `Custom-${result.name}`
      }
    } catch (e) {
      console.error('Template import failed:', e)
    }
  }

  const styles = useTemplateStyles()

  return {
    templates,
    currentTemplateName,
    templateOptions,
    handleImportTemplate,
    ...styles
  }
}
