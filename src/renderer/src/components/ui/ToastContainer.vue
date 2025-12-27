<template>
  <div
    class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4"
  >
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 p-4 flex items-start gap-3 ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-3xl"
      >
        <!-- Icon based on type -->
        <div class="shrink-0 mt-0.5">
          <CheckCircle v-if="toast.type === 'success'" class="text-emerald-500" :size="20" />
          <XCircle v-else-if="toast.type === 'error'" class="text-red-500" :size="20" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="text-amber-500" :size="20" />
          <Info v-else class="text-blue-500" :size="20" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight mb-0.5">
            {{ getTitle(toast.type) }}
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 break-words leading-relaxed">
            {{ toast.message }}
          </p>
        </div>

        <button
          @click="removeToast(toast.id)"
          class="shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()

const getTitle = (type: string) => {
  switch (type) {
    case 'success':
      return '操作成功'
    case 'error':
      return '发生错误'
    case 'warning':
      return '提示'
    default:
      return '通知'
  }
}
</script>
