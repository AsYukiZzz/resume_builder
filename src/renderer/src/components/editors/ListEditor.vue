<template>
  <div class="space-y-5">
    <div
      v-for="(item, idx) in list"
      :key="idx"
      class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all relative group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500/50"
    >
      <!-- 序号 -->
      <div class="index-badge">{{ idx + 1 }}</div>

      <!-- 删除按钮 -->
      <button @click="removeItem(idx)" class="delete-btn">
        <Trash2 :size="16" />
      </button>

      <!-- 动态表单 -->
      <div class="grid grid-cols-12 gap-x-4 gap-y-5">
        <div v-for="field in fields" :key="field.key" :class="colSpanMap[field.colSpan || 12]">
          <label class="form-label">{{ field.label }}</label>

          <!-- 文本输入 -->
          <input
            v-if="field.type === 'text'"
            v-model="item[field.key]"
            class="form-input"
            :placeholder="field.placeholder"
          />

          <!-- 下拉框 -->
          <div v-if="field.type === 'select'" class="relative group/select">
            <select
              v-model="item[field.key]"
              class="form-input appearance-none cursor-pointer pr-8"
            >
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <ChevronDown
              :size="14"
              class="absolute right-3 top-3 text-gray-400 group-hover/select:text-indigo-500 transition-colors pointer-events-none dark:text-slate-500"
            />
          </div>

          <!-- 富文本 -->
          <RichTextEditor
            v-if="field.type === 'textarea'"
            v-model="item[field.key]"
            :placeholder="field.placeholder"
          />
        </div>
      </div>
    </div>

    <!-- 添加按钮 (注意这里手动加了 group 类) -->
    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加{{ moduleName }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, ChevronDown, Plus } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'

// --- Props 定义 ---
const props = defineProps<{
  list: any[]          // 数据列表 (双向绑定)
  fields: any[]        // 字段定义配置 (来自 Schema)
  moduleName: string   // 模块名称 (用于按钮显示)
}>()

// --- 栅格布局映射 ---
// 将 colSpan 数值映射为 Tailwind Grid 类名
const colSpanMap: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12'
}

// --- Actions ---

/**
 * 添加新条目
 * 根据 fields 配置自动初始化每个字段为空字符串
 */
const addItem = () => {
  const newItem: Record<string, any> = {}
  props.fields.forEach((field) => {
    newItem[field.key] = ''
  })
  props.list.push(newItem)
}

/**
 * 删除条目
 * @param idx 条目索引
 */
const removeItem = (idx: number) => {
  props.list.splice(idx, 1)
}
</script>

<style scoped>
@import './editor-styles.css';
</style>
