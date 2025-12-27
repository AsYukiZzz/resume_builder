<template>
  <div class="space-y-5">
    <div
      v-for="(item, idx) in list"
      :key="idx"
      class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all relative group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500/50"
    >
      <div class="index-badge">{{ idx + 1 }}</div>
      <button @click="removeItem(idx)" class="delete-btn">
        <Trash2 :size="16" />
      </button>

      <div class="grid grid-cols-12 gap-x-4 gap-y-5 mb-6">
        <!-- 行1：项目名称 (8) + 城市 (4) -->
        <div class="col-span-8">
          <label class="form-label">项目名称</label>
          <input v-model="item.name" class="form-input" placeholder="请输入研究项目名称" />
        </div>
        <div class="col-span-4">
          <label class="form-label">所在城市</label>
          <input v-model="item.city" class="form-input" placeholder="如：杭州" />
        </div>

        <!-- 行2：角色 (6) + 部门 (6) -->
        <div class="col-span-6">
          <label class="form-label">担任角色</label>
          <input v-model="item.role" class="form-input" placeholder="如：研究员" />
        </div>
        <div class="col-span-6">
          <label class="form-label">所属部门</label>
          <input v-model="item.department" class="form-input" placeholder="如：研发部" />
        </div>

        <!-- 行3：研究时间 (12 - 独占一行) -->
        <div class="col-span-12">
          <label class="form-label">研究时间</label>
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

      <!-- 行4：详情 -->
      <div>
        <label class="form-label">研究详情</label>
        <RichTextEditor
          v-model="item.desc"
          placeholder="简短明确地写清楚自己负责的研究项目和介绍..."
        />
      </div>
    </div>

    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加研究经历
    </button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Plus } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'

const props = defineProps<{ list: any[] }>()

const updateDate = (item: any) => {
  if (item.dateStart && item.dateEnd) item.date = `${item.dateStart} - ${item.dateEnd}`
  else item.date = item.dateStart || item.dateEnd || ''
}

const addItem = () => {
  props.list.push({
    name: '',
    role: '',
    department: '',
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
