<template>
  <div
    class="h-full w-full bg-white text-gray-800 p-10"
    :style="{ fontFamily: styleConfig.fontFamily }"
  >
    <template v-for="mod in schema" :key="mod.id">
      <div v-if="moduleStates[mod.id]" class="mb-8">
        <!-- 头部 -->
        <div v-if="mod.id === 'profile'" class="text-center border-b-2 border-gray-900 pb-6 mb-8">
          <h1
            class="font-bold mb-3 tracking-wide text-gray-900"
            :style="{ fontSize: Number(styleConfig.fontSize) + 14 + 'px' }"
          >
            {{ data[mod.id].name || '姓名' }}
          </h1>
          <p class="text-xl text-gray-600 mb-4 font-light">{{ data[mod.id].title }}</p>

          <div class="flex justify-center flex-wrap gap-x-6 gap-y-2 text-gray-600 text-sm px-8">
            <span v-if="data[mod.id].phone" class="flex items-center gap-1 whitespace-nowrap">
              {{ data[mod.id].phone }}
            </span>
            <span v-if="data[mod.id].email" class="flex items-center gap-1 whitespace-nowrap">
              {{ data[mod.id].email }}
            </span>
            <span v-if="data[mod.id].city" class="flex items-center gap-1 whitespace-nowrap">
              {{ data[mod.id].city }}
            </span>
            <span v-if="data[mod.id].github" class="flex items-center gap-1 whitespace-nowrap">
              GitHub: {{ data[mod.id].github }}
            </span>
            
            <!-- 更多信息循环渲染 -->
            <template v-for="field in extraFields" :key="field.key">
              <span v-if="data[mod.id][field.key]" class="flex items-center gap-1 whitespace-nowrap">
                {{ field.label ? field.label + ': ' : '' }}{{ data[mod.id][field.key] }}
              </span>
            </template>
          </div>

          <!-- 直接渲染 HTML -->
          <div
            v-if="data[mod.id].summary"
            class="mt-4 text-gray-700 leading-relaxed prose-content text-left max-w-4xl mx-auto"
            :style="{ fontSize: styleConfig.fontSize + 'px', lineHeight: styleConfig.lineHeight }"
            v-html="data[mod.id].summary"
          ></div>
        </div>

        <!-- 列表 -->
        <div v-else>
          <h3
            class="font-bold text-gray-900 border-b border-gray-300 mb-4 pb-1 uppercase tracking-wider"
            :style="{ fontSize: Number(styleConfig.fontSize) + 2 + 'px' }"
          >
            {{ mod.name }}
          </h3>
          <div v-for="(item, idx) in data[mod.id]" :key="idx" class="mb-5 last:mb-0">
            <div
              class="flex justify-between items-baseline font-bold text-gray-900 mb-1"
              :style="{ fontSize: styleConfig.fontSize + 'px' }"
            >
              <span>{{ item.school || item.company || item.name }}</span>
              <span class="text-sm font-normal text-gray-600 font-mono">{{ item.date }}</span>
            </div>
            <div class="text-gray-700 italic mb-1.5 font-medium flex items-center gap-2">
              <span>{{ item.major || item.role }}</span>
              <span v-if="item.degree" class="text-gray-400 text-xs">|</span>
              <span
                v-if="item.degree"
                class="not-italic"
                >{{ item.degree }}</span
              >
            </div>

            <!-- 直接渲染 HTML -->
            <div
              v-if="item.desc"
              class="text-gray-700 prose-content"
              :style="{ fontSize: styleConfig.fontSize + 'px', lineHeight: styleConfig.lineHeight }"
              v-html="item.desc"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 经典模板组件 (TemplateClassic)
 * 
 * 设计风格：
 * - 简约、传统、正式
 * - 适合大多数行业，特别是传统行业
 * - 强调内容的清晰度和易读性
 * 
 * 布局特点：
 * - 单栏布局，信息从上到下垂直排列
 * - 头部居中，突出姓名和基本信息
 * - 模块之间有清晰的分割线
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
 * 用于在头部循环渲染用户的动态字段（如：性别、年龄、籍贯等）
 * key: 对应数据中的字段名
 * label: 显示的标签文本
 */
const extraFields = [
  { key: 'education', label: '学历' },
  { key: 'experience', label: '经验' },
  { key: 'age', label: '年龄' },
  { key: 'gender', label: '性别' },
  { key: 'status', label: '状态' },
  { key: 'salary', label: '期望' },
  { key: 'wechat', label: '微信' },
  { key: 'website', label: 'Web' },
  { key: 'marriage', label: '婚姻' },
  { key: 'politics', label: '政治' },
  { key: 'hometown', label: '籍贯' },
  { key: 'height', label: '身高' },
  { key: 'weight', label: '体重' }
]
</script>

<style scoped>
:deep(.prose-content ul) {
  list-style-type: disc;
  padding-left: 1.2em;
  margin: 4px 0;
}
:deep(.prose-content ol) {
  list-style-type: decimal;
  padding-left: 1.2em;
  margin: 4px 0;
}
:deep(.prose-content p) {
  margin: 4px 0;
}
:deep(.prose-content strong) {
  font-weight: bold;
  color: #111827;
}
:deep(.prose-content a) {
  color: #2563eb;
  text-decoration: underline;
}
</style>
