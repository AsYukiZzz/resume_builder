<template>
  <div
    class="rich-text-container group border border-gray-200 rounded-xl bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 overflow-hidden flex flex-col dark:bg-slate-800 dark:border-slate-700"
  >
    <!-- 工具栏 -->
    <div
      v-if="editor"
      class="toolbar flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-100 bg-white dark:bg-slate-800 dark:border-slate-700"
    >
      <!-- 撤销/重做 -->
      <div class="flex gap-0.5 border-r border-gray-200 pr-2 mr-1 dark:border-slate-700">
        <button
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          class="toolbar-btn"
          title="撤销"
        >
          <Undo :size="15" />
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          class="toolbar-btn"
          title="重做"
        >
          <Redo :size="15" />
        </button>
      </div>

      <!-- 基础格式 -->
      <button
        @click="editor.chain().focus().toggleBold().run()"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('bold') }"
        title="加粗"
      >
        <Bold :size="15" />
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('italic') }"
        title="斜体"
      >
        <Italic :size="15" />
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('underline') }"
        title="下划线"
      >
        <UnderlineIcon :size="15" />
      </button>

      <div class="w-px h-4 bg-gray-200 mx-1 dark:bg-slate-700"></div>

      <!-- 列表 -->
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        title="无序列表"
      >
        <List :size="15" />
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        title="有序列表"
      >
        <ListOrdered :size="15" />
      </button>

      <!-- 清除格式 -->
      <button
        @click="editor.chain().focus().unsetAllMarks().clearNodes().run()"
        class="toolbar-btn ml-auto text-gray-400 hover:text-red-500"
        title="清除格式"
      >
        <RemoveFormatting :size="15" />
      </button>
    </div>

    <!-- 编辑区域 -->
    <editor-content :editor="editor" class="flex-1 overflow-y-auto min-h-[160px] cursor-text" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { watch, onBeforeUnmount } from 'vue'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  RemoveFormatting
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: props.placeholder || '请输入内容...' })
  ],
  editorProps: {
    attributes: {
      class:
        'prose prose-sm max-w-none focus:outline-none p-4 text-gray-700 leading-relaxed min-h-[160px] dark:text-slate-200'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue, { emitUpdate: false })
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.toolbar-btn {
  @apply p-1.5 rounded-md text-gray-500 transition-all;
  @apply hover:bg-gray-100 hover:text-blue-600;
  @apply disabled:opacity-30 disabled:cursor-not-allowed;
  @apply dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400;
}

.toolbar-btn.is-active {
  @apply bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400;
}

/* Tiptap 内容样式定制 */
:deep(.prose ul) {
  list-style-type: disc;
  padding-left: 1.4em;
  margin: 0.5em 0;
}
:deep(.prose ol) {
  list-style-type: decimal;
  padding-left: 1.4em;
  margin: 0.5em 0;
}
:deep(.prose p) {
  margin: 0.3em 0;
}
:deep(.prose p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #9ca3af;
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
