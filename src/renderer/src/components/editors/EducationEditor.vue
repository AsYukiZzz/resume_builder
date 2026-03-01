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

      <div class="grid grid-cols-12 gap-x-4 gap-y-5 mb-5">
        <!-- 第一行：学校 (8) + 城市 (4) -->
        <div class="col-span-8">
          <label class="form-label">学校名称</label>
          <div class="form-input-group group/input">
            <input v-model="item.school" class="form-input pr-8" placeholder="学校名称" />
            <XCircle v-if="item.school" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.school = ''" />
          </div>
        </div>
        <div class="col-span-4">
          <label class="form-label">所在城市</label>
          <div class="form-input-group group/input">
            <input v-model="item.city" class="form-input pr-8" placeholder="省/市" />
            <XCircle v-if="item.city" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.city = ''" />
          </div>
        </div>

        <!-- 第二行：专业 (6) + 学历 (6) -->
        <div class="col-span-6">
          <label class="form-label">专业</label>
          <div class="form-input-group group/input">
            <input v-model="item.major" class="form-input pr-8" placeholder="所学专业" />
            <XCircle v-if="item.major" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.major = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">学历</label>
          <div class="relative group/select">
            <select
              v-model="item.degree"
              class="form-input appearance-none cursor-pointer pr-8"
            >
              <option value="">请选择</option>
              <option>博士</option>
              <option>硕士</option>
              <option>本科</option>
              <option>大专</option>
            </select>
            <ChevronDown
              :size="14"
              class="absolute right-3 top-3 text-gray-400 group-hover/select:text-indigo-500 transition-colors pointer-events-none"
            />
          </div>
        </div>

        <!-- 第三行：学院 (6) + 类型 (6) -->
        <div class="col-span-6">
          <label class="form-label">学院</label>
          <div class="form-input-group group/input">
            <input v-model="item.college" class="form-input pr-8" placeholder="所属学院" />
            <XCircle v-if="item.college" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.college = ''" />
          </div>
        </div>
        <div class="col-span-6">
          <label class="form-label">学历类型</label>
          <div class="form-input-group group/input">
            <input v-model="item.degreeType" class="form-input pr-8" placeholder="全日制" />
            <XCircle v-if="item.degreeType" :size="18" class="clear-btn" fill="currentColor" fill-opacity="0.2" stroke-width="2" @click="item.degreeType = ''" />
          </div>
        </div>

        <!-- 第四行：时间 (12) -->
        <div class="col-span-12">
          <label class="form-label">在读时间</label>
          <div class="flex items-center gap-3">
            <input
              type="month"
              v-model="item.dateStart"
              @change="updateDate(item)"
              class="form-input"
            />
            <span class="text-gray-400 font-bold">-</span>
            <input
              type="month"
              v-model="item.dateEnd"
              @change="updateDate(item)"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <div>
        <label class="form-label">在校经历</label>
        <RichTextEditor v-model="item.desc" placeholder="主修课程、奖学金、社团活动..." />
      </div>
    </div>

    <button @click="addItem" class="add-btn group">
      <Plus :size="18" class="group-hover:scale-110 transition-transform" />
      添加教育经历
    </button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, ChevronDown, Plus, XCircle } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'

const props = defineProps<{ list: any[] }>()

const updateDate = (item: any) => {
  if (item.dateStart && item.dateEnd) item.date = `${item.dateStart} - ${item.dateEnd}`
  else item.date = item.dateStart || item.dateEnd || ''
}

const addItem = () =>
  props.list.push({
    school: '',
    major: '',
    degree: '',
    dateStart: '',
    dateEnd: '',
    degreeType: '全日制',
    college: '',
    city: '',
    desc: '',
    date: ''
  })
const removeItem = (idx: number) => props.list.splice(idx, 1)
</script>

<style scoped>
@import './editor-styles.css';
</style>
