<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8 dark:bg-slate-900 dark:border-slate-800"
  >
    <!-- 第一行：姓名 + 电话 (2列) -->
    <div class="grid grid-cols-2 gap-5">
      <div>
        <label class="form-label">姓名</label
        ><input v-model="modelValue.name" class="form-input" placeholder="请输入姓名" />
      </div>
      <div>
        <label class="form-label">电话</label
        ><input v-model="modelValue.phone" class="form-input" placeholder="手机号" />
      </div>
    </div>

    <!-- 第二行：邮箱 (独占一行，防止不够宽) -->
    <div>
      <label class="form-label">邮箱</label
      ><input v-model="modelValue.email" class="form-input" placeholder="邮箱地址" />
    </div>

    <!-- 第三行：头像 + 微信号 -->
    <div class="flex gap-6">
      <div class="w-28 shrink-0">
        <div class="flex justify-between items-center mb-1.5">
          <label class="form-label !mb-0">头像</label>
          <button
            @click="modelValue.avatarAlign = modelValue.avatarAlign === 'left' ? 'right' : 'left'"
            class="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 hover:text-indigo-600 transition dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            {{ modelValue.avatarAlign === 'left' ? '左对齐' : '右对齐' }}
          </button>
        </div>
        <div
          @click="triggerFileUpload"
          class="w-28 h-32 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer transition overflow-hidden relative group dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-indigo-500"
        >
          <img
            v-if="modelValue.avatar"
            :src="modelValue.avatar"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex flex-col items-center gap-1">
            <Plus :size="20" /><span class="text-[10px]">上传照片</span>
          </div>
          <div
            v-if="modelValue.avatar"
            class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition"
          >
            更换
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>
      <div class="flex-1 pt-6">
        <label class="form-label flex justify-between"
          ><span>微信号</span
          ><X
            v-if="modelValue.wechat"
            @click="modelValue.wechat = ''"
            :size="12"
            class="cursor-pointer text-gray-300 hover:text-red-500 dark:text-slate-600"
        /></label>
        <input v-model="modelValue.wechat" class="form-input" placeholder="请输入微信号 (选填)" />
      </div>
    </div>

    <!-- 求职意向 -->
    <div>
      <h3 class="section-title">求职意向</h3>
      <div class="grid grid-cols-2 gap-5">
        <div>
          <label class="form-label">当前状态</label>
          <div class="relative group/select">
            <select
              v-model="modelValue.status"
              class="form-input appearance-none cursor-pointer pr-8"
            >
              <option value="">请选择</option>
              <option>随时到岗</option>
              <option>月内到岗</option>
              <option>考虑机会</option>
              <option>暂不考虑</option></select
            ><ChevronDown
              :size="14"
              class="absolute right-3 top-3 text-gray-400 pointer-events-none dark:text-slate-500"
            />
          </div>
        </div>
        <div>
          <label class="form-label">期望薪资</label
          ><input v-model="modelValue.salary" class="form-input" placeholder="如: 15k-20k" />
        </div>
        <div>
          <label class="form-label">职位名称</label
          ><input v-model="modelValue.title" class="form-input" placeholder="如: Java开发" />
        </div>
        <div>
          <label class="form-label">期望工作地</label
          ><input v-model="modelValue.city" class="form-input" placeholder="如: 北京" />
        </div>
      </div>
    </div>

    <!-- 其他信息 -->
    <div>
      <h3 class="section-title">其他信息</h3>
      <div class="grid grid-cols-2 gap-5">
        <div>
          <label class="form-label">最高学历</label>
          <div class="relative group/select">
            <select
              v-model="modelValue.education"
              class="form-input appearance-none cursor-pointer pr-8"
            >
              <option value="">请选择</option>
              <option>博士</option>
              <option>硕士</option>
              <option>本科</option>
              <option>大专</option></select
            ><ChevronDown
              :size="14"
              class="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
        <div>
          <label class="form-label">个人网站</label
          ><input v-model="modelValue.website" class="form-input" placeholder="https://" />
        </div>
      </div>
    </div>

    <!-- 更多动态字段 -->
    <div>
      <h3 class="section-title">更多信息</h3>
      <div class="grid grid-cols-3 gap-4 mb-4" v-if="activeExtras.length > 0">
        <div v-for="key in activeExtras" :key="key" class="relative group animate-fade-in">
          <label class="form-label">{{ getExtraLabel(key) }}</label
          ><input v-model="modelValue[key]" class="form-input" /><XCircle
            :size="14"
            class="absolute right-2 top-8 text-gray-300 cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
            @click="removeExtraField(key)"
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="field in availableExtras"
          :key="field.key"
          @click="addExtraField(field.key)"
          class="tag-btn"
        >
          <Plus :size="12" /> {{ field.label }}
        </button>
      </div>
    </div>

    <!-- 个人简介 -->
    <div>
      <h3 class="section-title !mb-2">个人简介</h3>
      <RichTextEditor v-model="modelValue.summary" placeholder="简要介绍你的核心优势..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, X, XCircle, ChevronDown } from 'lucide-vue-next'
import RichTextEditor from '../RichTextEditor.vue'

// --- Props & State ---
const props = defineProps<{ modelValue: any }>() // 双向绑定的数据对象
const fileInput = ref<HTMLInputElement | null>(null) // 文件上传 input 引用

// --- 动态字段配置 ---
// 定义所有可选的额外字段及其对应 key
const extraFieldsConfig = [
  { label: 'GitHub', key: 'github' },
  { label: '年龄', key: 'age' },
  { label: '工作年限', key: 'experience' },
  { label: '性别', key: 'gender' },
  { label: '身高', key: 'height' },
  { label: '体重', key: 'weight' },
  { label: '籍贯', key: 'hometown' },
  { label: '政治面貌', key: 'politics' },
  { label: '婚姻状况', key: 'marriage' }
]

// 当前已激活显示的额外字段 key 列表
const activeExtrasKeys = ref<string[]>([])

// 计算属性：已激活的字段列表
const activeExtras = computed(() => activeExtrasKeys.value)

// 计算属性：剩余可添加的字段列表
const availableExtras = computed(() =>
  extraFieldsConfig.filter((item) => !activeExtrasKeys.value.includes(item.key))
)

// 获取字段显示的 Label
const getExtraLabel = (key: string) => extraFieldsConfig.find((i) => i.key === key)?.label || key

// --- Actions: 动态字段管理 ---

/**
 * 添加一个额外字段
 * @param key 字段 Key
 */
const addExtraField = (key: string) => activeExtrasKeys.value.push(key)

/**
 * 移除一个额外字段，并清空对应的数据
 * @param key 字段 Key
 */
const removeExtraField = (key: string) => {
  props.modelValue[key] = ''
  activeExtrasKeys.value = activeExtrasKeys.value.filter((k) => k !== key)
}

/**
 * 初始化显示的动态字段
 * 检查 modelValue 中是否有值，如果有值则自动将其加入显示列表
 * (主要用于从文件导入简历数据时恢复显示状态)
 */
const initActiveExtras = () => {
  if (!props.modelValue) return
  
  // 遍历配置中的所有可能的动态字段
  extraFieldsConfig.forEach(field => {
    // 如果 modelValue 中有值且不为空，且当前未激活，则添加到激活列表
    if (props.modelValue[field.key] && !activeExtrasKeys.value.includes(field.key)) {
      activeExtrasKeys.value.push(field.key)
    }
  })
}

// 监听数据变化，自动更新显示的字段（主要用于导入数据时）
watch(() => props.modelValue, initActiveExtras, { deep: true, immediate: true })

// --- Actions: 头像上传 ---

const triggerFileUpload = () => fileInput.value?.click()

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (props.modelValue.avatar = e.target?.result as string)
    reader.readAsDataURL(file)
  }
  input.value = '' // 清空 input，允许重复上传同一文件
}
</script>

<style scoped>
@import './editor-styles.css';
</style>
