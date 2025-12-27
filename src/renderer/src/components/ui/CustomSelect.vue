<template>
  <div class="relative" ref="containerRef">
    <!-- 触发按钮 -->
    <button
      @click="toggle"
      class="flex items-center justify-between w-full h-9 px-3 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-bold text-slate-700 transition-all hover:border-indigo-400 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500/10 active:scale-[0.98] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      :class="{ 'border-indigo-500 ring-2 ring-indigo-500/10 dark:border-indigo-500 dark:ring-indigo-500/20': isOpen }"
    >
      <div class="flex items-center truncate mr-2">
        <span v-if="label" class="text-slate-400 font-medium mr-1.5 shrink-0 select-none dark:text-slate-400">{{
          label
        }}</span>
        <span class="truncate">{{ displayValue }}</span>
      </div>
      <ChevronDown
        :size="12"
        class="text-gray-400 transition-transform duration-200 shrink-0 dark:text-slate-400"
        :class="{ 'rotate-180 text-indigo-500 dark:text-indigo-400': isOpen }"
      />
    </button>

    <!-- 下拉菜单 (带动画) -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full min-w-[120px] mt-1.5 origin-top-right bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden ring-1 ring-black/5 dark:bg-slate-800 dark:border-slate-700 dark:ring-white/5"
        :class="align === 'right' ? 'right-0' : 'left-0'"
      >
        <div class="max-h-[240px] overflow-y-auto custom-scrollbar">
          <div
            v-for="option in normalizedOptions"
            :key="option.value"
            @click="select(option.value)"
            class="group flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors"
            :class="
              modelValue === option.value
                ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
            "
          >
            <span>{{ option.label }}</span>
            <Check v-if="modelValue === option.value" :size="12" class="text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

// 定义 Props
const props = defineProps<{
  modelValue: string | number
  options: (string | number | { label: string; value: string | number })[]
  suffix?: string // 例如 "px" 或 "倍"
  align?: 'left' | 'right' // 下拉对齐方式
  label?: string // 按钮内显示的标签前缀
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// 统一化选项数据结构
const normalizedOptions = computed(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return opt
    }
    return { label: `${opt}${props.suffix || ''}`, value: opt }
  })
})

// 当前显示的文本
const displayValue = computed(() => {
  const selected = normalizedOptions.value.find((o) => o.value === props.modelValue)
  return selected ? selected.label : props.modelValue
})

const toggle = () => (isOpen.value = !isOpen.value)

const select = (value: string | number) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
/* 暗色模式滚动条适配 */
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155; /* slate-700 */
}
</style>
