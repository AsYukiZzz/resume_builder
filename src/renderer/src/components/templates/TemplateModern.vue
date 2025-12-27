<template>
  <div class="h-full w-full bg-white flex" :style="{ fontFamily: styleConfig.fontFamily }">
    <!-- 左侧 -->
    <div class="w-1/3 bg-slate-800 text-white p-8 pt-12 flex flex-col h-full">
      <!-- 个人信息 -->
      <div v-if="moduleStates['profile']" class="mb-10">
        <h1
          class="font-bold mb-3 text-white leading-tight"
          :style="{ fontSize: Number(styleConfig.fontSize) + 12 + 'px' }"
        >
          {{ data.profile.name || '姓名' }}
        </h1>
        <p class="text-blue-200 text-lg mb-8 font-medium">{{ data.profile.title }}</p>

        <div class="space-y-3 text-sm text-gray-300 mb-8">
          <div v-if="data.profile.phone" class="flex items-center gap-2">
            <span class="opacity-70">P:</span>
            <span>{{ data.profile.phone }}</span>
          </div>
          <div v-if="data.profile.email" class="flex items-center gap-2 break-all">
            <span class="opacity-70">E:</span>
            <span>{{ data.profile.email }}</span>
          </div>
          <div v-if="data.profile.city" class="flex items-center gap-2">
            <span class="opacity-70">A:</span>
            <span>{{ data.profile.city }}</span>
          </div>
          <div v-if="data.profile.github" class="flex items-center gap-2 break-all">
            <span class="opacity-70">G:</span>
            <span>{{ data.profile.github }}</span>
          </div>

          <!-- 更多信息循环渲染 -->
          <template v-for="field in extraFields" :key="field.key">
            <div v-if="data.profile[field.key]" class="flex items-center gap-2 break-all">
              <span class="opacity-70">{{ field.label }}:</span>
              <span>{{ data.profile[field.key] }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- 技能模块 (固定在侧边栏) -->
      <div v-if="moduleStates['skill']" class="flex-1">
        <h3 class="text-white font-bold border-b border-gray-600 pb-2 mb-4 uppercase text-sm tracking-widest">
          技能
        </h3>
        <div class="flex flex-col gap-4">
          <div v-for="(item, idx) in data['skill']" :key="idx" class="w-full">
            <div class="text-blue-200 font-bold text-sm flex justify-between mb-1">
              <span>{{ item.name }}</span>
              <span class="text-xs opacity-70 bg-slate-700 px-1.5 py-0.5 rounded">{{ item.level }}</span>
            </div>
            <!-- 直接渲染 HTML -->
            <div class="text-xs text-gray-400 prose-content-dark leading-relaxed" v-html="item.desc"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="w-2/3 p-8 pt-12 bg-white text-gray-800">
      <!-- 简介 -->
      <div v-if="data.profile.summary && moduleStates['profile']" class="mb-10">
        <h3 class="text-slate-800 font-bold text-lg mb-3 uppercase tracking-wider border-b-2 border-slate-100 pb-1 inline-block">简介</h3>
        <!-- 直接渲染 HTML -->
        <div
          class="text-gray-600 leading-relaxed prose-content"
          :style="{ fontSize: styleConfig.fontSize + 'px', lineHeight: styleConfig.lineHeight }"
          v-html="data.profile.summary"
        ></div>
      </div>

      <!-- 主体模块循环 -->
      <template v-for="mod in schema" :key="mod.id">
        <div v-if="moduleStates[mod.id] && mod.id !== 'profile' && mod.id !== 'skill'" class="mb-8">
          <h3 class="text-blue-700 font-bold text-lg mb-5 flex items-center gap-3">
            <span class="w-1.5 h-5 bg-blue-600 rounded-sm shadow-sm shadow-blue-200"></span>
            <span class="uppercase tracking-wider">{{ mod.name }}</span>
          </h3>
          
          <div
            v-for="(item, idx) in data[mod.id]"
            :key="idx"
            class="mb-6 pl-5 border-l-2 border-blue-50 hover:border-blue-100 transition-colors"
          >
            <div class="flex justify-between items-baseline mb-1">
              <span class="font-bold text-gray-900 text-lg">{{
                item.school || item.company || item.name
              }}</span>
              <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{{
                item.date
              }}</span>
            </div>
            
            <div class="text-blue-600 font-medium text-sm mb-2 flex items-center gap-2">
               <span>{{ item.role || item.major }}</span>
               <span v-if="item.degree" class="w-1 h-1 bg-blue-300 rounded-full"></span>
               <span v-if="item.degree">{{ item.degree }}</span>
            </div>

            <!-- 列表描述渲染: 直接使用 v-html -->
            <div
              class="text-gray-600 text-sm prose-content"
              :style="{ lineHeight: styleConfig.lineHeight, fontSize: styleConfig.fontSize + 'px' }"
              v-html="item.desc"
            ></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 现代模板组件 (TemplateModern)
 * 
 * 设计风格：
 * - 现代、时尚、有设计感
 * - 适合互联网、设计、创意类岗位
 * 
 * 布局特点：
 * - 双栏布局：左侧深色侧边栏，右侧白色主内容区
 * - 个人信息和技能模块通常固定在左侧侧边栏
 * - 主内容区展示教育、工作经历等详细信息
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
 * 用于在侧边栏循环渲染用户的动态字段
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
/* 通用样式 */
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
  margin: 2px 0;
}
:deep(.prose-content strong) {
  font-weight: 700;
  color: #1e293b;
}

/* 暗色背景下的样式 */
:deep(.prose-content-dark ul) {
  list-style-type: square;
  padding-left: 1.2em;
  margin: 2px 0;
}
:deep(.prose-content-dark p) {
  margin: 1px 0;
}
:deep(.prose-content-dark strong) {
  color: #e2e8f0;
  font-weight: 600;
}
</style>
