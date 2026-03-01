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
        <!-- 行1：奖项名称 (6) + 时间 (6) -->
        <div class="col-span-6">
          <label class="form-label">奖项名称</label>
          <div class="form-input-group group/input">
            <input v-model="item.name" class="form-input pr-8" placeholder="奖项/证书名称" />
            <XCircle v-if="item.name" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.name = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">获奖时间</label>
          <input type="month" v-model="item.date" class="form-input" />
        </div>
      </div>

      <!-- 第二行：详情描述 -->
      <div>
        <label class="form-label">奖项描述 / 级别</label>
        <RichTextEditor v-model="item.desc" placeholder="如：校级一等奖，全校前 5%..." />
      </div>
    </div>

    <!-- 添加按钮 -->
    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加荣誉奖项
    </button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Plus, XCircle } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'

const props = defineProps<{ list: any[] }>()

const addItem = () => {
  props.list.push({ name: '', date: '', desc: '' })
}

const removeItem = (idx: number) => {
  props.list.splice(idx, 1)
}
</script>

<style scoped>
@import './editor-styles.css';
</style>
