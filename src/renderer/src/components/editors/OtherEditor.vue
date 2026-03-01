<template>
  <div class="space-y-5">
    <div
      v-for="(item, idx) in list"
      :key="idx"
      class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all relative group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500/50"
    >
      <!-- 序号 & 删除 -->
      <div class="index-badge">{{ idx + 1 }}</div>
      <button @click="removeItem(idx)" class="delete-btn">
        <Trash2 :size="16" />
      </button>

      <div class="grid grid-cols-12 gap-x-4 gap-y-5 mb-5">
        <!-- 行1：经历名称 (6) + 角色 (6) -->
        <div class="col-span-6">
          <label class="form-label">经历名称</label>
          <div class="form-input-group group/input">
            <input v-model="item.name" class="form-input pr-8" placeholder="经历名称" />
            <XCircle v-if="item.name" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.name = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">担任角色</label>
          <div class="form-input-group group/input">
            <input v-model="item.role" class="form-input pr-8" placeholder="角色" />
            <XCircle v-if="item.role" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.role = ''" />
          </div>
        </div>

        <!-- 行2：所属组织 (6) + 城市 (6) -->
        <div class="col-span-6">
          <label class="form-label">所属组织</label>
          <div class="form-input-group group/input">
            <input v-model="item.department" class="form-input pr-8" placeholder="组织名称" />
            <XCircle v-if="item.department" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.department = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">所在城市</label>
          <div class="form-input-group group/input">
            <input v-model="item.city" class="form-input pr-8" placeholder="城市" />
            <XCircle v-if="item.city" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.city = ''" />
          </div>
        </div>

        <!-- 行3：经历时间 (12列 - 独占一行) -->
        <div class="col-span-12">
          <label class="form-label">经历时间</label>
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
        <label class="form-label">经历详情</label>
        <RichTextEditor v-model="item.desc" placeholder="简单介绍这段经历的主要内容和成果..." />
      </div>
    </div>

    <!-- 添加按钮 -->
    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加其他经历
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
