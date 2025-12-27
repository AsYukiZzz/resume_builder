<template>
  <div
    class="w-full min-h-full bg-white text-gray-800 px-10 py-8"
    :style="{ fontFamily: styleConfig.fontFamily }"
  >
    <!-- Header (紧凑版) -->
    <header class="flex items-center justify-between mb-2 relative">
      <div class="flex-1 pr-6">
        <div class="flex items-baseline gap-4 mb-2">
          <h1
            class="font-bold tracking-wide text-gray-900 leading-none"
            :style="{ fontSize: Number(styleConfig.fontSize) + 12 + 'px' }"
          >
            {{ data.profile.name || '您的姓名' }}
          </h1>
          <div
            v-if="data.profile.title"
            class="flex items-center gap-2 text-sky-700 font-medium"
            :style="{ fontSize: Number(styleConfig.fontSize) + 'px' }"
          >
            <span>{{ data.profile.title }}</span
            ><span
              v-if="data.profile.status"
              class="text-gray-400 text-xs font-normal border-l border-gray-300 pl-2"
              >{{ data.profile.status }}</span
            >
          </div>
        </div>
        <div
          class="flex flex-wrap gap-x-5 gap-y-1.5 text-gray-600 mb-2"
          :style="{ fontSize: Number(styleConfig.fontSize) - 1 + 'px' }"
        >
          <div v-if="data.profile.phone" class="flex items-center gap-1.5">
            <PhoneIcon :size="12" class="text-sky-600" /><span>{{ data.profile.phone }}</span>
          </div>
          <div v-if="data.profile.email" class="flex items-center gap-1.5">
            <MailIcon :size="12" class="text-sky-600" /><span>{{ data.profile.email }}</span>
          </div>
          <div v-if="data.profile.wechat" class="flex items-center gap-1.5">
            <MessageSquareIcon :size="12" class="text-sky-600" /><span>{{
              data.profile.wechat
            }}</span>
          </div>
          <div v-if="data.profile.city" class="flex items-center gap-1.5">
            <MapPinIcon :size="12" class="text-sky-600" /><span>{{ data.profile.city }}</span>
          </div>
          <div v-if="data.profile.website" class="flex items-center gap-1.5">
            <GlobeIcon :size="12" class="text-sky-600" /><a
              :href="data.profile.website"
              class="underline decoration-sky-200"
              >{{ data.profile.website }}</a
            >
          </div>
        </div>
        <div class="flex flex-wrap gap-2 text-xs text-gray-500">
          <span
            v-if="data.profile.age"
            class="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded"
            >{{ data.profile.age }}岁</span
          >
          <span
            v-if="data.profile.experience"
            class="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded"
            >{{ data.profile.experience }}年经验</span
          >
          <span
            v-if="data.profile.education"
            class="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded"
            >{{ data.profile.education }}</span
          >
          <span
            v-if="data.profile.github"
            class="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"
            >Github: {{ data.profile.github }}</span
          >
          
          <!-- 更多信息循环渲染 -->
          <template v-for="field in extraFields" :key="field.key">
            <span
              v-if="data.profile[field.key]"
              class="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded"
            >
              {{ field.label ? field.label + ': ' : '' }}{{ data.profile[field.key] }}
            </span>
          </template>
        </div>
      </div>
      <div class="flex flex-col items-center gap-2 shrink-0">
        <div
          v-if="data.profile.avatar"
          class="w-20 h-24 bg-gray-100 overflow-hidden rounded shadow-sm border border-gray-200"
        >
          <img :src="data.profile.avatar" class="w-full h-full object-cover" />
        </div>
        <div
          v-if="data.university && data.university.logo"
          class="h-8 flex justify-center items-center"
        >
          <img
            :src="data.university.logo"
            class="max-w-full max-h-full object-contain filter multiply opacity-80"
          />
        </div>
      </div>
    </header>

    <template v-for="mod in schema" :key="mod.id">
      <div
        v-if="moduleStates[mod.id] && mod.id !== 'profile' && mod.id !== 'university'"
        class="mb-5"
      >
        <div class="flex items-center border-b border-sky-600/30 mb-3 break-after-avoid">
          <h3
            class="bg-sky-600 text-white px-4 py-1 text-sm font-bold tracking-widest relative top-[1px] shadow-sm"
          >
            {{ mod.name }}
          </h3>
        </div>
        <div v-if="mod.id === 'skill'" class="space-y-2">
          <div
            v-for="(item, idx) in data[mod.id]"
            :key="idx"
            class="flex items-start"
          >
            <div
              class="text-gray-700 prose-content flex-1 text-sm leading-snug"
              :style="{ lineHeight: styleConfig.lineHeight, fontSize: styleConfig.fontSize + 'px' }"
              v-html="item.desc"
            ></div>
          </div>
        </div>
        <div v-else class="space-y-4">
          <div v-for="(item, idx) in data[mod.id]" :key="idx">
            <div class="flex justify-between items-baseline mb-1">
              <div class="flex items-center gap-2 max-w-[60%]">
                <span
                  class="font-bold text-gray-900"
                  :style="{ fontSize: Number(styleConfig.fontSize) + 1 + 'px' }"
                  >{{ item.school || item.company || item.name }}</span
                ><span v-if="item.college" class="text-xs text-gray-500 font-normal"
                  >({{ item.college }})</span
                >
              </div>
              <div
                v-if="item.major || item.role"
                class="font-bold text-gray-700 text-sm flex items-center gap-2"
              >
                <span>{{ item.major || item.role }}</span
                ><span
                  v-if="item.degree || item.degreeType"
                  class="text-[10px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded border border-gray-200 font-normal"
                  >{{ item.degree }}
                  <span v-if="item.degreeType">· {{ item.degreeType }}</span></span
                >
              </div>
              <span
                v-if="item.date"
                class="text-sky-600 font-mono font-medium text-xs whitespace-nowrap"
                >{{ item.date }}</span
              >
            </div>
            <div v-if="item.city" class="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1">
              <MapPinIcon :size="10" />{{ item.city }}
            </div>
            <div
              v-if="item.desc"
              class="text-gray-700 prose-content pl-1 text-sm leading-snug"
              :style="{ lineHeight: styleConfig.lineHeight, fontSize: styleConfig.fontSize + 'px' }"
              v-html="item.desc"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  GlobeIcon
} from 'lucide-vue-next'

/**
 * 专业模板组件 (TemplateProfessional)
 * 
 * 设计风格：
 * - 紧凑、高效、专业
 * - 适合学术、科研、咨询等信息密度较高的场景
 * 
 * 布局特点：
 * - 单栏布局，但利用率极高
 * - 头部紧凑，横向排列个人信息
 * - 模块标题带有背景色，区分度高
 * - 适合内容较多的简历
 */

// --- Props 定义 ---
defineProps<{
  data: any           // 简历所有模块的数据
  schema: any[]       // 模块配置列表（用于渲染顺序）
  moduleStates: any   // 模块显示/隐藏状态
  styleConfig: any    // 全局样式配置（字体、字号等）
}>()

/**
 * 额外字段配置列表
 * 用于在头部横向排列用户的动态字段
 * key: 对应数据中的字段名
 * label: 显示的标签文本
 */
const extraFields = [
  { key: 'gender', label: '性别' },
  { key: 'marriage', label: '婚姻' },
  { key: 'politics', label: '政治' },
  { key: 'hometown', label: '籍贯' },
  { key: 'height', label: '身高' },
  { key: 'weight', label: '体重' },
  { key: 'salary', label: '期望' }
]
</script>

<style scoped>
.break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}
.break-after-avoid {
  break-after: avoid;
  page-break-after: avoid;
}

:deep(.prose-content p) {
  margin: 2px 0;
  text-align: justify;
  white-space: pre-wrap;
}
:deep(.prose-content ul) {
  list-style-type: disc;
  padding-left: 1.2em;
  margin: 4px 0;
  color: #374151;
}
:deep(.prose-content ol) {
  list-style-type: decimal;
  padding-left: 1.2em;
  margin: 4px 0;
}
:deep(.prose-content li) {
  margin-bottom: 2px;
  text-align: justify;
}
:deep(.prose-content strong) {
  font-weight: 700;
  color: #111827;
}
:deep(.prose-content em) {
  font-style: italic;
  color: #4b5563;
}
:deep(.prose-content a) {
  color: #0284c7;
  text-decoration: underline;
}
</style>
