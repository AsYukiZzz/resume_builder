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
        <!-- 第一行：项目名称 (6) + 角色 (6) -->
        <div class="col-span-6">
          <label class="form-label">项目名称</label>
          <div class="form-input-group group/input">
            <input v-model="item.name" class="form-input pr-8" placeholder="项目名称" />
            <XCircle v-if="item.name" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.name = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">担任角色</label>
          <div class="form-input-group group/input">
            <input v-model="item.role" class="form-input pr-8" placeholder="你的角色" />
            <XCircle v-if="item.role" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.role = ''" />
          </div>
        </div>

        <!-- 第二行：项目链接 (6) + 城市 (6) -->
        <div class="col-span-6">
          <label class="form-label">项目链接</label>
          <div class="form-input-group group/input">
            <input v-model="item.link" class="form-input pr-8" placeholder="https://" />
            <XCircle v-if="item.link" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.link = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">所在城市</label>
          <div class="form-input-group group/input">
            <input v-model="item.city" class="form-input pr-8" placeholder="城市" />
            <XCircle v-if="item.city" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.city = ''" />
          </div>
        </div>

        <!-- 第三行：项目时间 (12列 - 独占一行) -->
        <!-- 这里的改动是为了防止日期选择器在窄屏下溢出 -->
        <div class="col-span-12">
          <label class="form-label">项目时间</label>
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

      <!-- 第四行：项目详情 -->
      <div>
        <label class="form-label">项目详情</label>
        <RichTextEditor
          v-model="item.desc"
          placeholder="详细描述项目背景、技术栈、难点及解决方案..."
        />
      </div>
    </div>

    <!-- 添加按钮 -->
    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加项目经历
    </button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Plus, XCircle } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'

const props = defineProps<{ list: any[] }>()

// 日期拼接逻辑
const updateDate = (item: any) => {
  if (item.dateStart && item.dateEnd) {
    item.date = `${item.dateStart} - ${item.dateEnd}`
  } else {
    item.date = item.dateStart || item.dateEnd || ''
  }
}

// 初始化空数据
const addItem = () => {
  props.list.push({
    name: '',
    role: '',
    city: '',
    link: '',
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
