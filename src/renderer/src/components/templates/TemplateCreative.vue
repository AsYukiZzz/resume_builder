<template>
  <div
    class="h-full w-full bg-white text-slate-800"
    :style="{ fontFamily: styleConfig.fontFamily }"
  >
    <!-- 顶部彩色横幅 -->
    <div class="h-4 bg-teal-600 w-full"></div>

    <div class="p-10">
      <!-- 头部：左右布局 -->
      <div v-if="moduleStates['profile']" class="flex justify-between items-start mb-12 pb-8 border-b-2 border-teal-100">
        <div>
          <h1
            class="font-extrabold text-teal-900 leading-tight mb-2"
            :style="{ fontSize: Number(styleConfig.fontSize) + 24 + 'px' }"
          >
            {{ data.profile.name || 'Your Name' }}
          </h1>
          <p class="text-xl text-teal-600 font-medium tracking-wide">{{ data.profile.title || 'Job Title' }}</p>
        </div>
        
        <div class="text-right space-y-1.5 text-sm text-slate-600">
          <div v-if="data.profile.phone" class="flex items-center justify-end gap-2">
            <span>{{ data.profile.phone }}</span>
            <span class="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
          </div>
          <div v-if="data.profile.email" class="flex items-center justify-end gap-2">
            <span>{{ data.profile.email }}</span>
            <span class="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
          </div>
          <div v-if="data.profile.city" class="flex items-center justify-end gap-2">
            <span>{{ data.profile.city }}</span>
            <span class="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
          </div>
          <div v-if="data.profile.github" class="flex items-center justify-end gap-2">
            <span>{{ data.profile.github }}</span>
            <span class="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
          </div>

          <!-- 更多信息循环渲染 -->
          <template v-for="field in extraFields" :key="field.key">
            <div v-if="data.profile[field.key]" class="flex items-center justify-end gap-2">
              <span>{{ field.label ? field.label + ': ' : '' }}{{ data.profile[field.key] }}</span>
              <span class="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
            </div>
          </template>
        </div>
      </div>

      <!-- 简介 -->
      <div v-if="data.profile.summary" class="mb-10 bg-slate-50 p-6 rounded-r-xl border-l-4 border-teal-500">
        <h3 class="text-teal-800 font-bold uppercase tracking-wider text-xs mb-3">About Me</h3>
        <div
          class="text-slate-700 leading-relaxed prose-content"
          :style="{ fontSize: styleConfig.fontSize + 'px', lineHeight: styleConfig.lineHeight }"
          v-html="data.profile.summary"
        ></div>
      </div>

      <!-- 模块循环 -->
      <template v-for="mod in schema" :key="mod.id">
        <div v-if="moduleStates[mod.id] && mod.id !== 'profile'" class="mb-10">
          <!-- 标题：带图标风格的方块 -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-teal-600 text-white flex items-center justify-center rounded-lg shadow-sm shadow-teal-200">
              <span class="font-bold text-lg">{{ mod.name.charAt(0) }}</span>
            </div>
            <h3
              class="font-bold text-slate-900"
              :style="{ fontSize: Number(styleConfig.fontSize) + 4 + 'px' }"
            >
              {{ mod.name }}
            </h3>
          </div>

          <!-- 列表内容 -->
          <div class="space-y-6 pl-3">
            <div v-for="(item, idx) in data[mod.id]" :key="idx" class="relative pl-6 border-l border-slate-200 hover:border-teal-300 transition-colors pb-1 last:pb-0">
              <!-- 时间轴圆点 -->
              <div class="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-white border-2 border-teal-500 rounded-full"></div>

              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <div class="font-bold text-slate-800 text-lg">
                  {{ item.school || item.company || item.name }}
                </div>
                <div class="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-0.5 rounded-full">
                  {{ item.date }}
                </div>
              </div>
              
              <div v-if="item.major || item.role" class="mb-3 text-slate-600 font-medium">
                {{ item.major || item.role }}
                <span v-if="item.degree" class="text-slate-400 mx-1">•</span>
                <span v-if="item.degree">{{ item.degree }}</span>
              </div>

              <div
                v-if="item.desc"
                class="text-slate-600 prose-content"
                :style="{ fontSize: styleConfig.fontSize + 'px', lineHeight: styleConfig.lineHeight }"
                v-html="item.desc"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps(['data', 'schema', 'moduleStates', 'styleConfig'])

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
  list-style-type: none;
  padding-left: 0;
  margin: 4px 0;
}
:deep(.prose-content ul li) {
  position: relative;
  padding-left: 1.2em;
  margin-bottom: 0.25em;
}
:deep(.prose-content ul li::before) {
  content: '▹';
  position: absolute;
  left: 0;
  color: #0d9488; /* teal-600 */
}
:deep(.prose-content ol) {
  list-style-type: decimal;
  padding-left: 1.2em;
  margin: 4px 0;
  color: #475569;
}
:deep(.prose-content p) {
  margin: 4px 0;
}
:deep(.prose-content strong) {
  font-weight: 700;
  color: #0f766e; /* teal-700 */
}
</style>
