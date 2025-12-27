<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-slate-900 dark:border-slate-800"
  >
    <label class="form-label mb-2 flex justify-between"
      ><span>技能描述</span
      ><span class="text-[10px] text-gray-400 font-normal dark:text-slate-500"
        >建议使用列表符号列出技能点</span
      ></label
    >
    <!-- 确保 list[0] 存在 -->
    <RichTextEditor
      v-if="list.length > 0"
      v-model="list[0].desc"
      placeholder="• JavaSE: 具有扎实的基础...&#10;• JVM: 熟悉内存结构..."
    />
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from '../RichTextEditor.vue'
import { onMounted } from 'vue'

const props = defineProps<{ list: any[] }>()

onMounted(() => {
  if (props.list.length === 0) props.list.push({ desc: '' })
})
</script>

<style scoped>
@import './editor-styles.css';
</style>
