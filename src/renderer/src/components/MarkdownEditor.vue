<template>
  <div
    class="group relative border border-gray-200 rounded-xl bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 overflow-hidden"
  >
    <v-md-editor
      v-model="content"
      :placeholder="placeholder"
      height="360px"
      mode="edit"
      left-toolbar="undo redo | bold italic | ul ol | h hr"
      right-toolbar="preview"
      @change="handleChange"
    ></v-md-editor>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])
const content = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== content.value) {
      content.value = newVal || ''
    }
  }
)

const handleChange = (text: string) => {
  emit('update:modelValue', text)
}
</script>

<style scoped>
/* 1. 核心容器与工具栏 */
:deep(.v-md-editor) {
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
}

:deep(.v-md-editor__toolbar) {
  border-bottom: 1px solid #f3f4f6 !important;
  background-color: #fff !important;
  padding: 6px 12px !important;
  min-height: 42px !important;
}

:deep(.v-md-editor__toolbar-item) {
  color: #9ca3af !important;
  border-radius: 4px !important;
  transition: all 0.2s;
}
:deep(.v-md-editor__toolbar-item:hover) {
  background-color: #eff6ff !important;
  color: #2563eb !important;
}

/* 2. 上下分栏布局 */
:deep(.v-md-editor__main) {
  flex-direction: column !important;
}

:deep(.v-md-editor__editor-wrapper) {
  width: 100% !important;
  height: 50% !important;
  border-right: none !important;
  position: relative;
}
:deep(.v-md-editor__editor-wrapper::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, #e5e7eb 50%, transparent 50%);
  background-size: 8px 1px;
  z-index: 10;
}

:deep(.v-md-editor__preview-wrapper) {
  width: 100% !important;
  height: 50% !important;
  background-color: #fafafa !important;
}

/* 3. 字体与排版 */
:deep(.v-md-textarea-editor textarea) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
  padding: 16px !important;
  color: #374151 !important;
}

:deep(.vuepress-markdown-body) {
  padding: 16px !important;
  font-family: ui-sans-serif, system-ui, sans-serif !important;
  font-size: 13.5px !important;
  color: #1f2937 !important;
  background-color: transparent !important;
}

:deep(.vuepress-markdown-body ul) {
  list-style-type: disc !important;
  padding-left: 1.25rem !important;
  margin: 0.25rem 0 !important;
}
:deep(.vuepress-markdown-body ol) {
  list-style-type: decimal !important;
  padding-left: 1.25rem !important;
  margin: 0.25rem 0 !important;
}
:deep(.vuepress-markdown-body p) {
  margin: 0.25rem 0 !important;
  line-height: 1.6;
}
:deep(.vuepress-markdown-body strong) {
  color: #111827 !important;
  font-weight: 600 !important;
}

/* 4. 滚动条美化 */
:deep(.v-md-editor__statusbar) {
  display: none;
}
:deep(::-webkit-scrollbar) {
  width: 4px;
  height: 4px;
}
:deep(::-webkit-scrollbar-track) {
  background: transparent;
}
:deep(::-webkit-scrollbar-thumb) {
  background: #e5e7eb;
  border-radius: 2px;
}
:deep(::-webkit-scrollbar-thumb:hover) {
  background: #d1d5db;
}
</style>
