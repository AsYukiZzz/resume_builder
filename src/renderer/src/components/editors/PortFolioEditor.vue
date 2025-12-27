<template>
  <div class="space-y-5">
    <div
      v-for="(item, idx) in list"
      :key="idx"
      class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all relative group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500/50"
    >
      <div class="index-badge">{{ idx + 1 }}</div>
      <button @click="removeItem(idx)" class="delete-btn"><Trash2 :size="16" /></button>

      <!-- 布局：左侧文字表单，右侧图片上传 -->
      <div class="flex gap-6 mb-6">
        <!-- 左侧：名称 + 链接 (占大部分宽度) -->
        <div class="flex-1 grid grid-cols-2 gap-5">
          <div class="col-span-1">
            <label class="form-label">作品名称</label>
            <input v-model="item.name" class="form-input" placeholder="个人 Blog" />
          </div>
          <div class="col-span-1">
            <label class="form-label">作品链接</label>
            <input v-model="item.link" class="form-input" placeholder="https://..." />
          </div>
        </div>

        <!-- 右侧：作品图片上传 (固定宽度) -->
        <div class="w-24 shrink-0">
          <label class="form-label">作品图片</label>
          <div
            @click="triggerUpload(idx)"
            class="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer transition overflow-hidden relative group dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-indigo-500"
          >
            <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
            <div v-else class="flex flex-col items-center gap-1">
              <Image :size="20" />
            </div>

            <!-- 删除遮罩 -->
            <div
              v-if="item.image"
              class="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 :size="16" @click.stop="item.image = ''" />
            </div>
          </div>
          <!-- 隐藏的文件输入框 -->
          <input
            type="file"
            :ref="
              (el) => {
                if (el) fileInputs[idx] = el as HTMLInputElement
              }
            "
            accept="image/*"
            class="hidden"
            @change="(e) => handleFileChange(e, item)"
          />
        </div>
      </div>

      <!-- 下方：详情描述 -->
      <div>
        <label class="form-label">作品详情</label>
        <RichTextEditor v-model="item.desc" placeholder="简短明确地写清楚自己的作品介绍..." />
      </div>
    </div>

    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加作品
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Plus, Image } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'
import { useToast } from '../../composables/useToast'

const props = defineProps<{ list: any[] }>()
const fileInputs = ref<HTMLInputElement[]>([])
const toast = useToast()

const triggerUpload = (idx: number) => {
  fileInputs.value[idx]?.click()
}

const handleFileChange = (e: Event, item: any) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      toast.warning('图片大小不能超过 2MB，请压缩后上传')
      input.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => (item.image = e.target?.result as string)
    reader.readAsDataURL(file)
  }
  input.value = ''
}

const addItem = () => props.list.push({ name: '', link: '', image: '', desc: '' })
const removeItem = (idx: number) => props.list.splice(idx, 1)
</script>

<style scoped>
@import './editor-styles.css';
</style>
