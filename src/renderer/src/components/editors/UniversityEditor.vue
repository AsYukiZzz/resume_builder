<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 dark:bg-slate-900 dark:border-slate-800"
  >
    <div>
      <label class="form-label">学校名称</label>
      <input v-model="modelValue.school" class="form-input" placeholder="请输入学校名称" />
    </div>
    <div>
      <label class="form-label mb-2">校徽</label>
      <button
        @click="triggerSchoolLogoUpload"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 mb-3"
      >
        选择校徽
      </button>
      <div
        v-if="modelValue.logo"
        class="relative w-48 h-20 border border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center overflow-hidden group dark:bg-slate-800 dark:border-slate-700"
      >
        <img :src="modelValue.logo" class="h-full object-contain p-2" />
        <div
          @click="modelValue.logo = ''"
          class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Trash2 class="text-white" :size="20" />
        </div>
      </div>
      <input
        type="file"
        ref="schoolLogoInput"
        accept="image/*"
        class="hidden"
        @change="handleSchoolLogoChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{ modelValue: any }>()
const schoolLogoInput = ref<HTMLInputElement | null>(null)

const triggerSchoolLogoUpload = () => schoolLogoInput.value?.click()
const handleSchoolLogoChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (props.modelValue.logo = e.target?.result as string)
    reader.readAsDataURL(file)
  }
  input.value = ''
}
</script>

<style scoped>
@import './editor-styles.css';
</style>
