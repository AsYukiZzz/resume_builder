<template>
  <div class="space-y-5">
    <div
      v-for="(item, idx) in list"
      :key="idx"
      class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all relative group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500/50"
    >
      <div class="index-badge">{{ idx + 1 }}</div>
      <button @click="removeItem(idx)" class="delete-btn"><Trash2 :size="16" /></button>

      <div class="grid grid-cols-12 gap-x-4 gap-y-5 mb-5">
        <!-- 第一行：公司 (6) + 部门 (6) -->
        <div class="col-span-6">
          <label class="form-label">公司名称</label>
          <div class="form-input-group group/input">
            <input v-model="item.company" class="form-input pr-8" placeholder="公司名称" />
            <XCircle v-if="item.company" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.company = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">所属部门</label>
          <div class="form-input-group group/input">
            <input v-model="item.department" class="form-input pr-8" placeholder="部门名称" />
            <XCircle v-if="item.department" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.department = ''" />
          </div>
        </div>

        <!-- 第二行：职位 (6) + 城市 (6) -->
        <div class="col-span-6">
          <label class="form-label">担任职位</label>
          <div class="form-input-group group/input">
            <input v-model="item.role" class="form-input pr-8" placeholder="职位名称" />
            <XCircle v-if="item.role" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.role = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">所在城市</label>
          <div class="form-input-group group/input">
            <input v-model="item.city" class="form-input pr-8" placeholder="城市" />
            <XCircle v-if="item.city" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.city = ''" />
          </div>
        </div>

        <!-- 第三行：在岗时间 (独占一行，防止挤压) -->
        <div class="col-span-12">
          <label class="form-label">在岗时间</label>
          <div class="flex items-center gap-3">
            <input
              type="month"
              v-model="item.dateStart"
              @change="updateDate(item)"
              class="form-input"
            />
            <span class="text-gray-400 font-bold dark:text-slate-500">-</span>
            <input
              type="month"
              v-model="item.dateEnd"
              @change="updateDate(item)"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- 第四行：工作详情 (无按钮版) -->
      <div>
        <label class="form-label">工作详情</label>
        <RichTextEditor v-model="item.desc" placeholder="详细描述你的工作内容、职责和产出..." />
      </div>
    </div>

    <!-- 添加按钮 -->
    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加工作经历
    </button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Plus, XCircle } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'

const props = defineProps<{ list: any[] }>()

const updateDate = (item: any) => {
  if (item.dateStart && item.dateEnd) item.date = `${item.dateStart} - ${item.dateEnd}`
  else item.date = item.dateStart || item.dateEnd || ''
}

const addItem = () => {
  props.list.push({
    company: '',
    department: '',
    role: '',
    city: '',
    dateStart: '',
    dateEnd: '',
    date: '',
    desc: ''
  })
}

const removeItem = (idx: number) => {
  props.list.splice(idx, 1)
}
</script>

<style scoped>
@import './editor-styles.css';
</style>
